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
import { useAppSelector } from "../store/hooks";
import { StatCard } from "../components/common/StatCard";
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
    (s) => s.projectConfig.configs[projectId ?? ""],
  );
  const jira = useAppSelector((s) => s.projectConfig.jira[projectId ?? ""]);

  if (!config) {
    return (
      <div className="flex items-center justify-center flex-1 text-[#8b87a0] text-[13px]">
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

  const recentActivity = [...(config.activityLog ?? [])].reverse().slice(0, 5);

  const isJiraConnected = jira?.connected ?? config.jiraConnected ?? false;

  return (
    <div className="overview flex flex-col h-full overflow-auto bg-[#faf9ff]">
      <div className="flex flex-col gap-5 p-4 sm:p-6 w-full">
        {/* ── Header ── */}
        <div className="overview__card flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap px-4 sm:px-6 py-5">
          <div className="flex flex-col gap-[6px] flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="overview__project-name">
                {project?.name ?? config.name}
              </h1>
              <span
                className="flex items-center gap-[5px] px-[8px] py-[2px] rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor:
                    config.status === "active"
                      ? "rgba(22,163,74,0.08)"
                      : "rgba(139,135,160,0.08)",
                  color: config.status === "active" ? "#16a34a" : "#8b87a0",
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
              <p className="overview__project-desc">
                {config.description}
              </p>
            )}

            {config.frameworks && config.frameworks.length > 0 && (
              <div className="flex gap-[6px] flex-wrap mt-1">
                {config.frameworks.map((fw) => (
                  <span key={fw} className="overview__fw-tag">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 text-left sm:text-right w-full sm:w-auto">
            <p className="overview__meta-label">
              Created
            </p>
            <p className="overview__meta-value">
              {config.createdAt}
            </p>
            <p className="overview__meta-label mt-1">
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
          <div className="overview__card">
            <p className="overview__card-title">
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
                <Bar
                  dataKey="scenarios"
                  name="Scenarios"
                  fill="#7c3aed"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="testCases"
                  name="Test Cases"
                  fill="#2563eb"
                  radius={[3, 3, 0, 0]}
                />
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
                    className="overview__legend-dot"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="overview__legend-label">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Category + Type */}
          <div className="flex flex-col gap-4">
            {/* Category Breakdown */}
            <div className="overview__card">
              <p className="overview__card-title">
                Category Breakdown
              </p>
              <div className="flex flex-col gap-3">
                {categoryData.map((cat) => {
                  const catTotal = categoryData.reduce(
                    (s, c) => s + c.value,
                    0,
                  );
                  const pct =
                    catTotal > 0 ? Math.round((cat.value / catTotal) * 100) : 0;
                  return (
                    <div key={cat.name} className="flex flex-col gap-[4px]">
                      <div className="flex justify-between items-center">
                        <span className="overview__cat-name">
                          {cat.name}
                        </span>
                        <span className="overview__cat-value">
                          {cat.value}
                          <span className="overview__cat-pct ml-1">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="overview__progress-track">
                        <div
                          className="overview__progress-bar"
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
            <div className="overview__card">
              <p className="overview__card-title">
                Test Type
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "UI",
                    value: stats.testsByType?.ui ?? 0,
                    color: "#7c3aed",
                  },
                  {
                    label: "API",
                    value: stats.testsByType?.api ?? 0,
                    color: "#2563eb",
                  },
                ].map((t) => {
                  const pct =
                    totalTests > 0
                      ? Math.round((t.value / totalTests) * 100)
                      : 0;
                  return (
                    <div key={t.label} className="flex flex-col gap-[4px]">
                      <div className="flex justify-between items-center">
                        <span className="overview__cat-name">
                          {t.label}
                        </span>
                        <span className="overview__cat-value">
                          {t.value}
                          <span className="overview__cat-pct ml-1">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="overview__progress-track">
                        <div
                          className="overview__progress-bar"
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
        <div className="overview__card">
          <p className="overview__card-title">
            Recent Activity
          </p>
          {recentActivity.length === 0 ? (
            <p className="text-[#8b87a0] text-[12px]">
              No activity yet.
            </p>
          ) : (
            <div className="flex flex-col gap-0">
              {recentActivity.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-start gap-3 py-3 ${idx < recentActivity.length - 1 ? "border-b border-[#f3f0fb]" : ""}`}
                >
                  <div className="overview__activity-avatar shrink-0 mt-[1px]">
                    <span className="overview__activity-avatar-initial">
                      {entry.user?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="overview__activity-action">
                      {entry.action}
                    </p>
                    {entry.detail && (
                      <p className="overview__activity-detail">
                        {entry.detail}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="overview__activity-user">
                      {entry.user}
                    </p>
                    <p className="overview__activity-time">
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
          <div className="overview__card">
            <p className="overview__card-title">
              Team Members
            </p>
            {!config.members || config.members.length === 0 ? (
              <p className="text-[#8b87a0] text-[12px]">
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
                      className="overview__member-avatar"
                    >
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="overview__member-name">
                        {member.name}
                      </p>
                      <p className="overview__member-email">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-[2px] shrink-0">
                      <span
                        className="text-[10px] px-[7px] py-[1px] rounded-full font-semibold"
                        style={{
                          color: ROLE_COLORS[member.role] ?? "#8b87a0",
                          backgroundColor: `${ROLE_COLORS[member.role] ?? "#8b87a0"}18`,
                        }}
                      >
                        {member.role}
                      </span>
                      <span className="text-[10px] text-[#c0bcd1]">
                        Joined {member.joinedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jira Integration */}
          <div className="overview__card">
            <p className="overview__card-title">
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
                  className="text-[13px] font-semibold"
                  style={{
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
                      <p className="overview__section-label">
                        Instance
                      </p>
                      <p className="text-[13px] text-[#4c4568] break-all">
                        {config.jiraInstanceUrl}
                      </p>
                    </div>
                  )}
                  {config.jiraProjectKey && (
                    <div className="flex flex-col gap-[2px]">
                      <p className="overview__section-label">
                        Project Key
                      </p>
                      <span className="overview__jira-key">
                        {config.jiraProjectKey}
                      </span>
                    </div>
                  )}
                  {jira?.epics && jira.epics.length > 0 && (
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-[2px]">
                        <p className="overview__section-label">
                          Epics
                        </p>
                        <p className="overview__jira-stat-value">
                          {jira.epics.length}
                        </p>
                      </div>
                      {jira?.stories && jira.stories.length > 0 && (
                        <div className="flex flex-col gap-[2px]">
                          <p className="overview__section-label">
                            Stories
                          </p>
                          <p className="overview__jira-stat-value">
                            {jira.stories.length}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isJiraConnected && (
                <p className="text-[12px] text-[#8b87a0]">
                  Connect Jira in Config to link epics and stories to your test
                  cases.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
