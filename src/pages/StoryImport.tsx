import React, { useState, useMemo, useCallback } from "react";
import { Input, Tag, Empty, Tooltip, App, Checkbox, Modal, Select } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  RightOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  CodeOutlined,
  ExperimentOutlined,
  EditOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  UnorderedListOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router";
import type { JiraEpic, JiraStory } from "../lib/mock-data";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setJiraEpics as setJiraEpicsAction, setJiraStories as setJiraStoriesAction } from "../store/projectConfigSlice";
import { deleteItems, relinkItems } from "../store/repoSlice";

/* ─── type config for linked items ───────────────────────────────────── */

const TYPE_TAG: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  scenario: { bg: "#e8f4fd", color: "#1677ff", label: "Scenario", icon: <ExperimentOutlined /> },
  testcase: { bg: "#f3eaff", color: "#7c3aed", label: "Test Case", icon: <FileTextOutlined /> },
  script: { bg: "#f0fdf4", color: "#15803d", label: "Script", icon: <CodeOutlined /> },
};

/* ─── left-panel view type ───────────────────────────────────────────── */
type LeftView = "all" | "unassigned" | string; // "all" | "unassigned" | epicId

/* ─── main component ─────────────────────────────────────────────────── */

export function StoryImport() {
  const { message, modal } = App.useApp();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const pid = projectId ?? "";
  const jiraEpics = useAppSelector((s) => s.projectConfig.jira[pid]?.epics ?? []);
  const jiraStories = useAppSelector((s) => s.projectConfig.jira[pid]?.stories ?? []);
  const projectConfig = useAppSelector((s) => s.projectConfig.configs[pid]);
  const repoItems = useAppSelector((s) => s.repo.items[pid] ?? []);

  const setJiraEpics = useCallback(
    (epicsOrUpdater: JiraEpic[] | ((prev: JiraEpic[]) => JiraEpic[])) => {
      const next = typeof epicsOrUpdater === "function" ? epicsOrUpdater(jiraEpics) : epicsOrUpdater;
      dispatch(setJiraEpicsAction({ projectId: pid, epics: next }));
    },
    [dispatch, pid, jiraEpics]
  );

  const setJiraStories = useCallback(
    (storiesOrUpdater: JiraStory[] | ((prev: JiraStory[]) => JiraStory[])) => {
      const next = typeof storiesOrUpdater === "function" ? storiesOrUpdater(jiraStories) : storiesOrUpdater;
      dispatch(setJiraStoriesAction({ projectId: pid, stories: next }));
    },
    [dispatch, pid, jiraStories]
  );


  /* ── state ──────────────────────────────────────────────────────────── */
  const [leftView, setLeftView] = useState<LeftView>("all");
  const [search, setSearch] = useState("");
  const [creatingEpic, setCreatingEpic] = useState(false);
  const [newEpicName, setNewEpicName] = useState("");
  const [selectedStory, setSelectedStory] = useState<JiraStory | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [relinkModalOpen, setRelinkModalOpen] = useState(false);
  const [relinkTargetStoryId, setRelinkTargetStoryId] = useState<string | null>(null);
  const [creatingStory, setCreatingStory] = useState(false);
  const [newStoryKey, setNewStoryKey] = useState("");
  const [newStorySummary, setNewStorySummary] = useState("");
  const [newStoryEpicId, setNewStoryEpicId] = useState<string | undefined>(undefined);

  // Bulk story selection state
  const [selectedStoryIds, setSelectedStoryIds] = useState<Set<string>>(new Set());
  const [bulkMoveEpicModalOpen, setBulkMoveEpicModalOpen] = useState(false);
  const [bulkMoveTargetEpicId, setBulkMoveTargetEpicId] = useState<string | null>(null);

  /* ── derived ────────────────────────────────────────────────────────── */
  const unassignedStories = useMemo(
    () => jiraStories.filter((s) => !s.epicId),
    [jiraStories]
  );

  const displayedStories = useMemo(() => {
    let result: JiraStory[];
    if (leftView === "all") {
      result = [...jiraStories];
    } else if (leftView === "unassigned") {
      result = unassignedStories;
    } else {
      result = jiraStories.filter((s) => s.epicId === leftView);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.summary.toLowerCase().includes(q) || s.key.toLowerCase().includes(q)
      );
    }
    return result;
  }, [leftView, jiraStories, unassignedStories, search]);

  const linkedItemsForStory = useMemo(() => {
    if (!selectedStory) return [];
    return repoItems.filter((item) => item.linkedStoryId === selectedStory.id);
  }, [selectedStory, repoItems]);

  /* ── breadcrumb label ───────────────────────────────────────────────── */
  const breadcrumbLabel = useMemo(() => {
    if (leftView === "all") return null;
    if (leftView === "unassigned") return "Unassigned";
    return jiraEpics.find((e) => e.id === leftView)?.name || "";
  }, [leftView, jiraEpics]);

  /* ── handlers ────────────────────────────────────────────────────────── */
  const handleCreateEpic = useCallback(() => {
    if (!newEpicName.trim()) return;
    const newEpic: JiraEpic = {
      id: `je-${Date.now()}`,
      key: `${projectConfig.jiraProjectKey || "PROJ"}-${Math.floor(Math.random() * 900) + 100}`,
      name: newEpicName.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setJiraEpics((prev) => [...prev, newEpic]);
    setNewEpicName("");
    setCreatingEpic(false);
    message.success("Epic created");
  }, [newEpicName, projectConfig.jiraProjectKey, message, setJiraEpics]);

  const handleCreateStory = useCallback(() => {
    if (!newStorySummary.trim()) return;
    const key =
      newStoryKey.trim() ||
      `${projectConfig.jiraProjectKey || "PROJ"}-${Math.floor(Math.random() * 900) + 100}`;
    const newStory: JiraStory = {
      id: `js-${Date.now()}`,
      key,
      summary: newStorySummary.trim(),
      epicId: newStoryEpicId || undefined,
    };
    setJiraStories((prev) => [...prev, newStory]);
    setNewStoryKey("");
    setNewStorySummary("");
    setNewStoryEpicId(undefined);
    setCreatingStory(false);
    message.success("Story created");
  }, [newStorySummary, newStoryKey, newStoryEpicId, projectConfig.jiraProjectKey, message, setJiraStories]);

  /* ── linked item actions ─────────────────────────────────────────── */
  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItemIds.size === linkedItemsForStory.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(linkedItemsForStory.map((i) => i.id)));
    }
  }, [selectedItemIds, linkedItemsForStory]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedItemIds.size === 0) return;
    modal.confirm({
      title: "Delete Items",
      content: `Are you sure you want to delete ${selectedItemIds.size} selected item(s) from the repository?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteItems({ projectId: pid, itemIds: [...selectedItemIds] }));
        setSelectedItemIds(new Set());
        message.success(`${selectedItemIds.size} item(s) deleted`);
      },
    });
  }, [selectedItemIds, modal, message, dispatch, pid]);

  const handleUnlinkSelected = useCallback(() => {
    if (selectedItemIds.size === 0) return;
    modal.confirm({
      title: "Unlink Items",
      content: `Unlink ${selectedItemIds.size} item(s) from this story? They will remain in the repository but won't be associated with this story.`,
      okText: "Unlink",
      onOk: () => {
        dispatch(relinkItems({ projectId: pid, itemIds: [...selectedItemIds], linkedStoryId: undefined }));
        setSelectedItemIds(new Set());
        message.success(`${selectedItemIds.size} item(s) unlinked`);
      },
    });
  }, [selectedItemIds, modal, message, dispatch, pid]);

  const handleEditSelected = useCallback(() => {
    if (selectedItemIds.size === 0) return;
    const selectedItems = linkedItemsForStory.filter((i) => selectedItemIds.has(i.id));
    const firstItem = selectedItems[0];
    const allScenarios = selectedItems.map((ri) => ri.scenario);
    const testType = firstItem.scenario.type;
    const hasAnyTestCases = allScenarios.some((sc) =>
      sc.type === "api" ? sc.apiSteps.length > 0 : sc.steps.length > 0
    );
    const allScripts = selectedItems.every((ri) => ri.type === "script");
    const allScenariosOnly = selectedItems.every((ri) => ri.type === "scenario");
    const mode = allScenariosOnly ? "scenario-only" : "scenario-testcase";

    navigate(`/project/${projectId}/generator`, {
      state: {
        repoItem: firstItem,
        scenarios: allScenarios,
        testType,
        showTestCases: hasAnyTestCases,
        mode,
        openScriptView: allScripts,
        scriptFramework: firstItem.scriptFramework,
        sourceStory: firstItem.sourceStory,
      },
    });
  }, [selectedItemIds, linkedItemsForStory, navigate, projectId]);

  const handleRelinkSelected = useCallback(() => {
    if (selectedItemIds.size === 0 || !relinkTargetStoryId) return;
    dispatch(relinkItems({ projectId: pid, itemIds: [...selectedItemIds], linkedStoryId: relinkTargetStoryId ?? undefined }));
    setSelectedItemIds(new Set());
    setRelinkModalOpen(false);
    setRelinkTargetStoryId(null);
    message.success(`${selectedItemIds.size} item(s) relinked`);
  }, [selectedItemIds, relinkTargetStoryId, message, dispatch, pid]);

  /* ── bulk story action handlers ────────────────────────────────────── */
  const toggleSelectStory = useCallback((id: string) => {
    setSelectedStoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllStories = useCallback(() => {
    if (selectedStoryIds.size === displayedStories.length) {
      setSelectedStoryIds(new Set());
    } else {
      setSelectedStoryIds(new Set(displayedStories.map((s) => s.id)));
    }
  }, [selectedStoryIds, displayedStories]);

  const handleBulkDeleteStories = useCallback(() => {
    if (selectedStoryIds.size === 0) return;
    modal.confirm({
      title: "Delete Stories",
      content: `Delete ${selectedStoryIds.size} selected stor${selectedStoryIds.size > 1 ? "ies" : "y"}? Linked repository items will be unlinked but not deleted.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        setJiraStories((prev) => prev.filter((s) => !selectedStoryIds.has(s.id)));
        // Unlink repo items that were linked to deleted stories
        const itemsToUnlink = repoItems
          .filter((i) => i.linkedStoryId && selectedStoryIds.has(i.linkedStoryId))
          .map((i) => i.id);
        if (itemsToUnlink.length > 0) {
          dispatch(relinkItems({ projectId: pid, itemIds: itemsToUnlink, linkedStoryId: undefined }));
        }
        message.success(`${selectedStoryIds.size} stor${selectedStoryIds.size > 1 ? "ies" : "y"} deleted`);
        setSelectedStoryIds(new Set());
      },
    });
  }, [selectedStoryIds, modal, message, setJiraStories, dispatch, pid, repoItems]);

  const handleBulkMoveToEpic = useCallback(() => {
    if (selectedStoryIds.size === 0) return;
    // bulkMoveTargetEpicId can be "__unassigned__" meaning remove epic
    const actualEpicId = bulkMoveTargetEpicId === "__unassigned__" ? undefined : (bulkMoveTargetEpicId || undefined);
    setJiraStories((prev) =>
      prev.map((s) =>
        selectedStoryIds.has(s.id)
          ? { ...s, epicId: actualEpicId }
          : s
      )
    );
    const epicName = bulkMoveTargetEpicId === "__unassigned__"
      ? "Unassigned"
      : (jiraEpics.find((e) => e.id === bulkMoveTargetEpicId)?.name || "epic");
    message.success(`${selectedStoryIds.size} stor${selectedStoryIds.size > 1 ? "ies" : "y"} moved to ${epicName}`);
    setSelectedStoryIds(new Set());
    setBulkMoveEpicModalOpen(false);
    setBulkMoveTargetEpicId(null);
  }, [selectedStoryIds, bulkMoveTargetEpicId, jiraEpics, message, setJiraStories]);

  /* ── story detail view ─────────────────────────────────────────────── */
  if (selectedStory) {
    const storyEpic = jiraEpics.find((e) => e.id === selectedStory.epicId);
    return (
      <div className="story-import flex flex-col h-full flex-1 min-h-0 bg-[#faf9ff]">
        {/* header */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#f3f0fb] bg-white">
          <button
            onClick={() => { setSelectedStory(null); setSelectedItemIds(new Set()); }}
            className="flex items-center justify-center w-[28px] h-[28px] rounded-md border border-[#e2dff0] bg-white !text-[#8b87a0] hover:!text-[#7c3aed] hover:border-[#7c3aed] cursor-pointer transition-colors"
          >
            <ArrowLeftOutlined className="text-[11px]" />
          </button>
          <div className="flex items-center gap-2">
            <Tag
              className="!text-[11px] !px-[8px] !py-0 !m-0 !leading-[22px] !border-0 font-bold"
              style={{ background: "#e8f4fd", color: "#1677ff" }}
            >
              {selectedStory.key}
            </Tag>
            <h2 className="!text-[#0f0a1e] text-[15px] m-0 font-bold">
              Story Details
            </h2>
          </div>
        </div>

        {/* story info */}
        <div className="px-6 py-4 border-b border-[#f3f0fb] bg-white">
          <p className="!text-[#0f0a1e] text-[13px] m-0 !leading-[1.6] font-medium">
            {selectedStory.summary}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {storyEpic ? (
              <span className="!text-[#8b87a0] text-[11px]">
                Epic: <span className="!text-[#d46b08] font-semibold">{storyEpic.name}</span>
              </span>
            ) : (
              <Tag
                className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[18px] !border-0 font-semibold"
                style={{ background: "#f5f4f8", color: "#8b87a0" }}
              >
                Unassigned
              </Tag>
            )}
          </div>
        </div>

        {/* linked items */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="!text-[#0f0a1e] text-[13px] font-bold">
              Linked Generated Items
            </span>
            <Tag
              className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[18px] !border-0 font-bold"
              style={{ background: "#f3eaff", color: "#7c3aed" }}
            >
              {linkedItemsForStory.length}
            </Tag>
          </div>

          {linkedItemsForStory.length === 0 ? (
            <Empty
              description={
                <span className="!text-[#8b87a0] text-[12px]">
                  No generated items linked to this story yet. Generate scenarios or test cases and link them when saving.
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className="flex flex-col gap-[6px]">
              {linkedItemsForStory.map((item) => {
                const typeConfig = TYPE_TAG[item.type] || TYPE_TAG.scenario;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border bg-white hover:bg-[#faf5ff] transition-colors cursor-pointer ${
                      selectedItemIds.has(item.id) ? "border-[#7c3aed] bg-[#faf5ff]" : "border-[#f3f0fb]"
                    }`}
                    onClick={() => toggleSelectItem(item.id)}
                  >
                    <Checkbox
                      checked={selectedItemIds.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      className="w-[28px] h-[28px] rounded-md flex items-center justify-center text-[12px] shrink-0"
                      style={{ background: typeConfig.bg, color: typeConfig.color }}
                    >
                      {typeConfig.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="!text-[#0f0a1e] text-[12px] block truncate font-medium">
                        {item.name}
                      </span>
                      <span className="!text-[#8b87a0] text-[10px]">
                        {item.savedAt} &middot; {item.savedBy}
                      </span>
                    </div>
                    <Tag
                      className="!text-[9px] !px-[5px] !py-0 !m-0 !leading-[16px] !border-0 shrink-0 font-semibold"
                      style={{ background: typeConfig.bg, color: typeConfig.color }}
                    >
                      {typeConfig.label}
                    </Tag>
                    <Tag
                      className="!text-[9px] !px-[5px] !py-0 !m-0 !leading-[16px] !border-0 shrink-0 font-semibold"
                      style={{
                        background: item.testType === "ui" ? "#f3eaff" : "#fff7e6",
                        color: item.testType === "ui" ? "#7c3aed" : "#d46b08",
                      }}
                    >
                      {item.testType.toUpperCase()}
                    </Tag>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* action bar */}
        {linkedItemsForStory.length > 0 && (
          <div className="px-6 py-3 border-t border-[#f3f0fb] bg-white">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedItemIds.size === linkedItemsForStory.length && linkedItemsForStory.length > 0}
                indeterminate={selectedItemIds.size > 0 && selectedItemIds.size < linkedItemsForStory.length}
                onChange={toggleSelectAll}
              >
                <span className="text-[11px] !text-[#4c4568] font-medium">
                  {selectedItemIds.size > 0 ? `${selectedItemIds.size} selected` : "Select All"}
                </span>
              </Checkbox>

              <div className="ml-auto flex items-center gap-[6px]">
                <Tooltip title="Edit in Generator">
                  <button
                    onClick={handleEditSelected}
                    disabled={selectedItemIds.size === 0}
                    className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#7c3aed] hover:border-[#7c3aed] cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <EditOutlined className="text-[11px]" />
                    Edit
                  </button>
                </Tooltip>
                <Tooltip title="Delete from repository">
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedItemIds.size === 0}
                    className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#d4183d] hover:border-[#d4183d] cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <DeleteOutlined className="text-[11px]" />
                    Delete
                  </button>
                </Tooltip>
                <Tooltip title="Unlink from this story">
                  <button
                    onClick={handleUnlinkSelected}
                    disabled={selectedItemIds.size === 0}
                    className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#d46b08] hover:border-[#d46b08] cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <DisconnectOutlined className="text-[11px]" />
                    Unlink
                  </button>
                </Tooltip>
                <Tooltip title="Move to another story">
                  <button
                    onClick={() => setRelinkModalOpen(true)}
                    disabled={selectedItemIds.size === 0}
                    className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#7c3aed] hover:border-[#7c3aed] cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <RightOutlined className="text-[9px]" />
                    Relink
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* relink modal */}
        <Modal
          title="Relink Items to Another Story"
          open={relinkModalOpen}
          onCancel={() => setRelinkModalOpen(false)}
          onOk={handleRelinkSelected}
          okText="Relink"
          okButtonProps={{ disabled: !relinkTargetStoryId }}
        >
          <p className="!text-[#4c4568] text-[12px] mb-3">
            Move {selectedItemIds.size} item(s) to:
          </p>
          <Select
            value={relinkTargetStoryId}
            onChange={(value) => setRelinkTargetStoryId(value)}
            placeholder="Select a story"
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="label"
          >
            {jiraEpics.map((epic) => {
              const epicStories = jiraStories.filter((s) => s.epicId === epic.id && s.id !== selectedStory?.id);
              if (epicStories.length === 0) return null;
              return (
                <Select.OptGroup key={epic.id} label={epic.name}>
                  {epicStories.map((s) => (
                    <Select.Option key={s.id} value={s.id} label={`${s.key} ${s.summary}`}>
                      <span className="flex items-center gap-1 text-[12px]">
                        <Tag className="!text-[9px] !px-[4px] !py-0 !m-0 !leading-[16px] !border-0 font-bold" style={{ background: "#e8f4fd", color: "#1677ff" }}>
                          {s.key}
                        </Tag>
                        <span className="truncate">{s.summary}</span>
                      </span>
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              );
            })}
            {unassignedStories.filter((s) => s.id !== selectedStory?.id).length > 0 && (
              <Select.OptGroup label="Unassigned">
                {unassignedStories
                  .filter((s) => s.id !== selectedStory?.id)
                  .map((s) => (
                    <Select.Option key={s.id} value={s.id} label={`${s.key} ${s.summary}`}>
                      <span className="flex items-center gap-1 text-[12px]">
                        <Tag className="!text-[9px] !px-[4px] !py-0 !m-0 !leading-[16px] !border-0 font-bold" style={{ background: "#e8f4fd", color: "#1677ff" }}>
                          {s.key}
                        </Tag>
                        <span className="truncate">{s.summary}</span>
                      </span>
                    </Select.Option>
                  ))}
              </Select.OptGroup>
            )}
          </Select>
        </Modal>
      </div>
    );
  }

  /* ── main layout: left panel + right table ──────────────────────────── */
  return (
    <div className="story-import flex h-full flex-1 min-h-0">
      {/* ── Left Panel ──────────────────────────────────────────────── */}
      <div className="story-import__left-panel w-[280px] shrink-0 border-r border-[#f3f0fb] bg-white flex flex-col">
        {/* top nav entries */}
        <div className="px-2 pt-3">
          {/* All Stories */}
          <div
            onClick={() => setLeftView("all")}
            className={`flex items-center gap-2 px-2 py-[7px] rounded-md cursor-pointer transition-colors text-[12.5px] ${
              leftView === "all" ? "!bg-[#f3eaff] !text-[#7c3aed]" : "!text-[#4c4568] hover:bg-[#faf5ff]"
            } ${leftView === "all" ? "font-semibold" : "font-medium"}`}
          >
            <UnorderedListOutlined className="text-[13px]" />
            All Stories
            <span
              className={`ml-auto text-[10px] min-w-[18px] text-center rounded-full px-[5px] py-[1px] font-semibold ${
                leftView === "all" ? "bg-[#7c3aed]/10 !text-[#7c3aed]" : "bg-[#f3f0fb] !text-[#8b87a0]"
              }`}
            >
              {jiraStories.length}
            </span>
          </div>

          {/* Unassigned */}
          <div
            onClick={() => setLeftView("unassigned")}
            className={`flex items-center gap-2 px-2 py-[7px] rounded-md cursor-pointer transition-colors text-[12.5px] ${
              leftView === "unassigned" ? "!bg-[#f5f4f8] !text-[#4c4568]" : "!text-[#8b87a0] hover:bg-[#faf5ff]"
            } ${leftView === "unassigned" ? "font-semibold" : "font-medium"}`}
          >
            <InboxOutlined className="text-[13px]" />
            Unassigned
            <span
              className={`ml-auto text-[10px] min-w-[18px] text-center rounded-full px-[5px] py-[1px] font-semibold ${
                leftView === "unassigned" ? "bg-[#4c4568]/10 !text-[#4c4568]" : "bg-[#f3f0fb] !text-[#8b87a0]"
              }`}
            >
              {unassignedStories.length}
            </span>
          </div>
        </div>

        {/* epics header */}
        <div className="flex items-center justify-between px-4 py-2 mt-2 border-t border-b border-[#f3f0fb]">
          <span className="!text-[#8b87a0] text-[10px] uppercase tracking-wide font-semibold">
            Epics ({jiraEpics.length})
          </span>
          <Tooltip title="Create Epic">
            <button
              onClick={() => { setCreatingEpic(true); setNewEpicName(""); }}
              className="flex items-center justify-center w-[22px] h-[22px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer transition-colors"
            >
              <PlusOutlined className="text-[10px]" />
            </button>
          </Tooltip>
        </div>

        {/* new epic input */}
        {creatingEpic && (
          <div className="flex items-center gap-[6px] px-3 py-2 border-b border-[#f3f0fb]">
            <FolderOutlined className="!text-[#d46b08] text-[12px] shrink-0" />
            <Input
              size="small"
              placeholder="Epic name..."
              value={newEpicName}
              onChange={(e) => setNewEpicName(e.target.value)}
              onPressEnter={handleCreateEpic}
              onBlur={() => {
                if (!newEpicName.trim()) setCreatingEpic(false);
                else handleCreateEpic();
              }}
              autoFocus
              style={{ fontSize: 12, height: 26, flex: 1 }}
            />
          </div>
        )}

        {/* epic list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {jiraEpics.map((epic) => {
            const isSelected = leftView === epic.id;
            const storyCount = jiraStories.filter((s) => s.epicId === epic.id).length;

            return (
              <div key={epic.id} className="mb-[2px]">
                <div
                  onClick={() => setLeftView(isSelected ? "all" : epic.id)}
                  className={`flex items-center gap-2 px-2 py-[7px] rounded-md cursor-pointer transition-colors text-[12px] ${
                    isSelected ? "!bg-[#fff7e6]" : "hover:bg-[#faf5ff]"
                  } ${isSelected ? "font-semibold" : "font-medium"}`}
                >
                  <span className={`text-[13px] ${isSelected ? "!text-[#d46b08]" : "!text-[#b0adbe]"}`}>
                    {isSelected ? <FolderOpenOutlined /> : <FolderOutlined />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <span className={`truncate block text-[12px] ${isSelected ? "!text-[#d46b08]" : "!text-[#4c4568]"}`}>
                      {epic.name}
                    </span>
                    <span className="!text-[#b0adbe] text-[9px] block">{epic.key}</span>
                  </div>

                  <span
                    className={`text-[10px] min-w-[18px] text-center rounded-full px-[5px] py-[1px] shrink-0 font-semibold ${
                      isSelected ? "bg-[#d46b08]/10 !text-[#d46b08]" : "bg-[#f3f0fb] !text-[#8b87a0]"
                    }`}
                  >
                    {storyCount}
                  </span>
                </div>
              </div>
            );
          })}

          {jiraEpics.length === 0 && !creatingEpic && (
            <div className="flex flex-col items-center gap-2 py-6">
              <FolderOutlined className="!text-[#d9d5e8] text-[20px]" />
              <p className="!text-[#8b87a0] text-[11px] text-center m-0">
                No epics yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Stories Table Panel ─────────────────────────────────── */}
      <div className="story-import__stories-panel flex-1 min-w-0 bg-[#faf9ff] flex flex-col">
        {/* toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#f3f0fb] bg-white">
          <div className="flex items-center gap-1 min-w-0">
            <span
              className="!text-[#8b87a0] text-[12px] shrink-0 cursor-pointer hover:!text-[#7c3aed] transition-colors font-medium"
              onClick={() => setLeftView("all")}
            >
              Stories
            </span>
            {breadcrumbLabel && (
              <>
                <RightOutlined className="!text-[#d9d5e8] text-[8px] shrink-0" />
                <span
                  className={`text-[12px] shrink-0 font-semibold ${leftView === "unassigned" ? "!text-[#4c4568]" : "!text-[#d46b08]"}`}
                >
                  {breadcrumbLabel}
                </span>
              </>
            )}
          </div>

          <div className="flex-1" />

          <Tooltip title="Create Story">
            <button
              onClick={() => {
                setCreatingStory(true);
                setNewStoryKey("");
                setNewStorySummary("");
                setNewStoryEpicId(leftView !== "all" && leftView !== "unassigned" ? leftView : undefined);
              }}
              className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#7c3aed] bg-[#7c3aed] text-white text-[11px] cursor-pointer hover:bg-[#6d28d9] transition-colors font-semibold"
            >
              <PlusOutlined className="text-[10px]" />
              New Story
            </button>
          </Tooltip>

          <Input
            prefix={<SearchOutlined className="!text-[#b0adbe]" />}
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 220, height: 34, fontSize: 12 }}
          />
        </div>

        {/* summary bar */}
        <div className="flex items-center gap-4 px-6 py-2 bg-[#faf9ff] border-b border-[#f3f0fb]">
          <span className="!text-[#8b87a0] text-[11.5px]">
            Showing{" "}
            <span className="!text-[#0f0a1e] font-semibold">
              {displayedStories.length}
            </span>{" "}
            stor{displayedStories.length !== 1 ? "ies" : "y"}
          </span>

          {/* bulk story actions */}
          {selectedStoryIds.size > 0 && (
            <div className="flex items-center gap-[6px] ml-auto">
              <span className="!text-[#7c3aed] text-[11px] mr-1 font-semibold">
                {selectedStoryIds.size} selected
              </span>
              <Tooltip title="Move to Epic">
                <button
                  onClick={() => {
                    setBulkMoveEpicModalOpen(true);
                    setBulkMoveTargetEpicId(null);
                  }}
                  className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#7c3aed] hover:border-[#7c3aed] cursor-pointer transition-colors font-medium"
                >
                  <FolderOutlined className="text-[11px]" />
                  Move to Epic
                </button>
              </Tooltip>
              <Tooltip title="Delete selected stories">
                <button
                  onClick={handleBulkDeleteStories}
                  className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#d4183d] hover:border-[#d4183d] cursor-pointer transition-colors font-medium"
                >
                  <DeleteOutlined className="text-[11px]" />
                  Delete
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {displayedStories.length === 0 ? (
            <Empty
              description={
                <span className="!text-[#8b87a0] text-[13px]">
                  {search ? "No stories match your search" : "No stories yet — create one to get started."}
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-2 py-[10px] bg-white border-b border-[#f3f0fb]" style={{ width: 40 }}>
                    <Checkbox
                      checked={selectedStoryIds.size === displayedStories.length && displayedStories.length > 0}
                      indeterminate={selectedStoryIds.size > 0 && selectedStoryIds.size < displayedStories.length}
                      onChange={toggleSelectAllStories}
                    />
                  </th>
                  {["Key", "Summary", ...(leftView === "all" ? ["Epic"] : []), "Linked Items"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-[10px] !text-[#8b87a0] bg-white border-b border-[#f3f0fb] whitespace-nowrap font-semibold"
                      style={{ fontSize: 11 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedStories.map((story) => {
                  const linkedCount = repoItems.filter((item) => item.linkedStoryId === story.id).length;
                  const epic = jiraEpics.find((e) => e.id === story.epicId);
                  return (
                    <tr
                      key={story.id}
                      className={`hover:bg-[#faf5ff] transition-colors cursor-pointer ${selectedStoryIds.has(story.id) ? "bg-[#faf5ff]" : ""}`}
                      onClick={() => setSelectedStory(story)}
                    >
                      <td className="px-2 py-[10px] border-b border-[#f3f0fb]" style={{ width: 40 }}>
                        <Checkbox
                          checked={selectedStoryIds.has(story.id)}
                          onChange={() => toggleSelectStory(story.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-[10px] border-b border-[#f3f0fb]" style={{ width: 110 }}>
                        <Tag
                          className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[18px] !border-0 font-bold"
                          style={{ background: "#e8f4fd", color: "#1677ff" }}
                        >
                          {story.key}
                        </Tag>
                      </td>
                      <td className="px-4 py-[10px] border-b border-[#f3f0fb] !text-[#0f0a1e]">
                        <span className="block font-medium">{story.summary}</span>
                      </td>
                      {leftView === "all" && (
                        <td className="px-4 py-[10px] border-b border-[#f3f0fb]" style={{ width: 160 }}>
                          {epic ? (
                            <Tag
                              className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[18px] !border-0 font-semibold"
                              style={{ background: "#fff7e6", color: "#d46b08" }}
                            >
                              {epic.name}
                            </Tag>
                          ) : (
                            <span className="!text-[#b0adbe] text-[10px] italic">Unassigned</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-[10px] border-b border-[#f3f0fb]" style={{ width: 110 }}>
                        {linkedCount > 0 ? (
                          <Tag
                            className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[18px] !border-0 font-bold"
                            style={{ background: "#f0fdf4", color: "#15803d" }}
                          >
                            {linkedCount} linked
                          </Tag>
                        ) : (
                          <span className="!text-[#b0adbe] text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Create Story Modal ────────────────────────────────────────── */}
      <Modal
        title="Create Story"
        open={creatingStory}
        onCancel={() => setCreatingStory(false)}
        onOk={handleCreateStory}
        okText="Create"
        okButtonProps={{ disabled: !newStorySummary.trim() }}
      >
        <div className="flex flex-col gap-3 mt-2">
          <div>
            <label className="block text-[11px] !text-[#8b87a0] mb-1 font-semibold">
              Key (optional)
            </label>
            <Input
              placeholder={`${projectConfig.jiraProjectKey || "PROJ"}-XXX`}
              value={newStoryKey}
              onChange={(e) => setNewStoryKey(e.target.value)}
              style={{ fontSize: 12 }}
            />
          </div>
          <div>
            <label className="block text-[11px] !text-[#8b87a0] mb-1 font-semibold">
              Summary *
            </label>
            <Input.TextArea
              placeholder="As a user, I want to..."
              value={newStorySummary}
              onChange={(e) => setNewStorySummary(e.target.value)}
              rows={3}
              style={{ fontSize: 12 }}
            />
          </div>
          <div>
            <label className="block text-[11px] !text-[#8b87a0] mb-1 font-semibold">
              Epic (optional)
            </label>
            <Select
              value={newStoryEpicId}
              onChange={(val) => setNewStoryEpicId(val)}
              allowClear
              placeholder="No epic — unassigned"
              style={{ width: "100%" }}
            >
              {jiraEpics.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                  <span className="flex items-center gap-1">
                    <FolderOutlined className="!text-[#d46b08] text-[11px]" />
                    {e.name}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>

      {/* ── Move to Epic Modal ────────────────────────────────────────── */}
      <Modal
        title="Move to Epic"
        open={bulkMoveEpicModalOpen}
        onCancel={() => { setBulkMoveEpicModalOpen(false); setBulkMoveTargetEpicId(null); }}
        onOk={handleBulkMoveToEpic}
        okText="Move"
        okButtonProps={{ disabled: bulkMoveTargetEpicId === null }}
      >
        <p className="!text-[#4c4568] text-[12px] mb-3">
          Move <span className="font-semibold">{selectedStoryIds.size} stor{selectedStoryIds.size > 1 ? "ies" : "y"}</span> to:
        </p>
        <div className="flex flex-col gap-[4px]">
          {/* Unassigned option */}
          <div
            onClick={() => setBulkMoveTargetEpicId("__unassigned__")}
            className={`flex items-center gap-2 px-3 py-[8px] rounded-md cursor-pointer transition-colors text-[12px] border font-medium ${
              bulkMoveTargetEpicId === "__unassigned__"
                ? "border-[#7c3aed] bg-[#faf5ff]"
                : "border-[#f3f0fb] hover:bg-[#faf5ff]"
            }`}
          >
            <InboxOutlined className={`text-[12px] ${bulkMoveTargetEpicId === "__unassigned__" ? "!text-[#7c3aed]" : "!text-[#8b87a0]"}`} />
            <span className={bulkMoveTargetEpicId === "__unassigned__" ? "!text-[#7c3aed]" : "!text-[#4c4568]"}>Unassigned</span>
          </div>
          {/* Epic options */}
          {jiraEpics.map((epic) => (
            <div
              key={epic.id}
              onClick={() => setBulkMoveTargetEpicId(epic.id)}
              className={`flex items-center gap-2 px-3 py-[8px] rounded-md cursor-pointer transition-colors text-[12px] border font-medium ${
                bulkMoveTargetEpicId === epic.id
                  ? "border-[#7c3aed] bg-[#faf5ff]"
                  : "border-[#f3f0fb] hover:bg-[#faf5ff]"
              }`}
            >
              <FolderOutlined className={`text-[12px] ${bulkMoveTargetEpicId === epic.id ? "!text-[#7c3aed]" : "!text-[#b0adbe]"}`} />
              <div className="flex-1 min-w-0">
                <span className={`block truncate ${bulkMoveTargetEpicId === epic.id ? "!text-[#7c3aed]" : "!text-[#4c4568]"}`}>
                  {epic.name}
                </span>
                <span className="!text-[#b0adbe] text-[9px]">{epic.key}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
