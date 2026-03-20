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
  viewMode: "scenario" | "testcase";
  onViewModeChange: (mode: "scenario" | "testcase") => void;
  onGenerateTC: (selectedIds: string[]) => void;
  onSave: (selectedIds: string[], asScript?: boolean) => void;
  isSaveDisabled?: boolean;
  onDiscard: (selectedIds: string[]) => void;
  activeTestType: TestType | null;
  onAddScenario: (scenario: Scenario) => void;
  onUpdateScenario: (updated: Scenario) => void;
  onSaveAndContinue: (selectedIds: string[]) => void;
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
    <div className="scenario-edit border border-[#e2dff0] rounded-xl bg-white p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <label className="!text-[#8b87a0] text-[12px] mb-1 block font-semibold">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: 14, height: 38 }}
          />
        </div>
        <div className="w-[120px]">
          <label className="!text-[#8b87a0] text-[12px] mb-1 block font-semibold">
            Priority
          </label>
          <Select
            value={priority}
            onChange={(v) => setPriority(v as Scenario["priority"])}
            className="w-full"
            style={{ height: 38 }}
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ]}
          />
        </div>
        <div className="w-[130px]">
          <label className="!text-[#8b87a0] text-[12px] mb-1 block font-semibold">
            Category
          </label>
          <Select
            value={category}
            onChange={(v) => setCategory(v as Scenario["category"])}
            className="w-full"
            style={{ height: 38 }}
            options={[
              { label: "Positive", value: "Positive" },
              { label: "Negative", value: "Negative" },
              { label: "Edge Case", value: "Edge Case" },
            ]}
          />
        </div>
      </div>

      {!isApi && steps.length > 0 && (
        <div className="mb-4">
          <span className="!text-[#8b87a0] text-[12px] mb-2 block font-semibold">
            Test Steps
          </span>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-start gap-2 p-3 rounded-lg bg-[#faf9ff] border border-[#f3f0fb]">
                <span className="!text-[#b0adbe] text-[12px] mt-1 w-[20px] shrink-0 text-center">{i + 1}</span>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <Input placeholder="Precondition" value={s.precondition} onChange={(e) => updateStep(i, "precondition", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Step" value={s.step} onChange={(e) => updateStep(i, "step", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Test Data" value={s.testData} onChange={(e) => updateStep(i, "testData", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Expected Result" value={s.expectedResult} onChange={(e) => updateStep(i, "expectedResult", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                </div>
                {!hideStepEdit && (
                  <button
                    onClick={() => removeStep(i)}
                    className="flex items-center justify-center w-[26px] h-[26px] mt-[2px] rounded bg-transparent border-0 !text-[#b0adbe] hover:!text-[#d4183d] cursor-pointer text-[14px]"
                  >
                    <MinusCircleOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isApi && apiSteps.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <span className="!text-[#8b87a0] text-[12px] mb-2 block font-semibold">
            API Test Steps
          </span>
          <div className="flex flex-col gap-2">
            {apiSteps.map((s, i) => (
              <div key={s.id} className="flex items-start gap-2 p-3 rounded-lg bg-[#faf9ff] border border-[#f3f0fb]">
                <span className="!text-[#b0adbe] text-[12px] mt-1 w-[20px] shrink-0 text-center">{i + 1}</span>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input placeholder="URL" value={s.url} onChange={(e) => updateStep(i, "url", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Endpoint" value={s.endpoint} onChange={(e) => updateStep(i, "endpoint", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Select value={s.method} onChange={(v) => updateStep(i, "method", v)} options={["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => ({ label: m, value: m }))} className="w-full" style={{ height: 34 }} />
                  <Input placeholder="Authentication" value={s.authentication} onChange={(e) => updateStep(i, "authentication", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Header" value={s.header} onChange={(e) => updateStep(i, "header", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Params" value={s.params} onChange={(e) => updateStep(i, "params", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Payload" value={s.payload} onChange={(e) => updateStep(i, "payload", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Status Code" value={s.outputStatusCode} onChange={(e) => updateStep(i, "outputStatusCode", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                  <Input placeholder="Expected Response" value={s.expectedResponse} onChange={(e) => updateStep(i, "expectedResponse", e.target.value)} style={{ fontSize: 13, height: 34 }} />
                </div>
                {!hideStepEdit && (
                  <button
                    onClick={() => removeStep(i)}
                    className="flex items-center justify-center w-[26px] h-[26px] mt-[2px] rounded bg-transparent border-0 !text-[#b0adbe] hover:!text-[#d4183d] cursor-pointer text-[14px]"
                  >
                    <MinusCircleOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {!hideStepEdit ? (
          <button
            onClick={addStep}
            className="flex items-center gap-2 px-3 py-[6px] rounded-lg bg-transparent border border-dashed border-[#d9d5e8] !text-[#7c3aed] text-[13px] cursor-pointer hover:border-[#7c3aed] hover:bg-[#f3eaff] transition-colors font-semibold"
          >
            <PlusOutlined className="text-[12px]" />
            Add Step
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-[7px] rounded-lg border border-[#e2dff0] bg-white !text-[#4c4568] text-[13px] cursor-pointer hover:bg-[#faf9ff] transition-colors font-medium"
          >
            <CloseOutlined className="mr-1 text-[11px]" />
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-[7px] rounded-lg border-0 bg-[#7c3aed] text-white text-[13px] cursor-pointer hover:bg-[#6d28d9] transition-colors font-semibold"
          >
            <CheckOutlined className="mr-1 text-[11px]" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── scenario table row (scenario mode) ────────────────────────────── */

function ScenarioTableRow({
  scenario,
  index,
  isSelected,
  onToggleSelect,
  onUpdate,
}: {
  scenario: Scenario;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: (updated: Scenario) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isApi = scenario.type === "api";
  const stepsCount = isApi ? scenario.apiSteps.length : scenario.steps.length;
  const pColor = PRIORITY_COLORS[scenario.priority];
  const cColor = CATEGORY_COLORS[scenario.category];

  if (editing) {
    return (
      <EditScenarioForm
        scenario={scenario}
        hideStepEdit={true}
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
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-[#f3f0fb] last:border-b-0 ${
        isSelected ? "bg-[#faf5ff]" : "bg-white hover:bg-[#faf9ff]"
      }`}
      style={{ borderLeft: `3px solid ${isSelected ? "#7c3aed" : "#c4b5fd"}` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggleSelect}
    >
      {/* checkbox */}
      <Checkbox
        checked={isSelected}
        onChange={onToggleSelect}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />

      {/* index */}
      <span
        className="shrink-0 w-[28px] text-center !text-[#b0adbe] text-[12px]"
      >
        {index + 1}
      </span>

      {/* scenario ID */}
      <span
        className="shrink-0 !text-[#7c3aed] text-[12px] bg-[#f3eaff] rounded-md px-[8px] py-[2px] font-bold"
      >
        {scenario.scenarioId}
      </span>

      {/* type tag */}
      <Tag
        className="!text-[11px] !px-[7px] !py-0 !m-0 !leading-[20px] !uppercase shrink-0 font-semibold"
        color={isApi ? "geekblue" : "cyan"}
      >
        {isApi ? "API" : "UI"}
      </Tag>

      {/* title */}
      <span
        className="flex-1 min-w-0 truncate !text-[#0f0a1e] text-[13px] font-medium"
      >
        {scenario.title}
      </span>

      {/* priority */}
      <Tag
        className="!text-[11px] !px-[7px] !py-0 !m-0 !leading-[20px] shrink-0 font-semibold"
        style={{ background: pColor.bg, color: pColor.text, borderColor: pColor.border }}
      >
        {scenario.priority}
      </Tag>

      {/* category */}
      <Tag
        className="!text-[11px] !px-[8px] !py-0 !m-0 !leading-[20px] shrink-0 font-semibold"
        style={{ background: cColor.bg, color: cColor.text, borderColor: cColor.border }}
      >
        {scenario.category}
      </Tag>

      {/* steps count */}
      <span
        className="shrink-0 w-[52px] text-right !text-[#b0adbe] text-[12px]"
      >
        {stepsCount > 0 ? `${stepsCount} step${stepsCount !== 1 ? "s" : ""}` : "—"}
      </span>

      {/* edit action */}
      <div className="shrink-0 w-[32px] flex items-center justify-center">
        {hovered && (
          <Tooltip title="Edit">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="flex items-center justify-center w-[28px] h-[28px] rounded-md bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer text-[14px] transition-colors"
            >
              <EditOutlined />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

/* ─── test case list card (testcase mode) ────────────────────────────── */

function TestCaseListCard({
  scenario,
  index,
  isSelected,
  onToggleSelect,
  onUpdate,
}: {
  scenario: Scenario;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: (updated: Scenario) => void;
}) {
  const [expanded, setExpanded] = useState(true);
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
      className={`border rounded-xl transition-colors ${
        isSelected ? "border-[#2563eb]/30 bg-[#eff6ff]" : "border-[#e8f4fd] bg-white"
      }`}
      style={{ borderLeft: `3px solid ${isSelected ? "#2563eb" : "#93c5fd"}` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* card header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Checkbox checked={isSelected} onChange={onToggleSelect} />

        {hasSteps && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-[22px] h-[22px] rounded bg-transparent border-0 !text-[#93c5fd] hover:!text-[#2563eb] cursor-pointer text-[13px]"
          >
            {expanded ? <DownOutlined /> : <RightOutlined />}
          </button>
        )}

        <span className="!text-[#b0adbe] text-[13px] w-[24px] shrink-0 font-semibold">
          {index + 1}.
        </span>

        <span
          className="!text-[#2563eb] text-[13px] shrink-0 bg-[#e8f4fd] rounded-md px-[8px] py-[3px] font-bold"
        >
          {scenario.scenarioId}
        </span>

        <Tag
          className="!text-[12px] !px-[8px] !py-0 !m-0 !leading-[22px] !uppercase font-semibold"
          color={isApi ? "geekblue" : "cyan"}
        >
          {isApi ? "API" : "UI"}
        </Tag>

        <span
          className="flex-1 !text-[#0f0a1e] text-[14px] truncate font-medium"
        >
          {scenario.title}
        </span>

        <Tag
          className="!text-[12px] !px-[8px] !py-0 !m-0 !leading-[22px] font-semibold"
          style={{ background: pColor.bg, color: pColor.text, borderColor: pColor.border }}
        >
          {scenario.priority}
        </Tag>

        <Tag
          className="!text-[12px] !px-[8px] !py-0 !m-0 !leading-[22px] font-semibold"
          style={{ background: cColor.bg, color: cColor.text, borderColor: cColor.border }}
        >
          {scenario.category}
        </Tag>

        {hasSteps && (
          <span className="!text-[#8b87a0] text-[13px]">
            {stepsCount} step{stepsCount !== 1 ? "s" : ""}
          </span>
        )}

        {hovered && (
          <Tooltip title="Edit">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center w-[28px] h-[28px] rounded-md bg-transparent border-0 !text-[#8b87a0] hover:!text-[#2563eb] hover:bg-[#e8f4fd] cursor-pointer text-[14px] transition-colors"
            >
              <EditOutlined />
            </button>
          </Tooltip>
        )}
      </div>

      {/* expanded steps — UI */}
      {expanded && !isApi && scenario.steps.length > 0 && (
        <div className="px-4 pb-4">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["#", "Precondition", "Step", "Test Data", "Expected Result"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-[7px] !text-[#4c7be0] bg-[#f0f7ff] border-b border-[#dbeafe] whitespace-nowrap font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenario.steps.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#eff6ff]">
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#b0adbe]">{i + 1}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568]">{s.precondition}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568]">{s.step}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568]">{s.testData}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568]">{s.expectedResult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* expanded steps — API */}
      {expanded && isApi && scenario.apiSteps.length > 0 && (
        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full text-[13px] border-collapse" style={{ minWidth: 960 }}>
            <thead>
              <tr>
                {["#", "URL", "Endpoint", "Method", "Auth", "Header", "Params", "Payload", "Status", "Expected Response"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-[7px] !text-[#4c7be0] bg-[#f0f7ff] border-b border-[#dbeafe] whitespace-nowrap font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenario.apiSteps.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#eff6ff]">
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#b0adbe]">{i + 1}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] font-mono text-[12px]">{s.url}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] font-mono text-[12px]">{s.endpoint}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe]">
                    <Tag
                      className="!text-[11px] !px-[6px] !py-0 !m-0 !leading-[20px]"
                      color={s.method === "GET" ? "blue" : s.method === "POST" ? "green" : s.method === "DELETE" ? "red" : "orange"}
                    >
                      {s.method}
                    </Tag>
                  </td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] text-[12px]">{s.authentication}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] text-[12px] max-w-[120px] truncate">{s.header}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] text-[12px]">{s.params}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] font-mono text-[12px] max-w-[140px] truncate">{s.payload}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] text-[12px]">{s.outputStatusCode}</td>
                  <td className="px-3 py-[6px] border-b border-[#dbeafe] !text-[#4c4568] font-mono text-[12px] max-w-[140px] truncate">{s.expectedResponse}</td>
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
  onSaveAndContinue,
}: ScenarioTableProps) {
  const { message } = App.useApp();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draftScenario, setDraftScenario] = useState<Scenario | null>(null);

  const [tcGenerated, setTcGenerated] = useState(false);
  const [editedSinceTc, setEditedSinceTc] = useState(false);
  const [tcGeneratedIds, setTcGeneratedIds] = useState<string[]>([]);

  useEffect(() => {
    if (showTestCases && scenarios.length > 0) {
      onViewModeChange("testcase");
      setTcGenerated(true);
      setEditedSinceTc(false);
    }
  }, [showTestCases, scenarios]);

  useEffect(() => {
    if (scenarios.length === 0) {
      onViewModeChange("scenario");
      setTcGenerated(false);
      setEditedSinceTc(false);
      setTcGeneratedIds([]);
    }
  }, [scenarios]);

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

  const hasScenarios = scenarios.length > 0;
  const selectedCount = selectedIds.size;
  const isScenarioView = viewMode === "scenario";
  const isTcView = viewMode === "testcase";
  const displayScenarios =
    isTcView && tcGeneratedIds.length > 0
      ? scenarios.filter((s) => tcGeneratedIds.includes(s.id))
      : scenarios;
  const canViewTc = tcGenerated && !editedSinceTc;

  const toggleSelectAll = () => {
    if (selectedIds.size === displayScenarios.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayScenarios.map((s) => s.id)));
    }
  };

  const handleGoToTcView = () => {
    if (canViewTc) {
      onViewModeChange("testcase");
      setSelectedIds(new Set());
    } else if (selectedCount > 0) {
      const ids = [...selectedIds];
      setTcGeneratedIds(ids);
      onGenerateTC(ids);
      setTcGenerated(true);
      setEditedSinceTc(false);
      onViewModeChange("testcase");
      setSelectedIds(new Set());
    }
  };

  const tcCtaLabel = editedSinceTc && tcGenerated ? "Regenerate Test Cases" : "Generate Test Cases";

  return (
    <div className="scenario-table flex flex-col h-full">

      {/* ── toolbar ──────────────────────────────────────────────────── */}
      <div className="scenario-table__toolbar flex items-center gap-3 pl-8 pr-5 py-3 border-b border-[#f3f0fb] bg-white">

        {hasScenarios && (
          <>
            {/* checkbox only needed in TC view; scenario view has it in table header */}
            {isTcView && (
              <Checkbox
                checked={selectedIds.size === displayScenarios.length && displayScenarios.length > 0}
                indeterminate={selectedIds.size > 0 && selectedIds.size < displayScenarios.length}
                onChange={toggleSelectAll}
              />
            )}

            {selectedCount > 0 ? (
              <span
                className={`text-[13px] rounded-full px-3 py-[3px] font-semibold ${isScenarioView ? "!text-[#7c3aed] bg-[#f3eaff]" : "!text-[#2563eb] bg-[#e8f4fd]"}`}
              >
                {selectedCount} selected
              </span>
            ) : (
              <span
                className={`text-[13px] font-medium ${isScenarioView ? "!text-[#7c3aed]" : "!text-[#2563eb]"}`}
              >
                {displayScenarios.length} {isScenarioView ? "scenario" : "test case"}{displayScenarios.length !== 1 ? "s" : ""}
              </span>
            )}

            <div className="flex-1" />

            {isScenarioView && canViewTc && selectedCount === 0 && (
              <Tooltip title="Navigate to generated test cases">
                <button
                  onClick={() => { onViewModeChange("testcase"); setSelectedIds(new Set()); }}
                  className="flex items-center gap-[6px] px-4 py-[6px] rounded-lg border border-[#e2dff0] bg-white !text-[#4c4568] text-[13px] cursor-pointer hover:border-[#7c3aed] hover:!text-[#7c3aed] transition-colors font-medium"
                >
                  View Test Cases
                  <ArrowRightOutlined className="text-[12px]" />
                </button>
              </Tooltip>
            )}

            {selectedCount > 0 && (
              <>
                {isScenarioView && (
                  <Tooltip title="Save to Repository">
                    <button
                      onClick={() => onSave([...selectedIds])}
                      disabled={isSaveDisabled}
                      className={`scenario-table__action-btn flex items-center gap-[6px] px-4 py-[6px] rounded-lg border border-[#e2dff0] bg-white !text-[#4c4568] text-[13px] transition-colors font-medium ${isSaveDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#faf5ff] hover:border-[#7c3aed]"}`}
                    >
                      <SaveOutlined className="text-[14px]" />
                      Save
                    </button>
                  </Tooltip>
                )}

                <Tooltip title="Export CSV">
                  <button
                    onClick={handleExport}
                    className="scenario-table__action-btn flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-[#e2dff0] bg-white !text-[#4c4568] text-[14px] cursor-pointer hover:bg-[#faf5ff] transition-colors"
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
                      className="scenario-table__action-btn flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-[#e2dff0] bg-white !text-[#4c4568] text-[14px] cursor-pointer hover:border-[#ffa39e] hover:!text-[#cf1322] hover:bg-[#fff1f0] transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </Popconfirm>
              </>
            )}

            {selectedCount === 0 && (
              <Tooltip title="Add scenario">
                <button
                  onClick={handleAdd}
                  className="scenario-table__action-btn flex items-center gap-[6px] px-4 py-[6px] rounded-lg border border-[#e2dff0] bg-white !text-[#4c4568] text-[13px] cursor-pointer hover:bg-[#faf9ff] hover:border-[#b0adbe] transition-colors font-medium"
                >
                  <PlusOutlined className="text-[12px]" />
                  Add
                </button>
              </Tooltip>
            )}
          </>
        )}

        {!hasScenarios && (
          <div className="flex items-center gap-2">
            <BulbOutlined className="!text-[#b0adbe] text-[15px]" />
            <span className="!text-[#8b87a0] text-[13px]">
              Generated scenarios will appear here
            </span>
          </div>
        )}
      </div>

      {/* ── list / grid area ──────────────────────────────────────────── */}
      <div className="scenario-table__list flex-1 overflow-y-auto px-5 py-4">
        {!hasScenarios && !draftScenario ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Empty
              description={
                <span className="!text-[#8b87a0] text-[14px]">
                  Enter a user story in the chat to generate scenarios
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <>
            {/* ── mode identity banner ─── */}
            {hasScenarios && (
              <div
                className={`flex items-center gap-2 mb-4 px-4 py-[9px] rounded-xl text-[13px] ${
                  isScenarioView ? "bg-[#f3eaff] text-[#7c3aed]" : "bg-[#e8f4fd] text-[#2563eb]"
                }`}
              >
                {isScenarioView ? (
                  <BulbOutlined className="text-[15px]" />
                ) : (
                  <ExperimentOutlined className="text-[15px]" />
                )}
                <span className="font-bold">
                  {isScenarioView ? "Scenarios" : "Test Cases"}
                </span>
                <span style={{ opacity: 0.65 }}>
                  {isScenarioView
                    ? "— high-level test flows"
                    : "— step-by-step execution, ready to save"}
                </span>
              </div>
            )}

            {/* ── scenario table view ─── */}
            {isScenarioView && (
              <div className="flex flex-col rounded-xl overflow-hidden border border-[#f3f0fb]">
                {/* table header */}
                <div
                  className="flex items-center gap-3 px-4 py-[9px] bg-[#faf9ff] border-b border-[#f3f0fb]"
                  style={{ borderLeft: "3px solid transparent" }}
                >
                  <Checkbox
                    checked={selectedIds.size === displayScenarios.length && displayScenarios.length > 0}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < displayScenarios.length}
                    onChange={() => {
                      if (selectedIds.size === displayScenarios.length) {
                        setSelectedIds(new Set());
                      } else {
                        setSelectedIds(new Set(displayScenarios.map((s) => s.id)));
                      }
                    }}
                    className="shrink-0"
                  />
                  <span className="shrink-0 w-[28px]" />
                  <span className="shrink-0 w-[60px] !text-[#8b87a0] text-[11px] uppercase tracking-wide font-semibold">ID</span>
                  <span className="shrink-0 w-[46px] !text-[#8b87a0] text-[11px] uppercase tracking-wide font-semibold">Type</span>
                  <span className="flex-1 min-w-0 !text-[#8b87a0] text-[11px] uppercase tracking-wide font-semibold">Title</span>
                  <span className="shrink-0 w-[64px] !text-[#8b87a0] text-[11px] uppercase tracking-wide font-semibold">Priority</span>
                  <span className="shrink-0 w-[80px] !text-[#8b87a0] text-[11px] uppercase tracking-wide font-semibold">Category</span>
                  <span className="shrink-0 w-[52px] text-right !text-[#8b87a0] text-[11px] uppercase tracking-wide font-semibold">Steps</span>
                  <span className="shrink-0 w-[32px]" />
                </div>

                {/* rows */}
                {displayScenarios.map((sc, i) => (
                  <ScenarioTableRow
                    key={sc.id}
                    scenario={sc}
                    index={i}
                    isSelected={selectedIds.has(sc.id)}
                    onToggleSelect={() => toggleSelect(sc.id)}
                    onUpdate={handleUpdateScenario}
                  />
                ))}

                {/* draft form */}
                {draftScenario && (
                  <div className="p-4">
                    <EditScenarioForm
                      scenario={draftScenario}
                      onSave={(saved) => {
                        if (saved.title.trim()) {
                          onAddScenario(saved);
                        }
                        setDraftScenario(null);
                      }}
                      onCancel={() => setDraftScenario(null)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── test case list view ─── */}
            {isTcView && (
              <div className="flex flex-col gap-3">
                {displayScenarios.map((sc, i) => (
                  <TestCaseListCard
                    key={sc.id}
                    scenario={sc}
                    index={i}
                    isSelected={selectedIds.has(sc.id)}
                    onToggleSelect={() => toggleSelect(sc.id)}
                    onUpdate={handleUpdateScenario}
                  />
                ))}
                {draftScenario && (
                  <EditScenarioForm
                    scenario={draftScenario}
                    onSave={(saved) => {
                      if (saved.title.trim()) {
                        onAddScenario(saved);
                        setTcGeneratedIds((prev) => [...prev, saved.id]);
                      }
                      setDraftScenario(null);
                    }}
                    onCancel={() => setDraftScenario(null)}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── floating bottom bar ────────────────────────────────────────── */}
      {hasScenarios && ((isScenarioView && selectedCount > 0) || isTcView) && (
        <div
          className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#f3f0fb]"
          style={{ boxShadow: "0 -2px 10px 0 rgba(124, 58, 237, 0.05)" }}
        >
          <span
            className="!text-[#8b87a0] text-[13px] font-medium"
          >
            {isTcView
              ? `${displayScenarios.length} test case${displayScenarios.length !== 1 ? "s" : ""} ready`
              : `${selectedCount} scenario${selectedCount !== 1 ? "s" : ""} selected`}
          </span>

          {isScenarioView ? (
            <button
              onClick={handleGoToTcView}
              className="flex items-center gap-2 px-5 py-[9px] rounded-xl border-0 bg-[#7c3aed] text-white text-[13px] cursor-pointer hover:bg-[#6d28d9] transition-colors font-semibold"
            >
              <ExperimentOutlined className="text-[14px]" />
              {tcCtaLabel}
              <ArrowRightOutlined className="text-[13px]" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Secondary: Save — stays on current view */}
              <button
                onClick={() => onSave(displayScenarios.map((s) => s.id))}
                disabled={isSaveDisabled}
                className={`flex items-center gap-2 px-5 py-[9px] rounded-xl border border-[#dbeafe] bg-white !text-[#2563eb] text-[13px] transition-colors font-semibold ${isSaveDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#e8f4fd]"}`}
              >
                <SaveOutlined className="text-[14px]" />
                Save
              </button>
              {/* Primary: Save & Continue — resets generator */}
              <button
                onClick={() => onSaveAndContinue(displayScenarios.map((s) => s.id))}
                disabled={isSaveDisabled}
                className={`flex items-center gap-2 px-5 py-[9px] rounded-xl border-0 bg-[#2563eb] text-white text-[13px] transition-colors font-semibold ${isSaveDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#1d4ed8]"}`}
              >
                <SaveOutlined className="text-[14px]" />
                Save &amp; Continue
                <ArrowRightOutlined className="text-[13px]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
