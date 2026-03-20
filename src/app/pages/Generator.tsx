import { useState, useCallback, useEffect } from "react";
import { App } from "antd";
import { useLocation, useParams } from "react-router";
import { GeneratorChat } from "../components/ui/GeneratorChat";
import { ScenarioTable } from "../components/ui/ScenarioTable";
import { SaveToRepoModal } from "../components/ui/SaveToRepoModal";
import type { GeneratorMessage, Scenario, TestType, GenerateMode, RepoFolder, RepoItem } from "../lib/mock-data";
import { mockGeneratedScenarios, mockApiScenarios, currentUser } from "../lib/mock-data";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addFolder, addItem } from "../../store/repoSlice";

const CATEGORY_MAP: Record<string, string> = {
  positive: "Positive",
  negative: "Negative",
  "edge-case": "Edge Case",
};

export function Generator() {
  const { message } = App.useApp();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();

  const repoFolders = useAppSelector((s) =>
    s.repo.folders[projectId ?? ""] ?? []
  );
  const jiraStories = useAppSelector(
    (s) => s.projectConfig.jira[projectId ?? ""]?.stories ?? []
  );
  const jiraEpics = useAppSelector(
    (s) => s.projectConfig.jira[projectId ?? ""]?.epics ?? []
  );

  const [messages, setMessages] = useState<GeneratorMessage[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);
  const [viewMode, setViewMode] = useState<"scenario" | "testcase">("scenario");
  const [activeTestType, setActiveTestType] = useState<TestType | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [savingAsScript, setSavingAsScript] = useState(false);
  const [shouldResetAfterSave, setShouldResetAfterSave] = useState(false);
  const [sourceStory, setSourceStory] = useState<string>("");
  const [initialScriptView, setInitialScriptView] = useState<{ scenarios: Scenario[]; framework?: string } | null>(null);
  const [isRestoredFromSave, setIsRestoredFromSave] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(undefined);

  // Restore state from repo edit navigation
  useEffect(() => {
    const state = location.state as {
      repoItem?: RepoItem;
      scenarios?: Scenario[];
      testType?: TestType;
      showTestCases?: boolean;
      mode?: GenerateMode;
      openScriptView?: boolean;
      scriptFramework?: string;
      sourceStory?: string;
      chatMessages?: GeneratorMessage[];
    } | null;

    if (state?.scenarios && state.scenarios.length > 0) {
      const sc = state.scenarios;
      const testType = state.testType ?? sc[0].type;
      const mode = state.mode ?? "scenario-testcase";
      const hasTC = state.showTestCases !== false;
      const story = state.sourceStory ?? sc[0].title;

      if (state.chatMessages && state.chatMessages.length > 0) {
        setMessages(state.chatMessages);
      } else {
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages([
          {
            id: `msg-repo-${Date.now()}`,
            role: "user",
            content: story,
            testType,
            mode,
            timestamp: now,
          },
          {
            id: `msg-repo-${Date.now() + 1}`,
            role: "assistant",
            content: `Loaded ${sc.length} scenario(s) from repository${hasTC ? " with test cases" : ""}.`,
            scenarios: sc,
            timestamp: now,
          },
        ]);
      }
      setScenarios(sc);
      setShowTestCases(hasTC);
      setActiveTestType(testType);
      setSourceStory(story);

      if (state.openScriptView) {
        setInitialScriptView({ scenarios: sc, framework: state.scriptFramework });
      }

      window.history.replaceState({}, document.title);
    }
  }, []);

  const handleSend = useCallback(
    (
      content: string,
      testType: TestType,
      mode: GenerateMode,
      attachments: { name: string; size: string }[],
      scenarioType: string
    ) => {
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const userMsg: GeneratorMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        testType,
        mode,
        attachments: attachments.length > 0 ? attachments : undefined,
        timestamp,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsGenerating(true);
      setShowTestCases(mode === "scenario-testcase");
      setViewMode("scenario");
      setIsRestoredFromSave(false);

      const generationTimer = setTimeout(() => {
        const sourceScenarios = testType === "api" ? mockApiScenarios : mockGeneratedScenarios;
        const allGenerated = sourceScenarios.map((sc) => ({
          ...sc,
          id: `${sc.id}-${Date.now()}`,
          type: testType,
          steps: testType === "api" || mode === "scenario-only" ? [] : sc.steps,
          apiSteps: testType === "api" && mode !== "scenario-only" ? sc.apiSteps : [],
        }));

        const generated =
          scenarioType === "all"
            ? allGenerated
            : allGenerated.filter((sc) => sc.category === CATEGORY_MAP[scenarioType]);

        const assistantMsg: GeneratorMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `Generated ${generated.length} scenarios${
            mode === "scenario-testcase"
              ? ` with ${generated.reduce((s, sc) => s + sc.steps.length + sc.apiSteps.length, 0)} test cases`
              : ""
          }.`,
          scenarios: generated,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setScenarios(generated);
        setIsGenerating(false);
        setActiveTestType(testType);
        setSourceStory(content);
      }, 1800);

      // Return cleanup (used if component unmounts mid-generation)
      return () => clearTimeout(generationTimer);
    },
    []
  );

  const handleGenerateTC = useCallback((selectedIds: string[]) => {
    setScenarios((prev) =>
      prev.map((sc) => {
        if (!selectedIds.includes(sc.id)) return sc;
        if (sc.steps.length > 0 || sc.apiSteps.length > 0) return sc;

        if (sc.type === "api") {
          return {
            ...sc,
            apiSteps: [
              {
                id: `${sc.id}-a1`,
                url: "https://api.spantest.io",
                endpoint: "/v1/resource",
                method: "POST" as const,
                authentication: "Bearer <token>",
                header: "Content-Type: application/json; Authorization: Bearer eyJhbGciOi...",
                params: "—",
                payload: '{ "key": "value" }',
                outputStatusCode: "200",
                expectedResponse: '{ "status": "success", "data": {...} }',
              },
            ],
          };
        }

        return {
          ...sc,
          steps: [
            { id: `${sc.id}-s1`, precondition: "Application is accessible", step: "Navigate to the relevant page", testData: "URL: /target-page", expectedResult: "Page loads successfully" },
            { id: `${sc.id}-s2`, precondition: "Page is loaded", step: "Perform the primary action", testData: "Valid input data", expectedResult: "Action completes without errors" },
            { id: `${sc.id}-s3`, precondition: "Action is completed", step: "Verify the expected outcome", testData: "—", expectedResult: "Correct result is displayed" },
          ],
        };
      })
    );
    setShowTestCases(true);
    message.success(`Generated test cases for ${selectedIds.length} scenario(s)`);
  }, [message]);

  const handleSave = useCallback((selectedIds: string[], asScript?: boolean) => {
    setShouldResetAfterSave(false);
    setSavingIds(selectedIds);
    setSavingAsScript(!!asScript);
    setSaveModalOpen(true);
  }, []);

  const handleSaveAndContinue = useCallback((selectedIds: string[], asScript?: boolean) => {
    setShouldResetAfterSave(true);
    setSavingIds(selectedIds);
    setSavingAsScript(!!asScript);
    setSaveModalOpen(true);
  }, []);

  const handleSaveToFolder = useCallback(
    (folderId: string, linkedStoryId?: string) => {
      if (!projectId) return;
      const scenariosToSave = scenarios.filter((s) => savingIds.includes(s.id));

      if (savingAsScript) {
        const firstSc = scenariosToSave[0];
        const scriptName =
          scenariosToSave.length === 1
            ? firstSc.title
            : `Combined Script — ${scenariosToSave.length} test cases`;
        const repoItem: RepoItem = {
          id: `ri-${Date.now()}-script`,
          name: scriptName,
          type: "script",
          testType: firstSc.type,
          priority: firstSc.priority,
          category: firstSc.category,
          folderId,
          savedAt: new Date().toISOString().slice(0, 10),
          savedBy: currentUser.name,
          stepsCount: scenariosToSave.reduce(
            (sum, sc) => sum + (sc.type === "api" ? sc.apiSteps.length : sc.steps.length),
            0
          ),
          scenario: firstSc,
          scriptFramework: "python",
          sourceStory,
          linkedStoryId,
          chatMessages: messages,
        };
        dispatch(addItem({ projectId, item: repoItem }));
        message.success(`Saved script (${scenariosToSave.length} test cases) to repository`);
      } else {
        scenariosToSave.forEach((sc) => {
          const hasSteps = sc.type === "api" ? sc.apiSteps.length > 0 : sc.steps.length > 0;
          const repoItem: RepoItem = {
            id: `ri-${Date.now()}-${sc.id}`,
            name: sc.title,
            type: hasSteps ? "testcase" : "scenario",
            testType: sc.type,
            priority: sc.priority,
            category: sc.category,
            folderId,
            savedAt: new Date().toISOString().slice(0, 10),
            savedBy: currentUser.name,
            stepsCount: sc.type === "api" ? sc.apiSteps.length : sc.steps.length,
            scenario: sc,
            sourceStory,
            linkedStoryId,
            chatMessages: messages,
          };
          dispatch(addItem({ projectId, item: repoItem }));
        });
        message.success(`Saved ${savingIds.length} scenario(s) to repository`);
      }

      setSavingIds([]);
      setSavingAsScript(false);

      if (shouldResetAfterSave) {
        // Reset generator so user can start a new story
        setScenarios([]);
        setViewMode("scenario");
        setShowTestCases(false);
        setActiveTestType(null);
        setSourceStory("");
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-saved-${Date.now()}`,
            role: "assistant" as const,
            content: "Saved to repository. Write your next user story to continue.",
            timestamp: now,
            savedToRepo: true,
            scenarios: scenariosToSave,
          },
        ]);
      }
    },
    [savingIds, savingAsScript, scenarios, message, dispatch, projectId, sourceStory, shouldResetAfterSave]
  );

  const handleCreateRepoFolder = useCallback(
    (parentId: string | null, name: string) => {
      if (!projectId) return;
      const newFolder: RepoFolder = {
        id: `rf-${Date.now()}`,
        name,
        parentId,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      dispatch(addFolder({ projectId, folder: newFolder }));
    },
    [dispatch, projectId]
  );

  const handleBackToScenarios = useCallback(() => setViewMode("scenario"), []);
  const handleViewModeChange = useCallback(
    (mode: "scenario" | "testcase") => setViewMode(mode),
    []
  );

  const handleRestoreScenarios = useCallback((restored: Scenario[], fromSave?: boolean) => {
    const hasSteps = restored.some((s) => s.steps.length > 0 || s.apiSteps.length > 0);
    setScenarios(restored);
    setViewMode(hasSteps ? "testcase" : "scenario");
    setShowTestCases(hasSteps);
    setActiveTestType(restored[0]?.type ?? null);
    setIsRestoredFromSave(!!fromSave);
  }, []);

  const handleDiscard = useCallback((selectedIds: string[]) => {
    setScenarios((prev) => {
      const remaining = prev.filter((s) => !selectedIds.includes(s.id));
      if (remaining.length === 0) {
        setMessages([]);
        setActiveTestType(null);
      }
      return remaining;
    });
    message.info(`Discarded ${selectedIds.length} scenario(s)`);
  }, [message]);

  const handleAddScenario = useCallback((scenario: Scenario) => {
    setScenarios((prev) => [...prev, scenario]);
    setIsRestoredFromSave(false);
    message.success("Custom scenario added successfully");
  }, [message]);

  const handleUpdateScenario = useCallback((updated: Scenario) => {
    setScenarios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setIsRestoredFromSave(false);
    message.success("Scenario updated successfully");
  }, [message]);

  return (
    <div className="generator flex h-full flex-1 min-h-0">
      <div className="generator__chat-panel w-[380px] shrink-0 border-r border-[#f3f0fb] bg-white flex flex-col">
        <GeneratorChat
          messages={messages}
          onSend={handleSend}
          isGenerating={isGenerating}
          viewMode={viewMode}
          onBackToScenarios={handleBackToScenarios}
          onRestoreScenarios={handleRestoreScenarios}
          stories={jiraStories}
          onStorySelect={setSelectedStoryId}
        />
      </div>
      <div className="generator__results-panel flex-1 min-w-0 bg-[#faf9ff]">
        <ScenarioTable
          scenarios={scenarios}
          showTestCases={showTestCases}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onGenerateTC={handleGenerateTC}
          onSave={handleSave}
          onSaveAndContinue={handleSaveAndContinue}
          isSaveDisabled={isRestoredFromSave}
          onDiscard={handleDiscard}
          activeTestType={activeTestType}
          onAddScenario={handleAddScenario}
          onUpdateScenario={handleUpdateScenario}
          initialScriptView={initialScriptView}
          onScriptViewConsumed={() => setInitialScriptView(null)}
        />
      </div>

      <SaveToRepoModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        folders={repoFolders}
        onSave={handleSaveToFolder}
        onCreateFolder={handleCreateRepoFolder}
        savingCount={savingIds.length}
        jiraStories={jiraStories}
        jiraEpics={jiraEpics}
        preselectedStoryId={selectedStoryId}
      />
    </div>
  );
}
