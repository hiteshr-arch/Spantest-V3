import { useState, useMemo, useCallback } from "react";
import { Tag, Table, Empty, Tooltip, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FolderAddOutlined,
  FolderOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Checkbox } from "antd";
import { useNavigate, useParams } from "react-router";
import { FolderTree } from "../components/ui/FolderTree";
import { StoryDetailView } from "../components/ui/StoryDetailView";
import type { RepoFolder, RepoItem } from "../lib/mock-data";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addFolder,
  renameFolder,
  deleteFolderTree,
  deleteItem,
  deleteItems,
  moveItems,
} from "../../store/repoSlice";
import { ScenarioPreview } from "../features/repository/ScenarioPreview";
import { RepositoryToolbar } from "../features/repository/RepositoryToolbar";
import { BulkMoveModal } from "../features/repository/MoveToFolderModal";

/* ─── helpers ──────────────────────────────────────────────────────────── */

function getPath(folderId: string, folders: RepoFolder[]): string {
  const parts: string[] = [];
  let current = folders.find((f) => f.id === folderId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? folders.find((f) => f.id === current!.parentId) : undefined;
  }
  return parts.join(" / ");
}

function getAncestorIds(folderId: string, folders: RepoFolder[]): string[] {
  const ids: string[] = [];
  let current = folders.find((f) => f.id === folderId);
  while (current) {
    ids.push(current.id);
    current = current.parentId ? folders.find((f) => f.id === current!.parentId) : undefined;
  }
  return ids;
}

function getAllChildFolderIds(folderId: string, folders: RepoFolder[]): string[] {
  const ids: string[] = [folderId];
  folders
    .filter((f) => f.parentId === folderId)
    .forEach((c) => ids.push(...getAllChildFolderIds(c.id, folders)));
  return ids;
}

/* ─── color maps ──────────────────────────────────────────────────────── */

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

const TYPE_TAG_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  scenario: { bg: "#e8f4fd", color: "#1677ff", label: "Scenario" },
  testcase: { bg: "#f3eaff", color: "#7c3aed", label: "Test Case" },
  script: { bg: "#f0fdf4", color: "#15803d", label: "Script" },
};

/* ─── main component ─────────────────────────────────────────────────── */

