import React, { useState, useMemo } from "react";
import { Tag, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownOutlined,
  FileTextOutlined,
  CodeOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import type { RepoItem, Scenario } from "../../lib/mock-data";

/* ─── constants ─────────────────────────────────────────────────────── */

const TYPE_CONFIG: Record<string, { bg: string; color: string; label: string; labelPlural: string; icon: React.ReactNode; activeBg: string }> = {
  scenario: { bg: "#e8f4fd", color: "#1677ff", label: "Scenario", labelPlural: "Scenarios", icon: <ExperimentOutlined />, activeBg: "#dbeafe" },
  testcase: { bg: "#f3eaff", color: "#7c3aed", label: "Test Case", labelPlural: "Test Cases", icon: <FileTextOutlined />, activeBg: "#ede5ff" },
  script: { bg: "#f0fdf4", color: "#15803d", label: "Script", labelPlural: "Scripts", icon: <CodeOutlined />, activeBg: "#dcfce7" },
};

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

/* ─── mini preview ──────────────────────────────────────────────────── */

function MiniPreview({ scenario }: { scenario: Scenario }) {
  const isApi = scenario.type === "api";
  const steps = isApi ? scenario.apiSteps : scenario.steps;

  if (!steps.length) {
    return (
      <p className="!text-[#8b87a0] text-[11px] italic py-1">
        Scenario only — no test case steps attached.
      </p>
    );
  }

  if (isApi) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr>
              {["#", "Method", "Endpoint", "Status"].map((h) => (
                <th key={h} className="text-left px-2 py-[4px] !text-[#8b87a0] bg-[#faf9ff] border-b border-[#f3f0fb] whitespace-nowrap font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenario.apiSteps.map((s, i) => (
              <tr key={s.id}>
                <td className="px-2 py-[3px] border-b border-[#f3f0fb] !text-[#b0adbe]">{i + 1}</td>
                <td className="px-2 py-[3px] border-b border-[#f3f0fb]">
                  <Tag className="!text-[9px] !px-[5px] !py-0 !m-0 !leading-[16px]" color={s.method === "GET" ? "blue" : s.method === "POST" ? "green" : "orange"}>{s.method}</Tag>
                </td>
                <td className="px-2 py-[3px] border-b border-[#f3f0fb] !text-[#4c4568] font-mono text-[9px]">{s.endpoint}</td>
                <td className="px-2 py-[3px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.outputStatusCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <table className="w-full text-[10px] border-collapse">
      <thead>
        <tr>
          {["#", "Step", "Expected Result"].map((h) => (
            <th key={h} className="text-left px-2 py-[4px] !text-[#8b87a0] bg-[#faf9ff] border-b border-[#f3f0fb] whitespace-nowrap font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {scenario.steps.map((s, i) => (
          <tr key={s.id}>
            <td className="px-2 py-[3px] border-b border-[#f3f0fb] !text-[#b0adbe]">{i + 1}</td>
            <td className="px-2 py-[3px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.step}</td>
            <td className="px-2 py-[3px] border-b border-[#f3f0fb] !text-[#4c4568]">{s.expectedResult}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── expandable card ───────────────────────────────────────────────── */

function ItemCard({ item, index }: { item: RepoItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const prioColor = PRIORITY_COLORS[item.priority];
  const catColor = CATEGORY_COLORS[item.category];

  return (
    <div
      className="border border-[#f3f0fb] rounded-lg bg-white overflow-hidden transition-all"
      style={{ boxShadow: expanded ? "0 2px 8px rgba(124,58,237,0.06)" : "none" }}
    >
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#faf5ff] transition-colors"
      >
        <span
          className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#f3eaff] !text-[#7c3aed] text-[10px] shrink-0 font-bold"
        >
          {index + 1}
        </span>

        <span
          className="flex-1 min-w-0 truncate !text-[#0f0a1e] text-[12.5px] font-medium"
        >
          {item.name}
        </span>

        <Tag
          className="!text-[9px] !px-[6px] !py-0 !m-0 !leading-[18px] font-semibold"
          style={{ background: prioColor.bg, color: prioColor.text, borderColor: prioColor.border }}
        >
          {item.priority}
        </Tag>
        <Tag
          className="!text-[9px] !px-[6px] !py-0 !m-0 !leading-[18px] font-semibold"
          style={{ background: catColor.bg, color: catColor.text, borderColor: catColor.border }}
        >
          {item.category}
        </Tag>

        <span className="!text-[#8b87a0] text-[10px] shrink-0 transition-transform" style={{ transform: expanded ? "rotate(0)" : "rotate(-90deg)" }}>
          <DownOutlined />
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-3 border-t border-[#f3f0fb]">
          <div className="pt-2">
            <MiniPreview scenario={item.scenario} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────── */

interface StoryDetailViewProps {
  sourceStory: string;
  items: RepoItem[];
  clickedItem: RepoItem;
  onBack: () => void;
  onEditInGenerator: (items: RepoItem[]) => void;
}

export function StoryDetailView({ sourceStory, items, clickedItem, onBack, onEditInGenerator }: StoryDetailViewProps) {
  // Active tab defaults to the type of the item that was clicked
  const [activeType, setActiveType] = useState<"scenario" | "testcase" | "script">(clickedItem.type);

  // Group items by type
  const grouped = useMemo(() => {
    const map: Record<string, RepoItem[]> = { scenario: [], testcase: [], script: [] };
    items.forEach((i) => map[i.type]?.push(i));
    return map;
  }, [items]);

  // Only show tabs that have items
  const availableTypes = (["scenario", "testcase", "script"] as const).filter((t) => grouped[t].length > 0);

  const activeItems = grouped[activeType] || [];
  const typeConfig = TYPE_CONFIG[activeType];

  // Build the button label based on active type
  const editLabel = `Edit ${activeItems.length} ${activeItems.length === 1 ? typeConfig.label : typeConfig.labelPlural} in Generator`;

  return (
    <div className="story-detail flex flex-col h-full">
      {/* header */}
      <div className="story-detail__header flex items-center gap-3 px-6 py-4 border-b border-[#f3f0fb] bg-white">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-[30px] h-[30px] rounded-lg bg-[#f3eaff] border-0 !text-[#7c3aed] cursor-pointer hover:bg-[#e8d5ff] transition-colors text-[13px]"
        >
          <ArrowLeftOutlined />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="!text-[#8b87a0] text-[10px] uppercase tracking-[1px] font-semibold"
            >
              Source Story
            </span>
          </div>
          <h2
            className="!text-[#0f0a1e] text-[15px] mt-[2px] truncate !m-0 font-bold"
          >
            {sourceStory || "Untitled Story"}
          </h2>
        </div>

        <Tooltip title={editLabel}>
          <button
            onClick={() => onEditInGenerator(activeItems)}
            className="flex items-center gap-2 h-[34px] px-4 rounded-lg bg-[#7c3aed] border-0 !text-white cursor-pointer hover:bg-[#6d28d9] transition-colors text-[12px] font-semibold"
          >
            <EditOutlined />
            Edit in Generator
          </button>
        </Tooltip>
      </div>

      {/* type tabs */}
      <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-[#f3f0fb]">
        {availableTypes.map((type) => {
          const cfg = TYPE_CONFIG[type];
          const count = grouped[type].length;
          const isActive = activeType === type;

          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-[6px] h-[30px] px-3 rounded-lg border-0 cursor-pointer transition-all text-[11.5px] ${isActive ? "font-bold" : "font-medium"}`}
              style={{
                background: isActive ? cfg.activeBg : "#f5f4f8",
                color: isActive ? cfg.color : "#8b87a0",
                outline: isActive ? `1.5px solid ${cfg.color}20` : "none",
              }}
            >
              {cfg.icon}
              {cfg.labelPlural}
              <span
                className="text-[10px] min-w-[16px] text-center rounded-full px-[5px] py-[0px] font-bold"
                style={{
                  background: isActive ? `${cfg.color}18` : "#e8e6f0",
                  color: isActive ? cfg.color : "#8b87a0",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}

        <span className="ml-auto !text-[#8b87a0] text-[10.5px]">
          Total: <span className="!text-[#0f0a1e] font-semibold">{items.length}</span> items from this story
        </span>
      </div>

      {/* items list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {activeItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="!text-[#8b87a0] text-[13px]">
              No {typeConfig.labelPlural.toLowerCase()} saved from this story yet.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {activeItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
