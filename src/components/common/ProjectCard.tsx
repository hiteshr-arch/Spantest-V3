import { useNavigate } from "react-router";
import type { Project } from "../../lib/mock-data";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="project-card bg-white rounded-2xl relative p-5 flex flex-col gap-4 flex-1 min-w-[280px]"
      onClick={() => navigate(`/project/${project.id}/generator`)}
    >
      <div className="project-card__header flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <p className="project-card__name">
            {project.name}
          </p>
          <StatusBadge status={project.status} />
        </div>
        <p className="project-card__meta">
          Last active {project.lastActive} · {project.testCases} test cases
        </p>
      </div>

      <div className="project-card__border-overlay" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span className={`status-badge status-badge--${isActive ? "active" : "archived"}`}>
      <span className="status-badge__dot" />
      <span className="status-badge__label">
        {status}
      </span>
    </span>
  );
}
