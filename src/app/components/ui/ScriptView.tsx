import React, { useState, useMemo } from "react";
import { Tag, Tooltip, App } from "antd";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownloadOutlined,
  CheckOutlined,
  SaveOutlined,
  UnorderedListOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { Scenario, GeneratedScript } from "../../lib/mock-data";
import { generateCombinedPythonScript } from "../../lib/mock-data";

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

/* ─── props ──────────────────────────────────────────────────────────── */

interface ScriptViewProps {
  scenarios: Scenario[];
  onBack: () => void;
  onSave: () => void;
}

/* ─── component ──────────────────────────────────────────────────────── */

export function ScriptView({ scenarios, onBack, onSave }: ScriptViewProps) {
  const { message } = App.useApp();
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const script: GeneratedScript = useMemo(
    () => generateCombinedPythonScript(scenarios),
    [scenarios]
  );

  const handleCopyCode = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = script.code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      message.success("Script copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const fileName = `test_${scenarios[0]?.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 40) || "generated"}.py`;
    const blob = new Blob([script.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`Downloaded ${fileName}`);
  };

  const fileName = `test_${scenarios[0]?.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 40) || "generated"}.py`;

  return (
    <div className="script-view flex flex-col h-full">
      {/* ── back bar ──────────────────────────────────────────────────── */}
      <div className="script-view__back-bar flex items-center gap-2 px-4 py-[8px] border-b border-[#f3f0fb] bg-[#f0fdf4]/40">
        <button
          onClick={onBack}
          className="flex items-center gap-[5px] px-2 py-[4px] rounded-md border border-[#d1e7dd] bg-white !text-[#15803d] text-[11px] cursor-pointer hover:bg-[#f0fdf4] hover:border-[#15803d] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        >
          <ArrowLeftOutlined className="text-[10px]" />
          Back to Test Cases
        </button>
        <span
          className="!text-[#15803d] text-[11px] bg-[#dcfce7] rounded-full px-2 py-[2px]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          1 combined script — {scenarios.length} test case{scenarios.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── toolbar ──────────────────────────────────────────────────── */}
      <div className="script-view__toolbar flex items-center gap-3 px-4 py-[10px] border-b border-[#f3f0fb] bg-white">
        <div className="flex items-center gap-2">
          <Tag
            className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[20px]"
            color="blue"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Python
          </Tag>
          <span
            className="!text-[#8b87a0] text-[10px] bg-[#f3f0fb] rounded px-[6px] py-[2px]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            pytest + selenium
          </span>
        </div>

        <div className="flex-1" />

        <Tooltip title="Save to Repository">
          <button
            onClick={onSave}
            className="flex items-center gap-[5px] px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:bg-[#faf5ff] hover:border-[#7c3aed] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            <SaveOutlined className="text-[12px]" />
            Save
          </button>
        </Tooltip>

        <Tooltip title="Copy Script">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-[5px] px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:bg-[#faf5ff] hover:border-[#7c3aed] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            {copied ? <CheckOutlined className="!text-[#15803d] text-[12px]" /> : <CopyOutlined className="text-[12px]" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </Tooltip>

        <Tooltip title="Download .py File">
          <button
            onClick={handleDownload}
            className="flex items-center gap-[5px] px-3 py-[5px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:bg-[#faf5ff] hover:border-[#7c3aed] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            <DownloadOutlined className="text-[12px]" />
            Download
          </button>
        </Tooltip>
      </div>

      {/* ── content: sidebar + code panel ─────────────────────────────── */}
      <div className="script-view__content flex flex-1 min-h-0">
        {/* ── included test cases sidebar ─────────────────────────────── */}
        <div
          className="script-view__sidebar shrink-0 border-r border-[#f3f0fb] bg-white flex flex-col overflow-hidden transition-all duration-200"
          style={{ width: sidebarOpen ? 280 : 0 }}
        >
          {sidebarOpen && (
            <>
              <div className="flex items-center justify-between px-3 py-[9px] border-b border-[#f3f0fb]">
                <div className="flex items-center gap-[6px]">
                  <UnorderedListOutlined className="!text-[#8b87a0] text-[11px]" />
                  <span
                    className="!text-[#8b87a0] text-[10px] uppercase tracking-wide"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                  >
                    Included Test Cases ({scenarios.length})
                  </span>
                </div>
                <Tooltip title="Collapse panel">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-center w-[20px] h-[20px] rounded bg-transparent border-0 !text-[#b0adbe] hover:!text-[#7c3aed] cursor-pointer text-[10px]"
                  >
                    <ArrowLeftOutlined />
                  </button>
                </Tooltip>
              </div>
              <div className="flex-1 overflow-y-auto">
                {scenarios.map((sc, idx) => {
                  const isApi = sc.type === "api";
                  const stepsCount = isApi ? sc.apiSteps.length : sc.steps.length;
                  const pColor = PRIORITY_COLORS[sc.priority];
                  const cColor = CATEGORY_COLORS[sc.category];
                  // Find the line number of the corresponding test method
                  const methodName = `test_${sc.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 60)}`;
                  const lineIdx = script.code.split("\n").findIndex((l) => l.includes(`def ${methodName}`));

                  return (
                    <div
                      key={sc.id}
                      className="script-view__sidebar-item px-3 py-[10px] border-b border-[#f3f0fb] hover:bg-[#faf9ff] transition-colors cursor-default"
                    >
                      {/* row 1: index + id + type */}
                      <div className="flex items-center gap-[5px] mb-[4px]">
                        <span
                          className="!text-[#b0adbe] text-[10px] w-[16px] shrink-0"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                        >
                          {idx + 1}.
                        </span>
                        <span
                          className="!text-[#7c3aed] text-[9px] bg-[#f3eaff] rounded px-[4px] py-[1px]"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                        >
                          {sc.scenarioId}
                        </span>
                        <Tag
                          className="!text-[9px] !px-[4px] !py-0 !m-0 !leading-[16px] !uppercase"
                          color={isApi ? "geekblue" : "cyan"}
                          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                        >
                          {isApi ? "API" : "UI"}
                        </Tag>
                        <Tag
                          className="!text-[9px] !px-[4px] !py-0 !m-0 !leading-[16px]"
                          style={{ background: pColor.bg, color: pColor.text, borderColor: pColor.border, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                        >
                          {sc.priority}
                        </Tag>
                      </div>
                      {/* row 2: title */}
                      <span
                        className="!text-[#0f0a1e] text-[11px] block truncate mb-[4px]"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                      >
                        {sc.title}
                      </span>
                      {/* row 3: category + steps + line ref */}
                      <div className="flex items-center gap-[6px]">
                        <Tag
                          className="!text-[8px] !px-[4px] !py-0 !m-0 !leading-[14px]"
                          style={{ background: cColor.bg, color: cColor.text, borderColor: cColor.border, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                        >
                          {sc.category}
                        </Tag>
                        <span
                          className="!text-[#8b87a0] text-[9px]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {stepsCount} step{stepsCount !== 1 ? "s" : ""}
                        </span>
                        {lineIdx >= 0 && (
                          <span
                            className="!text-[#7c3aed] text-[9px] bg-[#f3eaff] rounded px-[3px] py-[0px] ml-auto"
                            style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
                          >
                            L{lineIdx + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── toggle sidebar button (when collapsed) ─────────────────── */}
        {!sidebarOpen && (
          <div className="shrink-0 flex flex-col items-center pt-2 px-1 bg-white border-r border-[#f3f0fb]">
            <Tooltip title="Show included test cases" placement="right">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-md border border-[#e2dff0] bg-white !text-[#8b87a0] hover:!text-[#7c3aed] hover:border-[#7c3aed] hover:bg-[#faf5ff] cursor-pointer text-[12px] transition-colors"
              >
                <RightOutlined className="text-[10px]" />
              </button>
            </Tooltip>
            <span
              className="!text-[#b0adbe] text-[9px] mt-1 [writing-mode:vertical-rl] rotate-180"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
            >
              {scenarios.length} TC
            </span>
          </div>
        )}

        {/* ── code panel ──────────────────────────────────────────────── */}
        <div className="script-view__code-panel flex-1 min-w-0 flex flex-col overflow-auto p-4 bg-[#faf9ff]">
          <div className="script-view__code-block rounded-lg border border-[#e2dff0] bg-[#1e1b2e] overflow-hidden">
            {/* code block header */}
            <div className="flex items-center justify-between px-4 py-[6px] bg-[#2a2640] border-b border-[#3d3758]">
              <div className="flex items-center gap-[6px]">
                <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              </div>
              <span
                className="!text-[#8b87a0] text-[10px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {fileName}
              </span>
            </div>
            {/* code content with line numbers */}
            <div className="overflow-auto">
              <pre className="p-0 m-0">
                <code
                  className="block px-0 py-3 text-[12px] leading-[20px]"
                  style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
                >
                  {script.code.split("\n").map((line, i) => (
                    <div key={i} className="flex hover:bg-[#2a2640] transition-colors">
                      <span
                        className="w-[50px] shrink-0 text-right pr-4 select-none !text-[#4c4568]"
                        style={{ fontSize: 11 }}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 !text-[#e0ddf0] pr-4 whitespace-pre">
                        {colorizePython(line)}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── simple Python syntax coloring ──────────────────────────────────── */

function colorizePython(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let keyIdx = 0;

  // Comments
  if (line.trimStart().startsWith("#")) {
    return <span key="c" style={{ color: "#6b6893" }}>{line}</span>;
  }

  // Docstrings
  if (line.trimStart().startsWith('"""') || line.trimStart().startsWith("'''")) {
    return <span key="d" style={{ color: "#a5d6a7" }}>{line}</span>;
  }

  const stringRegex = /"[^"]*"|'[^']*'|f"[^"]*"|f'[^']*'/g;
  const segments: { text: string; isString: boolean }[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = stringRegex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ text: line.slice(lastIdx, match.index), isString: false });
    }
    segments.push({ text: match[0], isString: true });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < line.length) {
    segments.push({ text: line.slice(lastIdx), isString: false });
  }

  for (const seg of segments) {
    if (seg.isString) {
      parts.push(
        <span key={keyIdx++} style={{ color: "#a5d6a7" }}>
          {seg.text}
        </span>
      );
    } else {
      const text = seg.text;
      const subParts: React.ReactNode[] = [];
      let subLastIdx = 0;
      const kwRegex = /\b(import|from|class|def|self|assert|return|if|else|elif|for|in|not|and|or|True|False|None|yield|with|as|raise|try|except|finally|pass|lambda)\b|(@\w+)/g;
      let kwMatch: RegExpExecArray | null;
      while ((kwMatch = kwRegex.exec(text)) !== null) {
        if (kwMatch.index > subLastIdx) {
          subParts.push(<span key={keyIdx++}>{text.slice(subLastIdx, kwMatch.index)}</span>);
        }
        const kw = kwMatch[0];
        const isDecorator = kw.startsWith("@");
        const isBuiltin = ["self", "True", "False", "None"].includes(kw);
        subParts.push(
          <span key={keyIdx++} style={{ color: isDecorator ? "#ffcb6b" : isBuiltin ? "#80cbc4" : "#c792ea" }}>
            {kw}
          </span>
        );
        subLastIdx = kwMatch.index + kwMatch[0].length;
      }
      if (subLastIdx < text.length) {
        subParts.push(<span key={keyIdx++}>{text.slice(subLastIdx)}</span>);
      }
      parts.push(...subParts);
    }
  }

  return <>{parts}</>;
}