import { useState } from "react";
import { Modal, Input } from "antd";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function CreateProjectModal({ open, onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim());
    setName("");
    setDescription("");
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
      centered
      closable
      title={
        <span
          className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[18px] tracking-[-0.18px]"
          style={{ fontWeight: 600 }}
        >
          Create new project
        </span>
      }
    >
      <div className="flex flex-col gap-5 pt-4">
        {/* Conversational prompt - Name */}
        <div className="flex flex-col gap-2">
          <div className="bg-[#faf9ff] rounded-lg px-4 py-3 border-l-3 border-[#7c3aed]">
            <p className="font-['DM_Sans',sans-serif] text-[#0f0a1e] text-[14px]">
              <span style={{ fontWeight: 700 }}>Hey there!</span> Let's create your project. What's the project name?
            </p>
          </div>
          <Input
            placeholder="E.g. Customer Onboarding"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              borderRadius: 8,
              border: "1px solid #f3f0fb",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              padding: "8px 12px",
            }}
          />
        </div>

        {/* Conversational prompt - Description */}
        <div className="flex flex-col gap-2">
          <div className="bg-[#faf9ff] rounded-lg px-4 py-3 border-l-3 border-[#7c3aed]">
            <p className="font-['DM_Sans',sans-serif] text-[#0f0a1e] text-[14px]">
              Optional: Add a short description.
            </p>
          </div>
          <Input.TextArea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              borderRadius: 8,
              border: "1px solid #f3f0fb",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              padding: "8px 12px",
              resize: "none",
            }}
          />
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-[6px] rounded-lg border border-[#f3f0fb] bg-white text-[#4c4568] text-[14px] cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Back
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-5 py-[6px] rounded-lg border-0 text-white text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#7c3aed",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
}
