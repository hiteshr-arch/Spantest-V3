import React, { useState } from "react";
import { Modal, Input, Select, App } from "antd";
import {
  FolderAddOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  RightOutlined,
  DownOutlined,
  PlusOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { RepoFolder, JiraStory, JiraEpic } from "../../lib/mock-data";

/* ─── tree helpers ───────────────────────────────────────────────────── */

interface TreeNode {
  folder: RepoFolder;
  children: TreeNode[];
}

function buildTree(folders: RepoFolder[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  folders.forEach((f) => map.set(f.id, { folder: f, children: [] }));
  const roots: TreeNode[] = [];
  folders.forEach((f) => {
    if (f.parentId && map.has(f.parentId)) {
      map.get(f.parentId)!.children.push(map.get(f.id)!);
    } else {
      roots.push(map.get(f.id)!);
    }
  });
  return roots;
}

/* ─── props ──────────────────────────────────────────────────────────── */

interface SaveToRepoModalProps {
  open: boolean;
  onClose: () => void;
  folders: RepoFolder[];
  onSave: (folderId: string, linkedStoryId?: string) => void;
  onCreateFolder: (parentId: string | null, name: string) => void;
  savingCount: number;
  jiraStories?: JiraStory[];
  jiraEpics?: JiraEpic[];
}

/* ─── component ──────────────────────────────────────────────────────── */

export function SaveToRepoModal({
  open,
  onClose,
  folders,
  onSave,
  onCreateFolder,
  savingCount,
  jiraStories = [],
  jiraEpics = [],
}: SaveToRepoModalProps) {
  const { message } = App.useApp();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    folders.filter((f) => f.parentId === null).forEach((f) => set.add(f.id));
    return set;
  });
  const [creatingIn, setCreatingIn] = useState<string | null | undefined>(undefined); // undefined = not creating
  const [newFolderName, setNewFolderName] = useState("");
  const [linkedStoryId, setLinkedStoryId] = useState<string | undefined>(undefined);

  const tree = buildTree(folders);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(creatingIn ?? null, newFolderName.trim());
      setNewFolderName("");
      setCreatingIn(undefined);
    }
  };

  const handleSave = () => {
    if (!selectedFolderId) {
      message.warning("Please select a folder to save into");
      return;
    }
    onSave(selectedFolderId, linkedStoryId);
    onClose();
  };

  /* ── build story options grouped by epic ────────────────────────────── */
  const unassignedStories = jiraStories.filter((s) => !s.epicId);
  const storyOptions = [
    ...jiraEpics.map((epic) => ({
      label: epic.name,
      options: jiraStories
        .filter((s) => s.epicId === epic.id)
        .map((s) => ({
          label: `${s.key} — ${s.summary.length > 50 ? s.summary.slice(0, 50) + "..." : s.summary}`,
          value: s.id,
        })),
    })),
    ...(unassignedStories.length > 0
      ? [{
          label: "Unassigned",
          options: unassignedStories.map((s) => ({
            label: `${s.key} — ${s.summary.length > 50 ? s.summary.slice(0, 50) + "..." : s.summary}`,
            value: s.id,
          })),
        }]
      : []),
  ];

  const renderNode = (node: TreeNode, depth: number) => {
    const isExpanded = expandedIds.has(node.folder.id);
    const isSelected = selectedFolderId === node.folder.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.folder.id}>
        <div
          className={`save-modal__tree-row flex items-center gap-[6px] py-[6px] rounded-md cursor-pointer transition-colors ${
            isSelected
              ? "!bg-[#f3eaff] !text-[#7c3aed]"
              : "!text-[#4c4568] hover:bg-[#faf5ff]"
          }`}
          style={{ paddingLeft: 12 + depth * 20, paddingRight: 8 }}
          onClick={() => setSelectedFolderId(node.folder.id)}
        >
          <span
            className={`flex items-center justify-center w-[14px] h-[14px] text-[9px] ${
              hasChildren ? "opacity-100 cursor-pointer" : "opacity-0"
            } ${isSelected ? "!text-[#7c3aed]" : "!text-[#b0adbe]"}`}
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpand(node.folder.id);
            }}
          >
            {isExpanded ? <DownOutlined /> : <RightOutlined />}
          </span>

          <span className={`text-[13px] ${isSelected ? "!text-[#7c3aed]" : "!text-[#b0adbe]"}`}>
            {isExpanded && hasChildren ? <FolderOpenOutlined /> : <FolderOutlined />}
          </span>

          <span
            className="flex-1 truncate text-[13px]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: isSelected ? 600 : 500 }}
          >
            {node.folder.name}
          </span>

          {/* inline new subfolder trigger */}
          {isSelected && (
            <span
              className="!text-[#7c3aed] text-[12px] hover:bg-[#7c3aed]/10 rounded p-[2px] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedIds((p) => new Set(p).add(node.folder.id));
                setCreatingIn(node.folder.id);
                setNewFolderName("");
              }}
            >
              <PlusOutlined />
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}

        {/* new folder input */}
        {creatingIn === node.folder.id && (
          <div
            className="flex items-center gap-[6px] py-[4px]"
            style={{ paddingLeft: 12 + (depth + 1) * 20, paddingRight: 8 }}
          >
            <FolderOutlined className="!text-[#b0adbe] text-[13px]" />
            <Input
              size="small"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onPressEnter={handleCreateFolder}
              onBlur={() => {
                if (!newFolderName.trim()) setCreatingIn(undefined);
                else handleCreateFolder();
              }}
              autoFocus
              style={{ fontSize: 12, height: 26, flex: 1, fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width={480}
      centered
      destroyOnClose
      className="save-to-repo-modal"
    >
      <div className="flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className="!text-[#0f0a1e] text-[15px] m-0"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
            >
              Save to Repository
            </h3>
            <p
              className="!text-[#8b87a0] text-[12px] mt-[2px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {savingCount} item{savingCount !== 1 ? "s" : ""} selected — choose a destination folder
            </p>
          </div>
        </div>

        {/* new root folder button */}
        <button
          onClick={() => {
            setCreatingIn(null);
            setNewFolderName("");
          }}
          className="save-modal__new-root flex items-center gap-2 px-3 py-[7px] mb-3 rounded-md border border-dashed border-[#d9d5e8] bg-[#faf9ff] !text-[#7c3aed] text-[12px] cursor-pointer transition-colors hover:border-[#7c3aed] hover:bg-[#f3eaff]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          <FolderAddOutlined className="text-[13px]" />
          New Root Folder
        </button>

        {/* root-level new folder input */}
        {creatingIn === null && (
          <div className="flex items-center gap-[6px] mb-2 px-3">
            <FolderOutlined className="!text-[#b0adbe] text-[13px]" />
            <Input
              size="small"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onPressEnter={handleCreateFolder}
              onBlur={() => {
                if (!newFolderName.trim()) setCreatingIn(undefined);
                else handleCreateFolder();
              }}
              autoFocus
              style={{ fontSize: 12, height: 26, flex: 1, fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        )}

        {/* tree */}
        <div
          className="save-modal__tree border border-[#f3f0fb] rounded-lg bg-white overflow-y-auto py-2"
          style={{ maxHeight: 260, minHeight: 160 }}
        >
          {tree.map((root) => renderNode(root, 0))}
        </div>

        {/* selected path */}
        {selectedFolderId && (
          <div className="mt-3 px-1">
            <p className="!text-[#8b87a0] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Saving to:{" "}
              <span className="!text-[#7c3aed]" style={{ fontWeight: 600 }}>
                {getPath(selectedFolderId, folders)}
              </span>
            </p>
          </div>
        )}

        {/* link to story */}
        {jiraStories.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-[6px] mb-[6px]">
              <LinkOutlined className="!text-[#8b87a0] text-[11px]" />
              <span
                className="!text-[#8b87a0] text-[11px] uppercase tracking-wide"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
              >
                Link to Story
              </span>
              <span className="!text-[#b0adbe] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>(optional)</span>
            </div>
            <Select
              placeholder="Select a story to link..."
              value={linkedStoryId}
              onChange={(v) => setLinkedStoryId(v)}
              allowClear
              style={{ width: "100%", fontSize: 12 }}
              options={storyOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
              }
            />
          </div>
        )}

        {/* actions */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-[6px] rounded-md border border-[#e2dff0] bg-white !text-[#4c4568] text-[12px] cursor-pointer hover:bg-[#faf9ff] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFolderId}
            className={`px-4 py-[6px] rounded-md border-0 text-white text-[12px] cursor-pointer transition-colors ${
              selectedFolderId
                ? "bg-[#7c3aed] hover:bg-[#6d28d9]"
                : "bg-[#c4b5fd] cursor-not-allowed"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Save Here
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── utility ─────────────────────────────────────────────────────────── */

function getPath(folderId: string, folders: RepoFolder[]): string {
  const parts: string[] = [];
  let current = folders.find((f) => f.id === folderId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? folders.find((f) => f.id === current!.parentId) : undefined;
  }
  return parts.join(" / ");
}