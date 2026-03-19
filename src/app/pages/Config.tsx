import React, { useState, useCallback, useRef } from "react";
import { Input, Select, Tag, Tooltip, App } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router";
import type { ProjectAttachment } from "../lib/mock-data";
import { FILE_TYPE_ICONS } from "../lib/mock-data";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateConfig, connectJira, disconnectJira } from "../../store/projectConfigSlice";

/* ─── section wrapper ────────────────────────────────────────────────── */

function Section({
  title,
  icon,
  children,
  extra,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="config__section bg-white rounded-xl border border-[#f3f0fb] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#f3f0fb]">
        <span className="!text-[#7c3aed] text-[14px]">{icon}</span>
        <span
          className="!text-[#0f0a1e] text-[13px]"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
        >
          {title}
        </span>
        {extra && <div className="ml-auto">{extra}</div>}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

/* ─── stat mini card ─────────────────────────────────────────────────── */

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1 py-3 rounded-lg bg-[#faf9ff] border border-[#f3f0fb]">
      <span
        className="text-[24px] leading-[24px]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color }}
      >
        {value}
      </span>
      <span
        className="!text-[#8b87a0] text-[10px] uppercase tracking-wide"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────── */

export function Config() {
  const { message } = App.useApp();
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = useAppSelector(
    (s) => s.projectConfig.configs[projectId ?? ""]
  );

  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [tempName, setTempName] = useState(config?.name ?? "");
  const [tempDesc, setTempDesc] = useState(config?.description ?? "");
  const [jiraConnecting, setJiraConnecting] = useState(false);

  if (!config || !projectId) return null;

  const handleSaveName = () => {
    if (tempName.trim()) {
      dispatch(updateConfig({ projectId, patch: { name: tempName.trim() } }));
      message.success("Project name updated");
    }
    setEditingName(false);
  };

  const handleSaveDesc = () => {
    dispatch(updateConfig({ projectId, patch: { description: tempDesc } }));
    message.success("Description updated");
    setEditingDesc(false);
  };

  const handleDeleteAttachment = useCallback(
    (attId: string) => {
      dispatch(
        updateConfig({
          projectId,
          patch: { attachments: config.attachments.filter((a) => a.id !== attId) },
        })
      );
      message.success("Attachment removed");
    },
    [dispatch, projectId, config.attachments, message]
  );

  const handleUploadAttachment = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newAtts: ProjectAttachment[] = Array.from(files).map((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "txt";
        const typeMap: Record<string, ProjectAttachment["type"]> = {
          pdf: "pdf", doc: "doc", docx: "doc", xlsx: "xlsx", xls: "xlsx",
          png: "png", jpg: "png", jpeg: "png", txt: "txt", csv: "csv",
        };
        const size =
          file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(0)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        return {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          size,
          type: typeMap[ext] || "txt",
          uploadedAt: new Date().toISOString().split("T")[0],
          uploadedBy: "John Doe",
        };
      });

      dispatch(
        updateConfig({
          projectId,
          patch: { attachments: [...config.attachments, ...newAtts] },
        })
      );
      message.success(`${newAtts.length} file${newAtts.length > 1 ? "s" : ""} uploaded`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [dispatch, projectId, config.attachments, message]
  );

  const handleToggleJira = useCallback(() => {
    if (config.jiraConnected) {
      dispatch(disconnectJira(projectId));
      message.info("Jira disconnected");
    } else {
      setJiraConnecting(true);
      setTimeout(() => {
        dispatch(connectJira({ projectId, projectKey: config.jiraProjectKey || "PROJ" }));
        setJiraConnecting(false);
        message.success("Jira connected successfully");
      }, 1200);
    }
  }, [config.jiraConnected, config.jiraProjectKey, dispatch, projectId, message]);

  return (
    <div className="config flex flex-col h-full flex-1 min-h-0 overflow-y-auto">
      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.txt,.csv"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* page header */}
      <div className="config__header flex items-center gap-3 px-6 py-4 bg-white border-b border-[#f3f0fb]">
        <div className="flex flex-col gap-1 flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onPressEnter={handleSaveName}
                autoFocus
                style={{ width: 320, height: 34, fontSize: 16, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
              />
              <button
                onClick={handleSaveName}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-md bg-[#7c3aed] border-0 !text-white cursor-pointer hover:bg-[#6d28d9] transition-colors"
              >
                <CheckOutlined className="text-[11px]" />
              </button>
              <button
                onClick={() => { setEditingName(false); setTempName(config.name); }}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-md border border-[#e2dff0] bg-white !text-[#8b87a0] cursor-pointer hover:!text-[#cf1322] transition-colors"
              >
                <CloseOutlined className="text-[11px]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1
                className="!text-[#0f0a1e] text-[18px] m-0"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
              >
                {config.name}
              </h1>
              <Tooltip title="Edit name">
                <button
                  onClick={() => setEditingName(true)}
                  className="flex items-center justify-center w-[24px] h-[24px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer transition-colors"
                >
                  <EditOutlined className="text-[12px]" />
                </button>
              </Tooltip>
              <Tag
                className="!text-[10px] !px-[8px] !py-0 !m-0 !leading-[20px] !border-0"
                style={{
                  background: config.status === "active" ? "#f0fdf4" : "#f5f4f8",
                  color: config.status === "active" ? "#15803d" : "#8b87a0",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {config.status === "active" ? "Active" : "Archived"}
              </Tag>
            </div>
          )}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 !text-[#8b87a0] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <CalendarOutlined className="text-[10px]" /> Created {config.createdAt}
            </span>
            <span className="flex items-center gap-1 !text-[#8b87a0] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <UserOutlined className="text-[10px]" /> {config.createdBy}
            </span>
          </div>
        </div>
      </div>

      {/* content grid */}
      <div className="config__content px-6 py-5 flex flex-col gap-5">
        {/* mini stat cards */}
        <div className="flex gap-4">
          <MiniStat label="Scenarios" value={config.stats.totalScenarios} color="#1677ff" />
          <MiniStat label="Test Cases" value={config.stats.totalTestCases} color="#7c3aed" />
          <MiniStat label="Scripts" value={config.stats.totalScripts} color="#15803d" />
          <MiniStat label="UI Tests" value={config.stats.testsByType.ui} color="#7c3aed" />
          <MiniStat label="API Tests" value={config.stats.testsByType.api} color="#d46b08" />
        </div>

        {/* two column layout */}
        <div className="flex gap-5">
          {/* left column */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            {/* project details */}
            <Section title="Project Details" icon={<FileTextOutlined />}>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="!text-[#8b87a0] text-[10px] uppercase tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                    Description
                  </span>
                  {!editingDesc && (
                    <Tooltip title="Edit">
                      <button
                        onClick={() => setEditingDesc(true)}
                        className="flex items-center justify-center w-[20px] h-[20px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] cursor-pointer transition-colors"
                      >
                        <EditOutlined className="text-[10px]" />
                      </button>
                    </Tooltip>
                  )}
                </div>
                {editingDesc ? (
                  <div className="flex flex-col gap-2">
                    <Input.TextArea
                      value={tempDesc}
                      onChange={(e) => setTempDesc(e.target.value)}
                      rows={3}
                      autoFocus
                      style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveDesc}
                        className="flex items-center gap-1 px-3 py-[4px] rounded-md bg-[#7c3aed] border-0 !text-white text-[11px] cursor-pointer hover:bg-[#6d28d9] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                      >
                        <CheckOutlined className="text-[10px]" /> Save
                      </button>
                      <button
                        onClick={() => { setEditingDesc(false); setTempDesc(config.description); }}
                        className="flex items-center gap-1 px-3 py-[4px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:bg-[#faf5ff] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="!text-[#4c4568] text-[12px] !leading-[1.7] m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {config.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="!text-[#8b87a0] text-[10px] uppercase tracking-wide block mb-1" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                    Status
                  </span>
                  <Select
                    value={config.status}
                    onChange={(v) => {
                      dispatch(updateConfig({ projectId, patch: { status: v } }));
                      message.success("Project status updated");
                    }}
                    style={{ width: "100%", fontSize: 12 }}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Archived", value: "archived" },
                    ]}
                  />
                </div>
              </div>
            </Section>

            {/* attachments */}
            <Section
              title="Attachments"
              icon={<PaperClipOutlined />}
              extra={
                <button
                  onClick={handleUploadAttachment}
                  className="flex items-center gap-1 px-[10px] py-[4px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[11px] cursor-pointer hover:!text-[#7c3aed] hover:border-[#7c3aed] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                >
                  Upload
                </button>
              }
            >
              {config.attachments.length === 0 ? (
                <p className="!text-[#8b87a0] text-[12px] italic text-center py-4 m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  No attachments uploaded yet
                </p>
              ) : (
                <div className="flex flex-col gap-[6px]">
                  {config.attachments.map((att) => {
                    const typeStyle = FILE_TYPE_ICONS[att.type] || FILE_TYPE_ICONS.txt;
                    return (
                      <div
                        key={att.id}
                        className="flex items-center gap-3 px-3 py-[8px] rounded-lg border border-[#f3f0fb] hover:bg-[#faf5ff] transition-colors group"
                      >
                        <span
                          className="w-[30px] h-[30px] rounded-md flex items-center justify-center text-[9px] uppercase shrink-0"
                          style={{ background: typeStyle.bg, color: typeStyle.color, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {att.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="!text-[#0f0a1e] text-[12px] block truncate" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                            {att.name}
                          </span>
                          <span className="!text-[#8b87a0] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {att.size} &middot; {att.uploadedAt} &middot; {att.uploadedBy}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip title="Download">
                            <button className="flex items-center justify-center w-[24px] h-[24px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] cursor-pointer transition-colors">
                              <DownloadOutlined className="text-[11px]" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <button
                              onClick={() => handleDeleteAttachment(att.id)}
                              className="flex items-center justify-center w-[24px] h-[24px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#cf1322] cursor-pointer transition-colors"
                            >
                              <DeleteOutlined className="text-[11px]" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </div>

          {/* right column */}
          <div className="w-[380px] shrink-0 flex flex-col gap-5">
            {/* recent activity */}
            <Section title="Recent Activity" icon={<HistoryOutlined />}>
              {config.activityLog.length === 0 ? (
                <p className="!text-[#8b87a0] text-[12px] italic text-center py-4 m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  No activity yet
                </p>
              ) : (
                <div className="flex flex-col gap-0">
                  {config.activityLog.map((entry, i) => (
                    <div key={entry.id} className="flex gap-3 py-[8px] border-b border-[#f3f0fb] last:border-b-0">
                      <div className="flex flex-col items-center shrink-0 pt-[3px]">
                        <span className="w-[7px] h-[7px] rounded-full bg-[#7c3aed] shrink-0" />
                        {i < config.activityLog.length - 1 && (
                          <span className="w-[1px] flex-1 bg-[#f3f0fb] mt-[3px]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="!text-[#0f0a1e] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                            {entry.action}
                          </span>
                          <span className="!text-[#8b87a0] text-[10px]">by {entry.user}</span>
                        </div>
                        <p className="!text-[#4c4568] text-[10.5px] m-0 mt-[2px] !leading-[1.4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {entry.detail}
                        </p>
                        <span className="!text-[#b0adbe] text-[9px] flex items-center gap-1 mt-[2px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          <ClockCircleOutlined className="text-[8px]" /> {entry.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
