import { useState, useRef, useEffect } from "react";
import { Input, Tooltip, Dropdown } from "antd";
import {
  SendOutlined,
  BulbOutlined,
  AppstoreOutlined,
  ApiOutlined,
  PaperClipOutlined,
  DownOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import type { GeneratorMessage, Scenario, TestType, GenerateMode, JiraStory } from "../../lib/mock-data";
import { ArrowRightOutlined } from "@ant-design/icons";

type ScenarioType = "all" | "positive" | "negative" | "edge-case";

const SCENARIO_TYPES: { value: ScenarioType; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "positive", label: "Positive" },
  { value: "negative", label: "Negative" },
  { value: "edge-case", label: "Edge Case" },
];

interface GeneratorChatProps {
  messages: GeneratorMessage[];
  onSend: (content: string, testType: TestType, mode: GenerateMode, attachments: AttachedFile[], scenarioType: ScenarioType) => void;
  isGenerating: boolean;
  viewMode: "scenario" | "testcase";
  onBackToScenarios: () => void;
  onRestoreScenarios: (scenarios: Scenario[], fromSave?: boolean) => void;
  stories?: JiraStory[];
  onStorySelect?: (storyId: string | undefined) => void;
}

interface AttachedFile {
  name: string;
  size: string;
}

export function GeneratorChat({ messages, onSend, isGenerating, viewMode, onBackToScenarios, onRestoreScenarios, stories = [], onStorySelect }: GeneratorChatProps) {
  const [input, setInput] = useState("");
  const [testType, setTestType] = useState<TestType>("ui");
  const [mode, setMode] = useState<GenerateMode>("scenario-only");
  const [scenarioType, setScenarioType] = useState<ScenarioType>("all");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [selectedStory, setSelectedStory] = useState<JiraStory | null>(null);
  const [storyDropdownOpen, setStoryDropdownOpen] = useState(false);
  const [storySearch, setStorySearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectStory = (story: JiraStory) => {
    setSelectedStory(story);
    setInput(story.summary);
    setStoryDropdownOpen(false);
    setStorySearch("");
    onStorySelect?.(story.id);
  };

  const handleClearStory = () => {
    setSelectedStory(null);
    setInput("");
    onStorySelect?.(undefined);
  };

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    onSend(input.trim(), testType, mode, attachments, scenarioType);
    setInput("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: AttachedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      size: f.size < 1024 ? `${f.size} B` : `${(f.size / 1024).toFixed(1)} KB`,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  /* Reusable pill toggle */
  function PillToggle<T extends string>({
    options,
    value,
    onChange,
  }: {
    options: { label: React.ReactNode; value: T }[];
    value: T;
    onChange: (v: T) => void;
  }) {
    return (
      <div className="flex items-center rounded-lg bg-[#f5f3fa] p-[3px] gap-[2px]">
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-[5px] px-[10px] py-[4px] rounded-md border-0 cursor-pointer transition-all text-[11px] whitespace-nowrap ${
                isActive
                  ? "bg-white text-[#7c3aed] shadow-sm font-semibold"
                  : "bg-transparent text-[#8b87a0] hover:text-[#4c4568] font-medium"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="generator-chat flex flex-col h-full min-h-0">
      {/* Chat messages */}
      <div className="generator-chat__messages flex-1 overflow-auto px-4 py-4 flex flex-col gap-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
            <div className="size-12 rounded-xl bg-[#faf5ff] flex items-center justify-center">
              <BulbOutlined style={{ fontSize: 22, color: "#7c3aed" }} />
            </div>
            <p
              className="text-[#0f0a1e] text-[16px] font-semibold"
            >
              Write your user story
            </p>
            <p className="text-[#8b87a0] text-[13px] max-w-[280px]">
              Describe the feature or flow you want to test, and we'll generate scenarios and test cases for you.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`generator-chat__bubble max-w-[95%] rounded-xl px-3 py-2 ${
              msg.role === "user"
                ? "self-end bg-[#7c3aed] text-white"
                : "self-start bg-white border border-[#f3f0fb] text-[#0f0a1e]"
            }`}
          >
            {msg.role === "user" && (
              <div className="flex gap-[5px] mb-1 flex-wrap">
                {msg.testType && (
                  <span className="text-[10px] bg-white/20 rounded px-[6px] py-[1px] uppercase">
                    {msg.testType}
                  </span>
                )}
                {msg.mode && (
                  <span className="text-[10px] bg-white/20 rounded px-[6px] py-[1px]">
                    {msg.mode === "scenario-testcase" ? "Scenario + TC" : "Scenario Only"}
                  </span>
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <span className="text-[10px] bg-white/20 rounded px-[6px] py-[1px]">
                    <PaperClipOutlined className="mr-[3px]" />{msg.attachments.length} file{msg.attachments.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
            <p className="text-[13px] whitespace-pre-wrap">
              {msg.content}
            </p>
            <p
              className={`text-[10px] mt-1 ${
                msg.role === "user" ? "text-white/60" : "text-[#c0bcd1]"
              }`}
            >
              {msg.timestamp}
            </p>

            {/* History navigation link — hidden in TC view (Back to Scenarios covers it) */}
            {msg.role === "assistant" && msg.scenarios && msg.scenarios.length > 0 && viewMode !== "testcase" && (
              <button
                onClick={() => onRestoreScenarios(msg.scenarios!, !!msg.savedToRepo)}
                className="flex items-center gap-[4px] mt-[6px] border-0 bg-transparent p-0 cursor-pointer hover:opacity-70 transition-opacity font-semibold"
                style={{ fontSize: 11, color: "#7c3aed" }}
              >
                {msg.savedToRepo ? "View Test Cases" : "View Scenarios"}
                <ArrowRightOutlined style={{ fontSize: 9 }} />
              </button>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="self-start bg-white border border-[#f3f0fb] rounded-xl px-3 py-2">
            <div className="flex gap-1 items-center">
              <span className="inline-block size-[6px] bg-[#7c3aed] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="inline-block size-[6px] bg-[#7c3aed] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="inline-block size-[6px] bg-[#7c3aed] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Inline back link — appears in the chat flow when reviewing test cases */}
        {viewMode === "testcase" && (
          <div className="self-start flex items-center gap-[6px]">
            <button
              onClick={onBackToScenarios}
              className="flex items-center gap-[5px] border-0 bg-transparent cursor-pointer p-0 hover:opacity-70 transition-opacity font-semibold"
              style={{ fontSize: 12, color: "#7c3aed" }}
            >
              <ArrowLeftOutlined style={{ fontSize: 10 }} />
              Back to Scenarios
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Options bar + Input */}
      <div className="generator-chat__input-area border-t border-[#f3f0fb] bg-white px-4 py-3 flex flex-col gap-[10px]">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {attachments.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center gap-[6px] bg-[#f5f3fa] rounded-lg px-[10px] py-[5px]"
              >
                <PaperClipOutlined style={{ fontSize: 11, color: "#7c3aed" }} />
                <span className="text-[11px] text-[#4c4568] max-w-[120px] truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-[#8b87a0]">{file.size}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="border-0 bg-transparent cursor-pointer text-[#8b87a0] hover:text-[#e74c3c] text-[11px] p-0 flex items-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Selected story chip */}
        {selectedStory && (
          <div className="flex items-center gap-[6px] bg-[#f3eaff] rounded-lg px-[10px] py-[5px] self-start">
            <span className="text-[11px] text-[#7c3aed] font-semibold">{selectedStory.key}</span>
            <span className="text-[11px] text-[#4c4568] max-w-[180px] truncate">{selectedStory.summary}</span>
            <button
              onClick={handleClearStory}
              className="border-0 bg-transparent cursor-pointer text-[#8b87a0] hover:text-[#7c3aed] text-[12px] p-0 flex items-center leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Options row */}
        <div className="flex items-center gap-[8px] flex-wrap">
          {/* UI / API toggle */}
          <PillToggle<TestType>
            value={testType}
            onChange={setTestType}
            options={[
              {
                label: (
                  <>
                    <AppstoreOutlined style={{ fontSize: 11 }} /> UI
                  </>
                ),
                value: "ui",
              },
              {
                label: (
                  <>
                    <ApiOutlined style={{ fontSize: 11 }} /> API
                  </>
                ),
                value: "api",
              },
            ]}
          />

          {/* Generate mode toggle */}
          <PillToggle<GenerateMode>
            value={mode}
            onChange={setMode}
            options={[
              { label: "Scenario", value: "scenario-only" },
              { label: "Scenario + TC", value: "scenario-testcase" },
            ]}
          />

          {/* Scenario type dropdown */}
          <Dropdown
            menu={{
              items: SCENARIO_TYPES.map((t) => ({
                key: t.value,
                label: (
                  <span className="text-[12px]">
                    {t.label}
                  </span>
                ),
              })),
              onClick: ({ key }) => setScenarioType(key as ScenarioType),
              selectedKeys: [scenarioType],
            }}
            trigger={["click"]}
          >
            <button
              className="flex items-center gap-[4px] rounded-lg bg-[#f5f3fa] border-0 px-[10px] py-[5px] cursor-pointer text-[11px] text-[#4c4568] hover:bg-[#ede5fb] transition-colors whitespace-nowrap font-medium"
            >
              {SCENARIO_TYPES.find((t) => t.value === scenarioType)?.label}
              <DownOutlined style={{ fontSize: 8, opacity: 0.5 }} />
            </button>
          </Dropdown>

          {/* Use Story button */}
          {stories.length > 0 && (
            <Dropdown
              open={storyDropdownOpen}
              onOpenChange={setStoryDropdownOpen}
              trigger={["click"]}
              dropdownRender={() => (
                <div
                  className="bg-white rounded-xl shadow-lg border border-[#f3f0fb] py-2"
                  style={{ width: 280, maxHeight: 260, display: "flex", flexDirection: "column" }}
                >
                  <div className="px-3 pb-2">
                    <input
                      autoFocus
                      placeholder="Search stories..."
                      value={storySearch}
                      onChange={(e) => setStorySearch(e.target.value)}
                      className="w-full rounded-lg border border-[#f3f0fb] bg-[#faf9ff] px-3 py-[6px] text-[12px] outline-none text-[#4c4568] placeholder:text-[#b0adbe]"
                    />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {stories
                      .filter((s) =>
                        storySearch.trim() === "" ||
                        s.summary.toLowerCase().includes(storySearch.toLowerCase()) ||
                        s.key.toLowerCase().includes(storySearch.toLowerCase())
                      )
                      .map((story) => (
                        <button
                          key={story.id}
                          onClick={() => handleSelectStory(story)}
                          className="w-full text-left px-3 py-[8px] border-0 bg-transparent cursor-pointer hover:bg-[#faf5ff] transition-colors flex flex-col gap-[2px]"
                        >
                          <span
                            className="text-[11px] text-[#7c3aed] font-bold"
                          >
                            {story.key}
                          </span>
                          <span
                            className="text-[12px] text-[#4c4568] line-clamp-2"
                          >
                            {story.summary}
                          </span>
                        </button>
                      ))}
                    {stories.filter((s) =>
                      storySearch.trim() === "" ||
                      s.summary.toLowerCase().includes(storySearch.toLowerCase()) ||
                      s.key.toLowerCase().includes(storySearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-center text-[12px] text-[#b0adbe] py-4">
                        No stories found
                      </p>
                    )}
                  </div>
                </div>
              )}
            >
              <button
                className="flex items-center gap-[4px] rounded-lg bg-[#f3eaff] border-0 px-[10px] py-[5px] cursor-pointer text-[11px] text-[#7c3aed] hover:bg-[#ede5fb] transition-colors whitespace-nowrap font-semibold"
              >
                Use Story
                <DownOutlined style={{ fontSize: 8, opacity: 0.5 }} />
              </button>
            </Dropdown>
          )}
        </div>

        {/* Text input */}
        <div className="flex items-end rounded-xl border border-[#f3f0fb] bg-white px-1 py-1 gap-1">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.pdf,.doc,.docx,.xlsx,.csv,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Attachment button */}
          <Tooltip title="Attach files">
            <button
              onClick={handleFileSelect}
              className="shrink-0 size-8 rounded-lg border-0 bg-transparent text-[#c0bcd1] flex items-center justify-center cursor-pointer hover:text-[#7c3aed] transition-colors"
            >
              <PaperClipOutlined style={{ fontSize: 16 }} />
            </button>
          </Tooltip>

          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your user story or feature to test..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            variant="borderless"
            style={{
              fontSize: 13,
              padding: "5px 4px",
              resize: "none",
            }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="generator-chat__send-btn shrink-0 size-8 rounded-lg border-0 text-white flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[#7c3aed]"
          >
            <SendOutlined style={{ fontSize: 13 }} />
          </button>
        </div>
      </div>
    </div>
  );
}