import { useParams, useOutletContext } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppSelector } from "../../store/hooks";
import { StatCard } from "../components/ui/StatCard";
import type { Project } from "../lib/mock-data";

const CATEGORY_COLORS: Record<string, string> = {
  Positive: "#16a34a",
  Negative: "#dc2626",
  "Edge Case": "#d97706",
};

const ROLE_COLORS: Record<string, string> = {
  Owner: "#7c3aed",
  Editor: "#2563eb",
  Viewer: "#8b87a0",
};

export function Overview() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project } = useOutletContext<{ project: Project }>();

  const config = useAppSelector(
    (s) => s.projectConfig.configs[projectId ?? ""]
  );
  const jira = useAppSelector(
    (s) => s.projectConfig.jira[projectId ?? ""]
  );

  if (!config) {
    return (
      <div className="flex items-center justify-center flex-1 text-[#8b87a0] font-['DM_Sans',sans-serif] text-[13px]">
        Loading…
      </div>
    );
  }

  const stats = config.stats;
  const totalTests =
    (stats.testsByType?.ui ?? 0) + (stats.testsByType?.api ?? 0);

  const categoryData = [
    { name: "Positive", value: stats.scenariosByCategory?.positive ?? 0 },
    { name: "Negative", value: stats.scenariosByCategory?.negative ?? 0 },
    { name: "Edge Case", value: stats.scenariosByCategory?.edgeCase ?? 0 },
  ];

  const recentActivity = [...(config.activityLog ?? [])]
    .reverse()
    .slice(0, 5);

  const isJiraConnected = jira?.connected ?? config.jiraConnected ?? false;

  return (
    <div className="overview flex flex-col h-full overflow-auto bg-[#faf9ff]">
      <div className="flex flex-col gap-5 p-4 sm:p-6 w-full">
        {/* ── Header ── */}
        <div
          className="bg-white rounded-2xl px-4 sm:px-6 py-5 flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap"
          style={{
            boxShadow:
              "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex flex-col gap-[6px] flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[20px] leading-tight"
                style={{ fontWeight: 700 }}
              >
                {project?.name ?? config.name}
              </h1>
              <span
                className="flex items-center gap-[5px] px-[8px] py-[2px] rounded-full text-[11px] font-['DM_Sans',sans-serif]"
                style={{
                  fontWeight: 600,
                  backgroundColor:
                    config.status === "active"
                      ? "rgba(22,163,74,0.08)"
                      : "rgba(139,135,160,0.08)",
                  color:
                    config.status === "active" ? "#16a34a" : "#8b87a0",
                }}
              >
                <span
                  className="inline-block size-[5px] rounded-full"
                  style={{
                    backgroundColor:
                      config.status === "active" ? "#16a34a" : "#8b87a0",
                  }}
                />
                {config.status === "active" ? "Active" : "Archived"}
              </span>
            </div>

            {config.description && (
              <p className="font-['DM_Sans',sans-serif] text-[#4c4568] text-[13px]">
                {config.description}
              </p>
            )}

            {config.frameworks && config.frameworks.length > 0 && (
              <div className="flex gap-[6px] flex-wrap mt-1">
                {config.frameworks.map((fw) => (
                  <span
                    key={fw}
                    className="px-[8px] py-[2px] rounded-full bg-[#f3eaff] text-[#7c3aed] text-[11px] font-['DM_Sans',sans-serif]"
                    style={{ fontWeight: 600 }}
                  >
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 text-left sm:text-right w-full sm:w-auto">
            <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[11px]">
              Created
            </p>
            <p
              className="font-['DM_Sans',sans-serif] text-[#4c4568] text-[12px]"
              style={{ fontWeight: 500 }}
            >
              {config.createdAt}
            </p>
            <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[11px] mt-1">
              By {config.createdBy}
            </p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Scenarios"
            value={stats.totalScenarios ?? 0}
            subtitle="Total generated"
            borderColor="#7c3aed"
          />
          <StatCard
            label="Test Cases"
            value={stats.totalTestCases ?? 0}
            subtitle="Steps documented"
            borderColor="#2563eb"
          />
          <StatCard
            label="Team"
            value={config.members?.length ?? 0}
            subtitle="Members"
            borderColor="#d97706"
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
          {/* Weekly Activity */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{
              boxShadow:
                "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
            }}
          >
            <p
              className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[13px] mb-4"
              style={{ fontWeight: 600 }}
            >
              Weekly Activity
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={stats.weeklyActivity ?? []}
                barCategoryGap="30%"
                barGap={2}
              >
                <XAxis
                  dataKey="week"
                  tick={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fill: "#8b87a0",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fill: "#8b87a0",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #f3f0fb",
                  }}
                />
                <Bar dataKey="scenarios" name="Scenarios" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                <Bar dataKey="testCases" name="Test Cases" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-4 mt-2">
              {[
                { color: "#7c3aed", label: "Scenarios" },
                { color: "#2563eb", label: "Test Cases" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-[5px]">
                  <span
                    className="inline-block size-[8px] rounded-sm"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="font-['DM_Sans',sans-serif] text-[11px] text-[#8b87a0]">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Category + Type */}
          <div className="flex flex-col gap-4">
            {/* Category Breakdown */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{
                boxShadow:
                  "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
              }}
            >
              <p
                className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[13px] mb-4"
                style={{ fontWeight: 600 }}
              >
                Category Breakdown
              </p>
              <div className="flex flex-col gap-3">
                {categoryData.map((cat) => {
                  const catTotal = categoryData.reduce(
                    (s, c) => s + c.value,
                    0
                  );
                  const pct =
                    catTotal > 0
                      ? Math.round((cat.value / catTotal) * 100)
                      : 0;
                  return (
                    <div key={cat.name} className="flex flex-col gap-[4px]">
                      <div className="flex justify-between items-center">
                        <span className="font-['DM_Sans',sans-serif] text-[12px] text-[#4c4568]">
                          {cat.name}
                        </span>
                        <span
                          className="font-['DM_Sans',sans-serif] text-[12px] text-[#4c4568]"
                          style={{ fontWeight: 600 }}
                        >
                          {cat.value}
                          <span className="text-[#8b87a0] font-normal ml-1">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-[6px] rounded-full bg-[#f3f0fb] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              CATEGORY_COLORS[cat.name] ?? "#7c3aed",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Type Split */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{
                boxShadow:
                  "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
              }}
            >
              <p
                className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[13px] mb-4"
                style={{ fontWeight: 600 }}
              >
                Test Type
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "UI", value: stats.testsByType?.ui ?? 0, color: "#7c3aed" },
                  { label: "API", value: stats.testsByType?.api ?? 0, color: "#2563eb" },
                ].map((t) => {
                  const pct =
                    totalTests > 0
                      ? Math.round((t.value / totalTests) * 100)
                      : 0;
                  return (
                    <div key={t.label} className="flex flex-col gap-[4px]">
                      <div className="flex justify-between items-center">
                        <span className="font-['DM_Sans',sans-serif] text-[12px] text-[#4c4568]">
                          {t.label}
                        </span>
                        <span
                          className="font-['DM_Sans',sans-serif] text-[12px] text-[#4c4568]"
                          style={{ fontWeight: 600 }}
                        >
                          {t.value}
                          <span className="text-[#8b87a0] font-normal ml-1">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-[6px] rounded-full bg-[#f3f0fb] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: t.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Activity Log ── */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{
            boxShadow:
              "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
          }}
        >
          <p
            className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[13px] mb-4"
            style={{ fontWeight: 600 }}
          >
            Recent Activity
          </p>
          {recentActivity.length === 0 ? (
            <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[12px]">
              No activity yet.
            </p>
          ) : (
            <div className="flex flex-col gap-0">
              {recentActivity.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-start gap-3 py-3 ${idx < recentActivity.length - 1 ? "border-b border-[#f3f0fb]" : ""}`}
                >
                  <div className="size-[28px] rounded-full bg-[#f3eaff] flex items-center justify-center shrink-0 mt-[1px]">
                    <span className="text-[#7c3aed] text-[11px]" style={{ fontWeight: 700 }}>
                      {entry.user?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-['DM_Sans',sans-serif] text-[13px] text-[#0f0a1e]"
                      style={{ fontWeight: 500 }}
                    >
                      {entry.action}
                    </p>
                    {entry.detail && (
                      <p className="font-['DM_Sans',sans-serif] text-[11px] text-[#8b87a0] truncate">
                        {entry.detail}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-['DM_Sans',sans-serif] text-[11px] text-[#8b87a0]">
                      {entry.user}
                    </p>
                    <p className="font-['DM_Sans',sans-serif] text-[10px] text-[#c0bcd1]">
                      {entry.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom row: Team + Jira ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
          {/* Team Members */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{
              boxShadow:
                "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
            }}
          >
            <p
              className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[13px] mb-4"
              style={{ fontWeight: 600 }}
            >
              Team Members
            </p>
            {(!config.members || config.members.length === 0) ? (
              <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[12px]">
                No members yet.
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {config.members.map((member, idx) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 py-[10px] ${idx < config.members.length - 1 ? "border-b border-[#f3f0fb]" : ""}`}
                  >
                    <div
                      className="size-[32px] rounded-full flex items-center justify-center shrink-0 text-white text-[11px]"
                      style={{ backgroundColor: "#7c3aed", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-['DM_Sans',sans-serif] text-[13px] text-[#0f0a1e] truncate"
                        style={{ fontWeight: 500 }}
                      >
                        {member.name}
                      </p>
                      <p className="font-['DM_Sans',sans-serif] text-[11px] text-[#8b87a0] truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-[2px] shrink-0">
                      <span
                        className="text-[10px] font-['DM_Sans',sans-serif] px-[7px] py-[1px] rounded-full"
                        style={{
                          fontWeight: 600,
                          color: ROLE_COLORS[member.role] ?? "#8b87a0",
                          backgroundColor: `${ROLE_COLORS[member.role] ?? "#8b87a0"}18`,
                        }}
                      >
                        {member.role}
                      </span>
                      <span className="font-['DM_Sans',sans-serif] text-[10px] text-[#c0bcd1]">
                        Joined {member.joinedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jira Integration */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{
              boxShadow:
                "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
            }}
          >
            <p
              className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[13px] mb-4"
              style={{ fontWeight: 600 }}
            >
              Jira Integration
            </p>
            <div className="flex flex-col gap-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-[8px] rounded-full"
                  style={{
                    backgroundColor: isJiraConnected ? "#16a34a" : "#8b87a0",
                  }}
                />
                <span
                  className="font-['DM_Sans',sans-serif] text-[13px]"
                  style={{
                    fontWeight: 600,
                    color: isJiraConnected ? "#16a34a" : "#8b87a0",
                  }}
                >
                  {isJiraConnected ? "Connected" : "Not Connected"}
                </span>
              </div>

              {isJiraConnected && (
                <div className="flex flex-col gap-[10px]">
                  {config.jiraInstanceUrl && (
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-['DM_Sans',sans-serif] text-[10px] text-[#8b87a0] uppercase tracking-[0.6px]" style={{ fontWeight: 600 }}>
                        Instance
                      </p>
                      <p className="font-['DM_Sans',sans-serif] text-[13px] text-[#4c4568] break-all">
                        {config.jiraInstanceUrl}
                      </p>
                    </div>
                  )}
                  {config.jiraProjectKey && (
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-['DM_Sans',sans-serif] text-[10px] text-[#8b87a0] uppercase tracking-[0.6px]" style={{ fontWeight: 600 }}>
                        Project Key
                      </p>
                      <span className="inline-flex self-start px-[8px] py-[2px] rounded bg-[#f3eaff] text-[#7c3aed] font-['DM_Sans',sans-serif] text-[12px]" style={{ fontWeight: 600 }}>
                        {config.jiraProjectKey}
                      </span>
                    </div>
                  )}
                  {jira?.epics && jira.epics.length > 0 && (
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-[2px]">
                        <p className="font-['DM_Sans',sans-serif] text-[10px] text-[#8b87a0] uppercase tracking-[0.6px]" style={{ fontWeight: 600 }}>Epics</p>
                        <p className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[20px]" style={{ fontWeight: 700 }}>{jira.epics.length}</p>
                      </div>
                      {jira?.stories && jira.stories.length > 0 && (
                        <div className="flex flex-col gap-[2px]">
                          <p className="font-['DM_Sans',sans-serif] text-[10px] text-[#8b87a0] uppercase tracking-[0.6px]" style={{ fontWeight: 600 }}>Stories</p>
                          <p className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[20px]" style={{ fontWeight: 700 }}>{jira.stories.length}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isJiraConnected && (
                <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#8b87a0]">
                  Connect Jira in Config to link epics and stories to your test cases.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
