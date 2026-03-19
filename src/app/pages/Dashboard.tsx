import { useState, useMemo } from "react";
import { Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { StatCard } from "../components/ui/StatCard";
import { ProjectCard } from "../components/ui/ProjectCard";
import { CreateProjectModal } from "../components/ui/CreateProjectModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addProject } from "../../store/projectsSlice";
import { getDashboardStats, tokensRemaining } from "../lib/mock-data";

export function Dashboard() {
  const dispatch = useAppDispatch();
  const projectList = useAppSelector((s) => s.projects.list);

  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const stats = useMemo(() => getDashboardStats(projectList), [projectList]);

  const displayedProjects = useMemo(() => {
    if (!search.trim()) return projectList;
    const q = search.toLowerCase();
    return projectList.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, projectList]);

  const handleCreateProject = (name: string, description: string) => {
    const id = `p${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    dispatch(
      addProject({
        project: {
          id,
          name,
          status: "active",
          lastActive: "Just now",
          testCases: 0,
          scriptsGenerated: 0,
          frameworks: [],
          createdAt: today,
          createdBy: "John Doe",
        },
        config: {
          id,
          name,
          description,
          status: "active",
          createdAt: today,
          createdBy: "John Doe",
          frameworks: [],
          defaultTestType: "ui",
          defaultMode: "scenario-testcase",
          jiraConnected: false,
          jiraInstanceUrl: "",
          jiraProjectKey: "",
          attachments: [],
          stats: {
            totalScenarios: 0,
            totalTestCases: 0,
            totalScripts: 0,
            scenariosByCategory: { positive: 0, negative: 0, edgeCase: 0 },
            scriptsByFramework: { python: 0 },
            testsByType: { ui: 0, api: 0 },
            weeklyActivity: [],
          },
          activityLog: [],
          members: [
            {
              id: "m-owner",
              name: "John Doe",
              email: "john.doe@spantest.io",
              initials: "JD",
              role: "Owner",
              joinedAt: today,
            },
          ],
        },
      })
    );

    setCreateModalOpen(false);
  };

  return (
    <div className="dashboard min-h-screen bg-[#faf9ff]">
      <div className="dashboard__content px-6 py-6">
        {/* Breadcrumb + Title row */}
        <div className="dashboard__header flex items-start justify-between gap-4 mb-6">
          <div className="flex flex-col gap-[2px] flex-1">
            <div className="flex items-center gap-[2px]">
              <span className="font-['DM_Sans',sans-serif] text-[#c0bcd1] text-[12px]" style={{ fontWeight: 600 }}>
                Projects
              </span>
              <span className="font-['DM_Sans',sans-serif] text-[#c0bcd1] text-[12px]" style={{ fontWeight: 600 }}>
                /
              </span>
              <span className="font-['DM_Sans',sans-serif] text-[#c0bcd1] text-[12px]" style={{ fontWeight: 600 }}>
                Dashboard
              </span>
            </div>
            <h1
              className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[24px] leading-[32px] tracking-[-0.72px]"
              style={{ fontWeight: 600 }}
            >
              Project dashboard
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[14px]">
              A snapshot of your recent projects, test counts, and activity.
            </p>
          </div>

          <div className="flex items-start gap-3 shrink-0">
            <Input
              placeholder="Search projects..."
              prefix={<SearchOutlined style={{ color: "#0f0a1e", fontSize: 14 }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dashboard__search"
              style={{
                width: 220,
                borderRadius: 8,
                border: "1px solid #f3f0fb",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
              }}
            />
            <button
              onClick={() => setCreateModalOpen(true)}
              className="dashboard__new-project-btn flex items-center gap-1 px-3 py-[7px] rounded-lg border-0 cursor-pointer text-white text-[14px] whitespace-nowrap"
              style={{
                backgroundColor: "#7c3aed",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <PlusOutlined style={{ fontSize: 14 }} />
              New Project
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="dashboard__stats flex gap-6 mb-6">
          <StatCard label="Total Projects" value={stats.totalProjects} subtitle="Across all teams" borderColor="#7c3aed" />
          <StatCard label="Test Cases" value={stats.totalTestCases} subtitle="All active suites" borderColor="#16a34a" />
          <StatCard label="Scripts Generated" value={stats.totalScripts} subtitle="This month" borderColor="#f59e0b" />
          <StatCard label="Tokens Remaining" value={tokensRemaining} subtitle="Buy more tokens" borderColor="#2563eb" />
        </div>

        {/* Projects Section */}
        <div className="dashboard__projects">
          <p
            className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[16px] tracking-[-0.16px] mb-4"
            style={{ fontWeight: 600 }}
          >
            Your projects
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <CreateProjectModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateProject}
        />
      </div>
    </div>
  );
}
