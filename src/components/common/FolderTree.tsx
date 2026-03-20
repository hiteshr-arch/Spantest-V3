import React, { useState } from "react";
import { Input, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  FolderOutlined,
  FolderOpenOutlined,
  RightOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { RepoFolder } from "../../lib/mock-data";

/* ─── helpers ──────────────────────────────────────────────────────────── */

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

function getAllDescendantIds(folderId: string, folders: RepoFolder[]): string[] {
  const ids: string[] = [];
  const children = folders.filter((f) => f.parentId === folderId);
  children.forEach((c) => {
    ids.push(c.id);
    ids.push(...getAllDescendantIds(c.id, folders));
  });
  return ids;
}

/* ─── props ──────────────────────────────────────────────────────────── */

interface FolderTreeProps {
  folders: RepoFolder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  itemCounts?: Record<string, number>;
  compact?: boolean;
}

/* ─── component ──────────────────────────────────────────────────────── */

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  itemCounts = {},
  compact = false,
}: FolderTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // auto-expand first 2 levels
    const set = new Set<string>();
    folders.filter((f) => f.parentId === null).forEach((f) => set.add(f.id));
    return set;
  });
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const tree = buildTree(folders);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startRename = (folder: RepoFolder) => {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRenameFolder(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const getContextMenu = (node: TreeNode): MenuProps["items"] => [
    {
      key: "new-subfolder",
      icon: <PlusOutlined />,
      label: "New Subfolder",
      onClick: () => {
        setExpandedIds((p) => new Set(p).add(node.folder.id));
        onCreateFolder(node.folder.id);
      },
    },
    {
      key: "rename",
      icon: <EditOutlined />,
      label: "Rename",
      onClick: () => startRename(node.folder),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: () => onDeleteFolder(node.folder.id),
    },
  ];

  /* recursive render */
  const renderNode = (node: TreeNode, depth: number) => {
    const isExpanded = expandedIds.has(node.folder.id);
    const isSelected = selectedFolderId === node.folder.id;
    const hasChildren = node.children.length > 0;
    const count = itemCounts[node.folder.id] || 0;
    const totalCount = count + getAllDescendantIds(node.folder.id, folders).reduce((s, id) => s + (itemCounts[id] || 0), 0);

    return (
      <div key={node.folder.id} className="folder-tree__node">
        <Dropdown menu={{ items: getContextMenu(node) }} trigger={["contextMenu"]}>
          <div
            className={`folder-tree__row group flex items-center gap-1 rounded-md ${isSelected ? "folder-tree__row--selected" : ""}`}
            style={{ paddingLeft: compact ? 8 + depth * 16 : 10 + depth * 20, paddingRight: 6 }}
            onClick={() => onSelectFolder(node.folder.id)}
          >
            {/* expand arrow */}
            <span
              className={`folder-tree__arrow ${hasChildren ? "opacity-100" : "opacity-0 pointer-events-none"} ${isSelected ? "folder-tree__arrow--selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) toggleExpand(node.folder.id);
              }}
            >
              {isExpanded ? <DownOutlined /> : <RightOutlined />}
            </span>

            {/* folder icon */}
            <span className={`folder-tree__icon ${isSelected ? "folder-tree__icon--selected" : ""}`}>
              {isExpanded && hasChildren ? <FolderOpenOutlined /> : <FolderOutlined />}
            </span>

            {/* name or rename input */}
            {renamingId === node.folder.id ? (
              <Input
                size="small"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onPressEnter={commitRename}
                onBlur={commitRename}
                autoFocus
                className="folder-tree__rename-input"
              />
            ) : (
              <span className={`folder-tree__name ${isSelected ? "folder-tree__name--selected" : ""}`}>
                {node.folder.name}
              </span>
            )}

            {/* count badge */}
            {totalCount > 0 && renamingId !== node.folder.id && (
              <span className={`folder-tree__count ${isSelected ? "folder-tree__count--selected" : ""}`}>
                {totalCount}
              </span>
            )}

            {/* context menu trigger */}
            {renamingId !== node.folder.id && (
              <Dropdown menu={{ items: getContextMenu(node) }} trigger={["click"]}>
                <span
                  className="folder-tree__more"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreOutlined />
                </span>
              </Dropdown>
            )}
          </div>
        </Dropdown>

        {/* children */}
        {isExpanded && hasChildren && (
          <div className="folder-tree__children">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="folder-tree flex flex-col gap-[1px]">
      {tree.map((root) => renderNode(root, 0))}
    </div>
  );
}
