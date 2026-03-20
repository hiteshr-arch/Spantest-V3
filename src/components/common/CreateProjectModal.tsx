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
        <span className="create-project-modal__title">
          Create new project
        </span>
      }
    >
      <div className="flex flex-col gap-5 pt-4">
        {/* Conversational prompt - Name */}
        <div className="flex flex-col gap-2">
          <div className="create-project-modal__prompt">
            <p className="create-project-modal__prompt-text">
              <span className="create-project-modal__prompt-bold">Hey there!</span> Let's create your project. What's the project name?
            </p>
          </div>
          <Input
            placeholder="E.g. Customer Onboarding"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Conversational prompt - Description */}
        <div className="flex flex-col gap-2">
          <div className="create-project-modal__prompt">
            <p className="create-project-modal__prompt-text">
              Optional: Add a short description.
            </p>
          </div>
          <Input.TextArea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClose}
            className="create-project-modal__btn-back"
          >
            Back
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="create-project-modal__btn-create disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
}
