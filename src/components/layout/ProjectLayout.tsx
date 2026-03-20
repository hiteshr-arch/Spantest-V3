import { Outlet, useParams, NavLink } from "react-router";
import { DashboardOutlined, ExperimentOutlined, FolderOutlined, ReadOutlined, ToolOutlined, SettingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { initProject } from "../../store/projectConfigSlice";
import { initRepo } from "../../store/repoSlice";
import { ErrorBoundary } from "../ErrorBoundary";

const workspaceNav = [
  { key: "overview", label: "Overview", icon: <DashboardOutlined />, path: "overview" },
  { key: "generator", label: "Generator", icon: <ExperimentOutlined />, path: "generator" },
  { key: "repository", label: "Repository", icon: <FolderOutlined />, path: "repository" },
  { key: "stories", label: "Stories", icon: <ReadOutlined />, path: "stories" },
  { key: "tools", label: "Tools", icon: <ToolOutlined />, path: "tools" },
];

const projectNav = [
  { key: "config", label: "Config", icon: <SettingOutlined />, path: "config" },
];

export function ProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const project = useAppSelector((s) =>
    s.projects.list.find((p) => p.id === projectId)
  );

  const [contentVisible, setContentVisible] = useState(true);

  // Lazily initialise Redux state for projects created after the store was hydrated.
  useEffect(() => {
    if (!projectId) return;
    dispatch(initProject(projectId));
    dispatch(initRepo(projectId));
  }, [projectId, dispatch]);

  // Fade out → update → fade in when project switches
  useEffect(() => {
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 220);
    return () => clearTimeout(t);
  }, [projectId]);

  return (
    <div className="project-layout flex flex-1 min-h-0 h-full">
      {/* Sidebar */}
      <aside className="project-layout__sidebar w-[200px] shrink-0 bg-white border-r border-[#f3f0fb] flex flex-col py-5 px-3">
        {/* Workspace section */}
        <div className="project-layout__nav-section mb-6">
          <p className="project-layout__nav-label px-2 mb-2">
            Workspace
          </p>
          <nav className="flex flex-col gap-[2px]">
            {workspaceNav.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  `project-layout__nav-item flex items-center gap-2 px-2 py-[6px] rounded-md no-underline transition-colors ${
                    isActive ? "!bg-[#f3eaff] !text-[#7c3aed]" : "!text-[#4c4568] hover:bg-[#faf9ff]"
                  }`
                }
              >
                <span className="text-[14px]">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Project section */}
        <div className="project-layout__nav-section">
          <p className="project-layout__nav-label px-2 mb-2">
            Project
          </p>
          <nav className="flex flex-col gap-[2px]">
            {projectNav.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  `project-layout__nav-item flex items-center gap-2 px-2 py-[6px] rounded-md no-underline transition-colors ${
                    isActive ? "!bg-[#f3eaff] !text-[#7c3aed]" : "!text-[#4c4568] hover:bg-[#faf9ff]"
                  }`
                }
              >
                <span className="text-[14px]">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="project-layout__main flex-1 min-w-0 bg-[#faf9ff] overflow-hidden flex flex-col">
        <ErrorBoundary>
          <div
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: "opacity 0.22s ease",
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet context={{ project }} />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
