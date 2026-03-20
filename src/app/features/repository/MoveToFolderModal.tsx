import { Modal, Select } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FolderTree } from "../../components/ui/FolderTree";
import type { RepoFolder, RepoItem } from "../../lib/mock-data";

/* ─── helpers ─────────────────────────────────────────────────────────── */

function getPath(folderId: string, folders: RepoFolder[]): string {
  const parts: string[] = [];
  let current = folders.find((f) => f.id === folderId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId
      ? folders.find((f) => f.id === current!.parentId)
      : undefined;
  }
  return parts.join(" / ");
}

/* ─── Single item move modal ──────────────────────────────────────────── */

interface MoveItemModalProps {
  item: RepoItem | null;
  folders: RepoFolder[];
  onClose: () => void;
  onMove: (itemId: string, targetFolderId: string) => void;
}

export function MoveItemModal({
  item,
  folders,
  onClose,
  onMove,
}: MoveItemModalProps) {
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

  const handleOk = () => {
    if (item && targetFolderId && targetFolderId !== item.folderId) {
      onMove(item.id, targetFolderId);
    }
    setTargetFolderId(null);
    onClose();
  };

  return (
    <Modal
      title="Move to Folder"
      open={!!item}
      onCancel={() => {
        setTargetFolderId(null);
        onClose();
      }}
      onOk={handleOk}
      okText="Move"
      okButtonProps={{
        disabled: !targetFolderId || targetFolderId === item?.folderId,
      }}
    >
      {item && (
        <div>
          <p
            className="!text-[#4c4568] text-[12px] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Move <span style={{ fontWeight: 600 }}>{item.name}</span> to:
          </p>
          <Select
            value={targetFolderId}
            onChange={(val) => setTargetFolderId(val)}
            style={{ width: "100%", fontFamily: "'DM Sans', sans-serif" }}
            placeholder="Select destination folder"
          >
            {folders.map((f) => (
              <Select.Option
                key={f.id}
                value={f.id}
                disabled={f.id === item.folderId}
              >
                <span className="flex items-center gap-1">
                  <FolderOutlined className="text-[11px]" />
                  {getPath(f.id, folders)}
                  {f.id === item.folderId && " (current)"}
                </span>
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </Modal>
  );
}

/* ─── Bulk move modal ─────────────────────────────────────────────────── */

interface BulkMoveModalProps {
  open: boolean;
  selectedCount: number;
  folders: RepoFolder[];
  itemCounts: Record<string, number>;
  onClose: () => void;
  onMove: (targetFolderId: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export function BulkMoveModal({
  open,
  selectedCount,
  folders,
  itemCounts,
  onClose,
  onMove,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: BulkMoveModalProps) {
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

  const handleOk = () => {
    if (targetFolderId) {
      onMove(targetFolderId);
      setTargetFolderId(null);
    }
  };

  return (
    <Modal
      title="Move to Folder"
      open={open}
      onCancel={() => {
        setTargetFolderId(null);
        onClose();
      }}
      onOk={handleOk}
      okText="Move"
      okButtonProps={{ disabled: !targetFolderId }}
    >
      <p
        className="!text-[#4c4568] text-[12px] mb-3"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Move <span style={{ fontWeight: 600 }}>{selectedCount} item(s)</span>{" "}
        to:
      </p>
      <div
        className="border border-[#f3f0fb] rounded-lg overflow-y-auto bg-white p-2"
        style={{ maxHeight: 280 }}
      >
        <FolderTree
          folders={folders}
          selectedFolderId={targetFolderId}
          onSelectFolder={setTargetFolderId}
          onCreateFolder={onCreateFolder}
          onRenameFolder={onRenameFolder}
          onDeleteFolder={onDeleteFolder}
          itemCounts={itemCounts}
        />
        {folders.length === 0 && (
          <div className="text-center py-6">
            <FolderOutlined className="!text-[#d9d5e8] text-[20px]" />
            <p
              className="!text-[#8b87a0] text-[11px] mt-2 m-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              No folders yet. Create one from the sidebar.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