export function Repository() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();

  const folders = useAppSelector((s) => s.repo.folders[projectId ?? ""] ?? []);
  const items = useAppSelector((s) => s.repo.items[projectId ?? ""] ?? []);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterTestType, setFilterTestType] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [storyDetailItem, setStoryDetailItem] = useState<RepoItem | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [bulkMoveModalOpen, setBulkMoveModalOpen] = useState(false);

  /* ── computed ─────────────────────────────────────────────────────── */

  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((i) => { counts[i.folderId] = (counts[i.folderId] || 0) + 1; });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedFolderId) {
      const folderIds = getAllChildFolderIds(selectedFolderId, folders);
      result = result.filter((i) => folderIds.includes(i.folderId));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterType) result = result.filter((i) => i.type === filterType);
    if (filterTestType) result = result.filter((i) => i.testType === filterTestType);
    if (filterPriority) result = result.filter((i) => i.priority === filterPriority);
    if (filterCategory) result = result.filter((i) => i.category === filterCategory);
    return result;
  }, [items, selectedFolderId, folders, search, filterType, filterTestType, filterPriority, filterCategory]);

  const breadcrumb = useMemo(() => {
    if (!selectedFolderId) return [];
    return getAncestorIds(selectedFolderId, folders)
      .reverse()
      .map((id) => {
        const f = folders.find((fo) => fo.id === id)!;
        return { id: f.id, name: f.name };
      });
  }, [selectedFolderId, folders]);

  const storyDetailSiblings = useMemo(() => {
    if (!storyDetailItem?.sourceStory) return [];
    return items.filter((i) => i.sourceStory === storyDetailItem.sourceStory);
  }, [storyDetailItem, items]);

  /* ── folder actions ───────────────────────────────────────────────── */

  const handleCreateFolder = useCallback(
    (parentId: string | null) => {
      if (!projectId) return;
      const newFolder: RepoFolder = {
        id: `rf-${Date.now()}`,
        name: "New Folder",
        parentId,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      dispatch(addFolder({ projectId, folder: newFolder }));
      message.success("Folder created — right-click to rename");
    },
    [dispatch, projectId, message]
  );

  const handleRenameFolder = useCallback(
    (folderId: string, newName: string) => {
      if (!projectId) return;
      dispatch(renameFolder({ projectId, folderId, name: newName }));
    },
    [dispatch, projectId]
  );

  const handleDeleteFolder = useCallback(
    (folderId: string) => {
      if (!projectId) return;
      const idsToDelete = getAllChildFolderIds(folderId, folders);
      modal.confirm({
        title: "Delete Folder",
        content: `This will delete the folder and ${idsToDelete.length - 1} subfolder(s) with all items inside. Continue?`,
        okText: "Delete",
        okButtonProps: { danger: true },
        onOk: () => {
          dispatch(deleteFolderTree({ projectId, folderIds: idsToDelete }));
          if (selectedFolderId && idsToDelete.includes(selectedFolderId)) {
            setSelectedFolderId(null);
          }
          message.success("Folder deleted");
        },
      });
    },
    [dispatch, projectId, folders, selectedFolderId, message, modal]
  );

  /* ── item actions ─────────────────────────────────────────────────── */

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (!projectId) return;
      dispatch(deleteItem({ projectId, itemId }));
      message.success("Item deleted");
    },
    [dispatch, projectId, message]
  );

  /* ── navigation ───────────────────────────────────────────────────── */

  const navigateToGenerator = useCallback(
    (repoItems: RepoItem[]) => {
      const allScenarios = repoItems.map((ri) => ri.scenario);
      const firstItem = repoItems[0];
      const testType = firstItem.scenario.type;
      const hasAnyTestCases = allScenarios.some((sc) =>
        sc.type === "api" ? sc.apiSteps.length > 0 : sc.steps.length > 0
      );
      const allScripts = repoItems.every((ri) => ri.type === "script");
      const allScenariosOnly = repoItems.every((ri) => ri.type === "scenario");
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
    },
    [navigate, projectId]
  );

  const handleEditInGenerator = useCallback(
    (record: RepoItem) => {
      if (record.sourceStory) {
        setStoryDetailItem(record);
        return;
      }
      navigateToGenerator([record]);
    },
    [navigateToGenerator]
  );

  /* ── selection ────────────────────────────────────────────────────── */

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedRowIds(
      selectedRowIds.size === filteredItems.length
        ? new Set()
        : new Set(filteredItems.map((i) => i.id))
    );
  }, [selectedRowIds, filteredItems]);

  const handleBulkDelete = useCallback(() => {
    if (!projectId || selectedRowIds.size === 0) return;
    modal.confirm({
      title: "Delete Items",
      content: `Delete ${selectedRowIds.size} selected item(s)?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteItems({ projectId, itemIds: [...selectedRowIds] }));
        message.success(`${selectedRowIds.size} item(s) deleted`);
        setSelectedRowIds(new Set());
      },
    });
  }, [dispatch, projectId, selectedRowIds, modal, message]);

  const handleBulkMove = useCallback(
    (targetFolderId: string) => {
      if (!projectId) return;
      dispatch(moveItems({ projectId, itemIds: [...selectedRowIds], targetFolderId }));
      const folderName = folders.find((f) => f.id === targetFolderId)?.name ?? "folder";
      message.success(`${selectedRowIds.size} item(s) moved to ${folderName}`);
      setSelectedRowIds(new Set());
      setBulkMoveModalOpen(false);
    },
    [dispatch, projectId, selectedRowIds, folders, message]
  );

  /* ── table columns ────────────────────────────────────────────────── */

  const columns: ColumnsType<RepoItem> = [
    {
      title: (
        <Checkbox
          checked={selectedRowIds.size === filteredItems.length && filteredItems.length > 0}
          indeterminate={selectedRowIds.size > 0 && selectedRowIds.size < filteredItems.length}
          onChange={toggleSelectAll}
        />
      ),
      key: "checkbox",
      width: 40,
      render: (_: unknown, record: RepoItem) => (
        <Checkbox
          checked={selectedRowIds.has(record.id)}
          onChange={(e) => { e.stopPropagation(); toggleSelectRow(record.id); }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (name: string) => (
        <span className="!text-[#0f0a1e] text-[12.5px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
          {name}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 110,
      render: (type: string) => {
        const style = TYPE_TAG_STYLES[type] ?? TYPE_TAG_STYLES.scenario;
        return (
          <Tag
            className="!text-[10px] !px-[8px] !py-0 !m-0 !leading-[20px] !border-0"
            style={{ background: style.bg, color: style.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            {style.label}
          </Tag>
        );
      },
    },
    {
      title: "Test Type",
      dataIndex: "testType",
      key: "testType",
      width: 80,
      render: (tt: string) => (
        <span
          className="text-[11px] uppercase tracking-[0.5px]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: tt === "api" ? "#d46b08" : "#7c3aed" }}
        >
          {tt}
        </span>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 90,
      render: (p: string) => {
        const c = PRIORITY_COLORS[p];
        return (
          <Tag
            className="!text-[10px] !px-[8px] !py-0 !m-0 !leading-[20px]"
            style={{ background: c.bg, color: c.text, borderColor: c.border, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            {p}
          </Tag>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: (cat: string) => {
        const c = CATEGORY_COLORS[cat];
        return (
          <Tag
            className="!text-[10px] !px-[8px] !py-0 !m-0 !leading-[20px]"
            style={{ background: c.bg, color: c.text, borderColor: c.border, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            {cat}
          </Tag>
        );
      },
    },
    {
      title: "Steps",
      dataIndex: "stepsCount",
      key: "stepsCount",
      width: 70,
      align: "center" as const,
      render: (count: number) => (
        <span className="!text-[#4c4568] text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{count}</span>
      ),
    },
    {
      title: "Folder",
      dataIndex: "folderId",
      key: "folder",
      width: 160,
      ellipsis: true,
      render: (folderId: string) => (
        <Tooltip title={getPath(folderId, folders)}>
          <span className="!text-[#8b87a0] text-[11px] flex items-center gap-1">
            <FolderOutlined className="text-[11px]" />
            {folders.find((f) => f.id === folderId)?.name ?? "—"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Saved",
      dataIndex: "savedAt",
      key: "savedAt",
      width: 100,
      render: (date: string) => (
        <span className="!text-[#8b87a0] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{date}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 110,
      render: (_: unknown, record: RepoItem) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Edit in Generator">
            <button
              onClick={() => handleEditInGenerator(record)}
              className="flex items-center justify-center w-[26px] h-[26px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer transition-colors text-[13px]"
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Preview">
            <button
              onClick={() =>
                setExpandedRowKeys((prev) =>
                  prev.includes(record.id) ? prev.filter((k) => k !== record.id) : [...prev, record.id]
                )
              }
              className="flex items-center justify-center w-[26px] h-[26px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer transition-colors text-[13px]"
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDeleteItem(record.id)}
              className="flex items-center justify-center w-[26px] h-[26px] rounded bg-transparent border-0 !text-[#8b87a0] hover:!text-[#d4183d] hover:bg-[#fff1f0] cursor-pointer transition-colors text-[13px]"
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  /* ── render ───────────────────────────────────────────────────────── */

  return (
    <div className="repository flex h-full flex-1 min-h-0">
      {/* Folder Tree Panel */}
      <div className="repository__tree-panel w-[240px] shrink-0 border-r border-[#f3f0fb] bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f3f0fb]">
          <span
            className="!text-[#0f0a1e] text-[13px]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
          >
            Folders
          </span>
          <Tooltip title="New Root Folder">
            <button
              onClick={() => handleCreateFolder(null)}
              className="flex items-center justify-center w-[24px] h-[24px] rounded bg-transparent border-0 !text-[#7c3aed] hover:bg-[#f3eaff] cursor-pointer transition-colors text-[13px]"
            >
              <FolderAddOutlined />
            </button>
          </Tooltip>
        </div>

        {/* All Items entry */}
        <div className="px-2 pt-2">
          <div
            onClick={() => setSelectedFolderId(null)}
            className={`flex items-center gap-2 px-2 py-[6px] rounded-md cursor-pointer transition-colors text-[12.5px] ${
              selectedFolderId === null
                ? "!bg-[#f3eaff] !text-[#7c3aed]"
                : "!text-[#4c4568] hover:bg-[#faf5ff]"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: selectedFolderId === null ? 600 : 500 }}
          >
            <FolderOutlined className="text-[13px]" />
            All Items
            <span
              className={`ml-auto text-[10px] min-w-[18px] text-center rounded-full px-[5px] py-[1px] ${
                selectedFolderId === null ? "bg-[#7c3aed]/10 !text-[#7c3aed]" : "bg-[#f3f0fb] !text-[#8b87a0]"
              }`}
              style={{ fontWeight: 600 }}
            >
              {items.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <FolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            itemCounts={itemCounts}
          />
        </div>
      </div>

      {/* Table View Panel */}
      <div className="repository__table-panel flex-1 min-w-0 bg-[#faf9ff] flex flex-col">
        {storyDetailItem ? (
          <StoryDetailView
            sourceStory={storyDetailItem.sourceStory ?? ""}
            items={storyDetailSiblings}
            clickedItem={storyDetailItem}
            onBack={() => setStoryDetailItem(null)}
            onEditInGenerator={(siblingItems) => navigateToGenerator(siblingItems)}
          />
        ) : (
          <>
            <RepositoryToolbar
              folders={folders}
              selectedFolderId={selectedFolderId}
              breadcrumb={breadcrumb}
              search={search}
              filterType={filterType}
              filterTestType={filterTestType}
              filterPriority={filterPriority}
              filterCategory={filterCategory}
              selectedRowIds={selectedRowIds}
              filteredCount={filteredItems.length}
              onSelectFolder={setSelectedFolderId}
              onSearchChange={setSearch}
              onFilterTypeChange={setFilterType}
              onFilterTestTypeChange={setFilterTestType}
              onFilterPriorityChange={setFilterPriority}
              onFilterCategoryChange={setFilterCategory}
              onClearFilters={() => {
                setFilterType(null);
                setFilterTestType(null);
                setFilterPriority(null);
                setFilterCategory(null);
              }}
              onBulkMove={() => setBulkMoveModalOpen(true)}
              onBulkDelete={handleBulkDelete}
            />

            <div className="flex-1 overflow-auto px-6 pb-4">
              <Table
                dataSource={filteredItems}
                columns={columns}
                rowKey="id"
                size="small"
                pagination={false}
                expandable={{
                  expandedRowKeys,
                  onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
                  expandedRowRender: (record) => (
                    <div className="py-2 px-4 bg-[#faf9ff] rounded-lg border border-[#f3f0fb]">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="!text-[#0f0a1e] text-[12px]"
                          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600 }}
                        >
                          {record.type === "script" ? "Script Source Preview" : "Test Steps Preview"}
                        </span>
                        <span className="!text-[#8b87a0] text-[10px]">•</span>
                        <span className="!text-[#8b87a0] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Saved by {record.savedBy}
                        </span>
                        {record.type === "script" && record.scriptFramework && (
                          <>
                            <span className="!text-[#8b87a0] text-[10px]">•</span>
                            <Tag
                              className="!text-[9px] !px-[5px] !py-0 !m-0 !leading-[16px]"
                              color="blue"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                            >
                              Python
                            </Tag>
                          </>
                        )}
                      </div>
                      <ScenarioPreview scenario={record.scenario} />
                    </div>
                  ),
                  expandIcon: () => null,
                  expandRowByClick: false,
                }}
                locale={{
                  emptyText: (
                    <Empty
                      description={
                        <span className="!text-[#8b87a0] text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {search || [filterType, filterTestType, filterPriority, filterCategory].some(Boolean)
                            ? "No items match your filters"
                            : selectedFolderId
                            ? "This folder is empty"
                            : "No items saved yet — generate scenarios and save them here"}
                        </span>
                      }
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
                className="repository__table"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          </>
        )}

        <BulkMoveModal
          open={bulkMoveModalOpen}
          selectedCount={selectedRowIds.size}
          folders={folders}
          itemCounts={itemCounts}
          onClose={() => setBulkMoveModalOpen(false)}
          onMove={handleBulkMove}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      </div>
    </div>
  );
}
