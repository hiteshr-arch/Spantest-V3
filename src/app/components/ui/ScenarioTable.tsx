import React, { useState, useEffect } from "react";
import { Tag, Empty, Tooltip, Checkbox, App, Input, Select, Popconfirm } from "antd";
import {
  RightOutlined, DownOutlined, BulbOutlined, ExperimentOutlined,
  SaveOutlined, DeleteOutlined, ExportOutlined, PlusOutlined,
  CheckOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { Scenario, TestStep, ApiTestStep, TestType } from "../../lib/mock-data";

/* ─── priority / category color maps ─────────────────────────────────── */

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  High: { bg: "#fff1f0", text: "#cf1322", border: "#ffa39e" },
  Medium: { bg: "#fff7e6", text: "#d46b08", border: "#ffd591" },
  Low: { bg: "#f6ffed", text: "#389e0d", border: "#b7eb8f" },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Positive: { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  Negative: { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
  "Edge Case": { bg: "#fefce8", text: "#a16207", border: "#fde047" },
};

/* ─── view mode type ─────────────────────────────────────────────────── */

type ViewMode = "scenario" | "testcase";

/* ─── props ──────────────────────────────────────────────────────────── */

interface ScenarioTableProps {
  scenarios: Scenario[];
  showTestCases: boolean;
  /** Controlled from Generator.tsx so GeneratorChat can also drive navigation */
  viewMode: "scenario" | "testcase";
  onViewModeChange: (mode: "scenario" | "testcase") => void;
  onGenerateTC: (selectedIds: string[]) => void;
  onSave: (selectedIds: string[], asScript?: boolean) => void;
  isSaveDisabled?: boolean;
  onDiscard: (selectedIds: string[]) => void;
  activeTestType: TestType | null;
  onAddScenario: (scenario: Scenario) => void;
  onUpdateScenario: (updated: Scenario) => void;
  /** Kept for API compatibility — script view removed from scope */
  initialScriptView?: { scenarios: Scenario[]; framework?: string } | null;
  onScriptViewConsumed?: () => void;
}

/* ─── inline edit form ───────────────────────────────────────────────── */

function EditScenarioForm({
  scenario,
  onSave,
  onCancel,
  hideStepEdit,
}: {
  scenario: Scenario;
  onSave: (updated: Scenario) => void;
  onCancel: () => void;
  hideStepEdit?: boolean;
}) {
  const [title, setTitle] = useState(scenario.title);
  const [priority, setPriority] = useState(scenario.priority);
  const [category, setCategory] = useState(scenario.category);
  const [steps, setSteps] = useState<TestStep[]>([...scenario.steps]);
  const [apiSteps, setApiSteps] = useState<ApiTestStep[]>([...scenario.apiSteps]);
  const isApi = scenario.type === "api";

  const handleSaveChanges = () => {
    onSave({
      ...scenario,
      title,
      priority,
      category,
      steps: isApi ? [] : steps,
      apiSteps: isApi ? apiSteps : [],
    });
  };

  const addStep = () => {
    if (isApi) {
      setApiSteps((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          url: "",
          endpoint: "",
          method: "GET",
          authentication: "",
          header: "",
          params: "",
          payload: "",
          outputStatusCode: "",
          expectedResponse: "",
        },
      ]);
    } else {
      setSteps((prev) => [
        ...prev,
        { id: `st-${Date.now()}`, precondition: "", step: "", testData: "", expectedResult: "" },
      ]);
    }
  };

  const removeStep = (idx: number) => {
    if (isApi) setApiSteps((prev) => prev.filter((_, i) => i !== idx));
    else setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: string, value: string) => {
    if (isApi) {
      setApiSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
    } else {
      setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
    }
  };

  return (
    <div className="scenario-edit border border-[#e2dff0] rounded-lg bg-white p-4">
      {/* title & meta row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <label className="!text-[#8b87a0] text-[10px] mb-1 block" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", height: 34 }}
          />
        </div>
        <div className="w-[100px]">
          <label className="!text-[#8b87a0] text-[10px] mb-1 block" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            Priority
          </label>
          <Select
            value={priority}
            onChange={(v) => setPriority(v as Scenario["priority"])}
            className="w-full"
            style={{ height: 34 }}
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ]}
          />
        </div>
        <div className="w-[110px]">
          <label className="!text-[#8b87a0] text-[10px] mb-1 block" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            Category
          </label>
          <Select
            value={category}
            onChange={(v) => setCategory(v as Scenario["category"])}
            className="w-full"
            style={{ height: 34 }}
            options={[
              { label: "Positive", value: "Positive" },
              { label: "Negative", value: "Negative" },
              { label: "Edge Case", value: "Edge Case" },
            ]}
          />
        </div>
      </div>

      {/* steps */}
      {!isApi && steps.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="!text-[#8b87a0] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              Test Steps
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-start gap-2 p-2 rounded bg-[#faf9ff] border border-[#f3f0fb]">
                <span className="!text-[#b0adbe] text-[10px] mt-1 w-[18px] shrink-0 text-center">{i + 1}</span>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <Input placeholder="Precondition" value={s.precondition} onChange={(e) => updateStep(i, "precondition", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Step" value={s.step} onChange={(e) => updateStep(i, "step", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Test Data" value={s.testData} onChange={(e) => updateStep(i, "testData", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Expected Result" value={s.expectedResult} onChange={(e) => updateStep(i, "expectedResult", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                </div>
                {!hideStepEdit && (
                  <button
                    onClick={() => removeStep(i)}
                    className="flex items-center justify-center w-[22px] h-[22px] mt-[2px] rounded bg-transparent border-0 !text-[#b0adbe] hover:!text-[#d4183d] cursor-pointer text-[12px]"
                  >
                    <MinusCircleOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API steps */}
      {isApi && apiSteps.length > 0 && (
        <div className="mb-3 overflow-x-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="!text-[#8b87a0] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              API Test Steps
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {apiSteps.map((s, i) => (
              <div key={s.id} className="flex items-start gap-2 p-2 rounded bg-[#faf9ff] border border-[#f3f0fb]">
                <span className="!text-[#b0adbe] text-[10px] mt-1 w-[18px] shrink-0 text-center">{i + 1}</span>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input placeholder="URL" value={s.url} onChange={(e) => updateStep(i, "url", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Endpoint" value={s.endpoint} onChange={(e) => updateStep(i, "endpoint", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Select value={s.method} onChange={(v) => updateStep(i, "method", v)} options={["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => ({ label: m, value: m }))} className="w-full" style={{ height: 30 }} />
                  <Input placeholder="Authentication" value={s.authentication} onChange={(e) => updateStep(i, "authentication", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Header" value={s.header} onChange={(e) => updateStep(i, "header", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Params" value={s.params} onChange={(e) => updateStep(i, "params", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Payload" value={s.payload} onChange={(e) => updateStep(i, "payload", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Status Code" value={s.outputStatusCode} onChange={(e) => updateStep(i, "outputStatusCode", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                  <Input placeholder="Expected Response" value={s.expectedResponse} onChange={(e) => updateStep(i, "expectedResponse", e.target.value)} style={{ fontSize: 11, height: 30 }} />
                </div>
                {!hideStepEdit && (
                  <button
                    onClick={() => removeStep(i)}
                    className="flex items-center justify-center w-[22px] h-[22px] mt-[2px] rounded bg-transparent border-0 !text-[#b0adbe] hover:!text-[#d4183d] cursor-pointer text-[12px]"
                  >
                    <MinusCircleOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* add step + actions */}
      <div className="flex items-center justify-between">
        {!hideStepEdit ? (
          <button
            onClick={addStep}
            className="flex items-center gap-1 px-2 py-[4px] rounded bg-transparent border border-dashed border-[#d9d5e8] !text-[#7c3aed] text-[11px] cursor-pointer hover:border-[#7c3aed] hover:bg-[#f3eaff] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            <PlusOutlined className="text-[10px]" />
            Add Step
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:bg-[#faf9ff] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            <CloseOutlined className="mr-1 text-[9px]" />
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-3 py-[5px] rounded-md border-0 bg-[#7c3aed] text-white text-[11px] cursor-pointer hover:bg-[#6d28d9] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            <CheckOutlined className="mr-1 text-[9px]" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── scenario card ──────────────────────────────────────────────────── */

function ScenarioCard({
  scenario,
  index,
  isSelected,
  onToggleSelect,
  showSteps,
  hideStepEdit,
  onUpdate,
}: {
  scenario: Scenario;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  showSteps: boolean;
  hideStepEdit?: boolean;
  onUpdate: (updated: Scenario) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isApi = scenario.type === "api";
  const hasSteps = isApi ? scenario.apiSteps.length > 0 : scenario.steps.length > 0;
  const stepsCount = isApi ? scenario.apiSteps.length : scenario.steps.length;
  const pColor = PRIORITY_COLORS[scenario.priority];
  const cColor = CATEGORY_COLORS[scenario.category];

  if (editing) {
    return (
      <EditScenarioForm
        scenario={scenario}
        hideStepEdit={hideStepEdit}
        onSave={(updated) => {
          onUpdate(updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      className={`scenario-card border rounded-lg transition-colors ${
        isSelected ? "border-[#7c3aed]/30 bg-[#faf5ff]" : "border-[#f3f0fb] bg-white"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* card header */}
      <div className="flex items-center gap-2 px-3 py-[10px]">
        <Checkbox checked={isSelected} onChange={onToggleSelect} />

        {hasSteps && showSteps && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-[18px] h-[18px] rounded bg-transparent border-0 !text-[#b0adbe] hover:!text-[#7c3aed] cursor-pointer text-[10px]"
          >
            {expanded ? <DownOutlined /> : <RightOutlined />}
          </button>
        )}

        <span className="!text-[#b0adbe] text-[11px] w-[20px] shrink-0" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          {index + 1}.
        </span>

        {/* Scenario ID — raised to 12px */}
        <span
          className="!text-[#7c3aed] text-[12px] shrink-0 bg-[#f3eaff] rounded px-[5px] py-[1px]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          {scenario.scenarioId}
        </span>

        {/* Type tag — raised to 11.5px */}
        <Tag
          className="!text-[11.5px] !px-[5px] !py-0 !m-0 !leading-[20px] !uppercase"
          color={isApi ? "geekblue" : "cyan"}
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          {isApi ? "API" : "UI"}
        </Tag>

        <span
          className="flex-1 !text-[#0f0a1e] text-[12.5px] truncate"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        >
          {scenario.title}
        </span>

        {/* Priority tag — raised to 11.5px */}
        <Tag
          className="!text-[11.5px] !px-[6px] !py-0 !m-0 !leading-[20px]"
          style={{ background: pColor.bg, color: pColor.text, borderColor: pColor.border, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          {scenario.priority}
        </Tag>

        {/* Category tag — raised to 11.5px */}
        <Tag
          className="!text-[11.5px] !px-[6px] !py-0 !m-0 !leading-[20px]"
          style={{ background: cColor.bg, color: cColor.text, borderColor: cColor.border, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          {scenario.category}
        </Tag>

        {/* Steps count — raised to 12px */}
        {hasSteps && (
          <span className="!text-[#8b87a0] text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {stepsCount} step{stepsCount !== 1 ? "s" : ""}
          </span>
        )}

        {hovered && (
          <Tooltip title="Edit">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center w-[24px] h-[24px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer text-[12px] transition-colors"
            >
              <EditOutlined />
            </button>
          </Tooltip>
        )}
      </div>

      {/* expanded steps — UI */}
      {expanded && showSteps && !isApi && scenario.steps.length > 0 && (
        <div className="px-3 pb-3">
          <table className="w-full text-[11px] border-collapse" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr>
                {["#", "Precondition", "Step", "Test Data", "Expected Result"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-2 py-[5px] !text-[#8b87a0] bg-[#faf9ff] border-b border-[#f3f0fb] whitespace-nowrap"
                    style={{ fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenario.steps.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#faf5ff]">
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#b0adbe]">{i + 1}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.precondition}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.step}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.testData}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.expectedResult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* expanded steps — API */}
      {expanded && showSteps && isApi && scenario.apiSteps.length > 0 && (
        <div className="px-3 pb-3 overflow-x-auto">
          <table className="w-full text-[11px] border-collapse" style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 900 }}>
            <thead>
              <tr>
                {["#", "URL", "Endpoint", "Method", "Auth", "Header", "Params", "Payload", "Status", "Expected Response"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-2 py-[5px] !text-[#8b87a0] bg-[#faf9ff] border-b border-[#f3f0fb] whitespace-nowrap"
                    style={{ fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenario.apiSteps.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#faf5ff]">
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#b0adbe]">{i + 1}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] font-mono text-[10px]">{s.url}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] font-mono text-[10px]">{s.endpoint}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb]">
                    <Tag
                      className="!text-[9px] !px-[5px] !py-0 !m-0 !leading-[16px]"
                      color={s.method === "GET" ? "blue" : s.method === "POST" ? "green" : s.method === "DELETE" ? "red" : "orange"}
                    >
                      {s.method}
                    </Tag>
                  </td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] text-[10px]">{s.authentication}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] text-[10px] max-w-[120px] truncate">{s.header}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] text-[10px]">{s.params}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] font-mono text-[10px] max-w-[140px] truncate">{s.payload}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.outputStatusCode}</td>
                  <td className="px-2 py-[4px] border-b border-[#f3f0fb] !text-[#4c4568] font-mono text-[10px] max-w-[140px] truncate">{s.expectedResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────── */

export function ScenarioTable({
  scenarios,
  showTestCases,
  viewMode,
  onViewModeChange,
  onGenerateTC,
  onSave,
  isSaveDisabled,
  onDiscard,
  activeTestType,
  onAddScenario,
  onUpdateScenario,
}: ScenarioTableProps) {
  const { message } = App.useApp();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draftScenario, setDraftScenario] = useState<Scenario | null>(null);

  /* ── internal TC tracking (viewMode itself lives in Generator.tsx) ─── */
  const [tcGenerated, setTcGenerated] = useState(false);
  const [editedSinceTc, setEditedSinceTc] = useState(false);
  const [tcGeneratedIds, setTcGeneratedIds] = useState<string[]>([]);

  // When parent signals TC generation complete, switch to TC view
  useEffect(() => {
    if (showTestCases && scenarios.length > 0) {
      onViewModeChange("testcase");
      setTcGenerated(true);
      setEditedSinceTc(false);
    }
  }, [showTestCases, scenarios]);

  // When all scenarios are discarded, reset state
  useEffect(() => {
    if (scenarios.length === 0) {
      onViewModeChange("scenario");
      setTcGenerated(false);
      setEditedSinceTc(false);
      setTcGeneratedIds([]);
    }
  }, [scenarios]);

  // Keep selection in sync with available scenarios
  useEffect(() => {
    setSelectedIds((prev) => {
      const validIds = new Set(scenarios.map((s) => s.id));
      const next = new Set<string>();
      prev.forEach((id) => { if (validIds.has(id)) next.add(id); });
      return next;
    });
  }, [scenarios]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = () => {
    const selected = scenarios.filter((s) => selectedIds.has(s.id));
    if (selected.length === 0) return;

    const isTc = viewMode === "testcase";
    let csvContent = "";

    if (isTc) {
      csvContent = "Scenario ID,Title,Type,Priority,Category,Step #,Precondition,Step,Test Data,Expected Result\n";
      selected.forEach((sc) => {
        const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
        if (sc.type === "api" && sc.apiSteps.length > 0) {
          csvContent = "Scenario ID,Title,Type,Priority,Category,Step #,URL,Endpoint,Method,Authentication,Header,Params,Payload,Status Code,Expected Response\n";
          sc.apiSteps.forEach((s, i) => {
            csvContent += [esc(sc.scenarioId), esc(sc.title), "API", sc.priority, sc.category, i + 1, esc(s.url), esc(s.endpoint), s.method, esc(s.authentication), esc(s.header), esc(s.params), esc(s.payload), s.outputStatusCode, esc(s.expectedResponse)].join(",") + "\n";
          });
        } else {
          sc.steps.forEach((s, i) => {
            csvContent += [esc(sc.scenarioId), esc(sc.title), "UI", sc.priority, sc.category, i + 1, esc(s.precondition), esc(s.step), esc(s.testData), esc(s.expectedResult)].join(",") + "\n";
          });
        }
      });
    } else {
      csvContent = "Scenario ID,Title,Type,Priority,Category\n";
      selected.forEach((sc) => {
        const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
        csvContent += [esc(sc.scenarioId), esc(sc.title), sc.type === "api" ? "API" : "UI", sc.priority, sc.category].join(",") + "\n";
      });
    }

    const fileName = isTc ? "test-cases.csv" : "scenarios.csv";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`Downloaded ${fileName} (${selected.length} item${selected.length !== 1 ? "s" : ""})`);
  };

  const handleUpdateScenario = (updated: Scenario) => {
    onUpdateScenario(updated);
    setEditedSinceTc(true);
  };

  const handleAdd = () => {
    const type = activeTestType || "ui";
    const draft: Scenario = {
      id: `draft-${Date.now()}`,
      scenarioId: `s${Date.now()}`,
      title: "",
      type,
      priority: "Medium",
      category: "Positive",
      steps: type === "ui" ? [{ id: `st-${Date.now()}`, precondition: "", step: "", testData: "", expectedResult: "" }] : [],
      apiSteps: type === "api"
        ? [{ id: `ast-${Date.now()}`, url: "", endpoint: "", method: "GET", authentication: "", header: "", params: "", payload: "", outputStatusCode: "", expectedResponse: "" }]
        : [],
    };
    setDraftScenario(draft);
  };

  /* ── derived state ─────────────────────────────────────────────────── */
  const hasScenarios = scenarios.length > 0;
  const selectedCount = selectedIds.size;
  const isScenarioView = viewMode === "scenario";
  const isTcView = viewMode === "testcase";
  // In TC view show only the scenarios that were selected for generation
  const displayScenarios =
    isTcView && tcGeneratedIds.length > 0
      ? scenarios.filter((s) => tcGeneratedIds.includes(s.id))
      : scenarios;
  // TC already generated with no edits — can navigate forward without re-generating
  const canViewTc = tcGenerated && !editedSinceTc;

  const toggleSelectAll = () => {
    if (selectedIds.size === displayScenarios.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayScenarios.map((s) => s.id)));
    }
  };

  /* ── navigation handlers ───────────────────────────────────────────── */

  const handleGoToTcView = () => {
    if (canViewTc) {
      // Already generated, no edits — just navigate
      onViewModeChange("testcase");
      setSelectedIds(new Set());
    } else if (selectedCount > 0) {
      // Trigger generation for selected scenarios only
      const ids = [...selectedIds];
      setTcGeneratedIds(ids);
      onGenerateTC(ids);
      setTcGenerated(true);
      setEditedSinceTc(false);
      onViewModeChange("testcase");
      setSelectedIds(new Set());
    }
  };

  /* ── bottom bar CTA label ──────────────────────────────────────────── */
  const tcCtaLabel = editedSinceTc && tcGenerated ? "Regenerate Test Cases" : "Generate Test Cases";

  return (
    <div className="scenario-table flex flex-col h-full">

      {/* ── toolbar ──────────────────────────────────────────────────── */}
      {/*
        pl-7 (28px) aligns the select-all checkbox with the per-row checkboxes,
        which sit at list px-4 (16px) + card px-3 (12px) = 28px from the left edge.
      */}
      <div className="scenario-table__toolbar flex items-center gap-2 pl-7 pr-4 py-[10px] border-b border-[#f3f0fb] bg-white">

        {hasScenarios && (
          <>
            <Checkbox
              checked={selectedIds.size === displayScenarios.length && displayScenarios.length > 0}
              indeterminate={selectedIds.size > 0 && selectedIds.size < displayScenarios.length}
              onChange={toggleSelectAll}
            />

            {/* Count label or selected badge */}
            {selectedCount > 0 ? (
              <span
                className="!text-[#7c3aed] text-[11px] bg-[#f3eaff] rounded-full px-2 py-[2px]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
              >
                {selectedCount} selected
              </span>
            ) : (
              <span
                className="!text-[#8b87a0] text-[11px]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                {displayScenarios.length} {isScenarioView ? "scenario" : "test case"}{displayScenarios.length !== 1 ? "s" : ""}
              </span>
            )}

            <div className="flex-1" />

            {/* View Test Cases — navigation shortcut when TC already exists and nothing is selected */}
            {isScenarioView && canViewTc && selectedCount === 0 && (
              <Tooltip title="Navigate to generated test cases">
                <button
                  onClick={() => { onViewModeChange("testcase"); setSelectedIds(new Set()); }}
                  className="flex items-center gap-[5px] px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:border-[#7c3aed] hover:!text-[#7c3aed] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                >
                  View Test Cases
                  <ArrowRightOutlined className="text-[10px]" />
                </button>
              </Tooltip>
            )}

            {/* Selection-triggered actions */}
            {selectedCount > 0 && (
              <>
                {/* Save — visible in scenario view only; TC view uses the bottom bar */}
                {isScenarioView && (
                  <Tooltip title="Save to Repository">
                    <button
                      onClick={() => onSave([...selectedIds])}
                      disabled={isSaveDisabled}
                      className={`scenario-table__action-btn flex items-center gap-[5px] px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] transition-colors ${isSaveDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#faf5ff] hover:border-[#7c3aed]"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                    >
                      <SaveOutlined className="text-[12px]" />
                      Save
                    </button>
                  </Tooltip>
                )}

                <Tooltip title="Export CSV">
                  <button
                    onClick={handleExport}
                    className="scenario-table__action-btn flex items-center justify-center w-[30px] h-[30px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[12px] cursor-pointer hover:bg-[#faf5ff] transition-colors"
                  >
                    <ExportOutlined />
                  </button>
                </Tooltip>

                <Popconfirm
                  title={`Remove ${selectedCount} item${selectedCount !== 1 ? "s" : ""}?`}
                  description="This cannot be undone."
                  onConfirm={() => onDiscard([...selectedIds])}
                  okText="Remove"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Discard selected">
                    <button
                      className="scenario-table__action-btn flex items-center justify-center w-[30px] h-[30px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[12px] cursor-pointer hover:border-[#ffa39e] hover:!text-[#cf1322] hover:bg-[#fff1f0] transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </Popconfirm>
              </>
            )}

            {/* Add — hidden when rows are selected */}
            {selectedCount === 0 && (
              <Tooltip title="Add scenario">
                <button
                  onClick={handleAdd}
                  className="scenario-table__action-btn flex items-center gap-[5px] px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:bg-[#faf9ff] hover:border-[#b0adbe] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                >
                  <PlusOutlined className="text-[10px]" />
                  Add
                </button>
              </Tooltip>
            )}
          </>
        )}

        {!hasScenarios && (
          <div className="flex items-center gap-2">
            <BulbOutlined className="!text-[#b0adbe] text-[13px]" />
            <span className="!text-[#8b87a0] text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Generated scenarios will appear here
            </span>
          </div>
        )}
      </div>

      {/* ── scenario / test-case list ─────────────────────────────────── */}
      <div className="scenario-table__list flex-1 overflow-y-auto px-4 py-3">
        {!hasScenarios && !draftScenario ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Empty
              description={
                <span className="!text-[#8b87a0] text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Enter a user story in the chat to generate scenarios
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayScenarios.map((sc, i) => (
              <ScenarioCard
                key={sc.id}
                scenario={sc}
                index={i}
                isSelected={selectedIds.has(sc.id)}
                onToggleSelect={() => toggleSelect(sc.id)}
                showSteps={isTcView}
                hideStepEdit={isScenarioView}
                onUpdate={handleUpdateScenario}
              />
            ))}

            {/* draft card */}
            {draftScenario && (
              <EditScenarioForm
                scenario={draftScenario}
                onSave={(saved) => {
                  if (saved.title.trim()) {
                    onAddScenario(saved);
                    if (isTcView) setTcGeneratedIds((prev) => [...prev, saved.id]);
                  }
                  setDraftScenario(null);
                }}
                onCancel={() => setDraftScenario(null)}
              />
            )}
          </div>
        )}
      </div>

      {/* ── floating bottom bar ────────────────────────────────────────── */}
      {hasScenarios && ((isScenarioView && selectedCount > 0) || isTcView) && (
        <div
          className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#f3f0fb]"
          style={{ boxShadow: "0 -2px 10px 0 rgba(124, 58, 237, 0.05)" }}
        >
          <span
            className="!text-[#8b87a0] text-[12px]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            {isTcView
              ? `${displayScenarios.length} test case${displayScenarios.length !== 1 ? "s" : ""} ready`
              : `${selectedCount} scenario${selectedCount !== 1 ? "s" : ""} selected`}
          </span>

          {isScenarioView ? (
            /* Scenario view: primary CTA → generate / view test cases */
            <button
              onClick={handleGoToTcView}
              className="flex items-center gap-[6px] px-4 py-[7px] rounded-lg border-0 bg-[#7c3aed] text-white text-[12px] cursor-pointer hover:bg-[#6d28d9] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
            >
              <ExperimentOutlined className="text-[12px]" />
              {tcCtaLabel}
              <ArrowRightOutlined className="text-[11px]" />
            </button>
          ) : (
            /* Test cases view: primary CTA → save all to repository */
            <button
              onClick={() => onSave(displayScenarios.map((s) => s.id))}
              disabled={isSaveDisabled}
              className={`flex items-center gap-[6px] px-4 py-[7px] rounded-lg border-0 bg-[#7c3aed] text-white text-[12px] transition-colors ${isSaveDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#6d28d9]"}`}
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
            >
              <SaveOutlined className="text-[12px]" />
              Save &amp; Continue
              <ArrowRightOutlined className="text-[11px]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
