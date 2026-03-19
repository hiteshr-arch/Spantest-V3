import { useNavigate } from "react-router";
import type { Project } from "../../lib/mock-data";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="project-card bg-white rounded-2xl relative p-5 flex flex-col gap-4 flex-1 min-w-[280px] cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/project/${project.id}/generator`)}
    >
      <div className="project-card__header flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <p
            className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[14px] tracking-[-0.14px]"
            style={{ fontWeight: 700 }}
          >
            {project.name}
          </p>
          <StatusBadge status={project.status} />
        </div>
        <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[14px]">
          Last active {project.lastActive} · {project.testCases} test cases
        </p>
      </div>

      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          boxShadow: "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
          border: "1px solid #f3f0fb",
        }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  const bgColor = isActive ? "rgba(22,163,74,0.08)" : "rgba(139,135,160,0.08)";
  const textColor = isActive ? "#16a34a" : "#8b87a0";
  const dotColor = isActive ? "#16a34a" : "#8b87a0";

  return (
    <span
      className="flex items-center gap-1 rounded-full px-2 py-1"
      style={{ backgroundColor: bgColor }}
    >
      <span className="size-[5px] rounded-full" style={{ backgroundColor: dotColor }} />
      <span
        className="font-['DM_Sans',sans-serif] text-[12px] capitalize"
        style={{ color: textColor, fontWeight: 600 }}
      >
        {status}
      </span>
    </span>
  );
}