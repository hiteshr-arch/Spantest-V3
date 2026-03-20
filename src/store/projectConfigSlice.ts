import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ProjectConfig,
  JiraEpic,
  JiraIssue,
  JiraProject,
  JiraSprint,
  JiraStory,
} from "../lib/mock-data";
import {
  mockProjectConfigs,
  projectJiraData,
  mockJiraEpics,
  mockJiraStories,
  mockJiraProjects,
  mockJiraSprints,
  mockJiraIssues,
} from "../lib/mock-data";

function buildEmptyConfig(projectId: string): ProjectConfig {
  const today = new Date().toISOString().split("T")[0];
  return {
    id: projectId,
    name: "New Project",
    description: "",
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
  };
}

interface ProjectJiraState {
  connected: boolean;
  projects: JiraProject[];
  sprints: JiraSprint[];
  issues: JiraIssue[];
  epics: JiraEpic[];
  stories: JiraStory[];
}

interface ProjectConfigState {
  /** Keyed by projectId */
  configs: Record<string, ProjectConfig>;
  /** Keyed by projectId */
  jira: Record<string, ProjectJiraState>;
}

function buildJiraState(projectId: string): ProjectJiraState {
  const raw = projectJiraData[projectId];
  return {
    connected: raw?.connected ?? false,
    projects: raw?.projects ?? [],
    sprints: raw?.sprints ?? [],
    issues: raw?.issues ?? [],
    epics: mockJiraEpics[projectId] ?? [],
    stories: mockJiraStories[projectId] ?? [],
  };
}

const initialState: ProjectConfigState = {
  configs: Object.fromEntries(
    Object.entries(mockProjectConfigs).map(([id, cfg]) => [id, { ...cfg }])
  ),
  jira: Object.fromEntries(
    Object.keys(mockProjectConfigs).map((id) => [id, buildJiraState(id)])
  ),
};

const projectConfigSlice = createSlice({
  name: "projectConfig",
  initialState,
  reducers: {
    /** Ensure a project's config and jira state are registered (lazy-init). */
    initProject(state, action: PayloadAction<string>) {
      const projectId = action.payload;
      if (!state.configs[projectId]) {
        state.configs[projectId] = buildEmptyConfig(projectId);
      }
      if (!state.jira[projectId]) {
        state.jira[projectId] = {
          connected: false,
          projects: [],
          sprints: [],
          issues: [],
          epics: [],
          stories: [],
        };
      }
    },

    updateConfig(
      state,
      action: PayloadAction<{ projectId: string; patch: Partial<ProjectConfig> }>
    ) {
      const { projectId, patch } = action.payload;
      if (state.configs[projectId]) {
        state.configs[projectId] = { ...state.configs[projectId], ...patch };
      }
    },

    connectJira(state, action: PayloadAction<{ projectId: string; projectKey: string }>) {
      const { projectId, projectKey } = action.payload;
      const cfg = state.configs[projectId];
      if (!cfg) return;

      cfg.jiraConnected = true;
      cfg.jiraInstanceUrl = cfg.jiraInstanceUrl || "https://spantest-team.atlassian.net";
      cfg.jiraProjectKey = projectKey || cfg.jiraProjectKey;

      const matched = mockJiraProjects.filter((p) => p.key === projectKey);
      const targetProjects = matched.length > 0 ? matched : [mockJiraProjects[0]];
      const targetIds = targetProjects.map((p) => p.id);

      state.jira[projectId] = {
        connected: true,
        projects: targetProjects,
        sprints: mockJiraSprints.filter((s) => targetIds.includes(s.projectId)),
        issues: mockJiraIssues.filter((i) => targetIds.includes(i.projectId)),
        epics: mockJiraEpics[projectId] ?? mockJiraEpics["p1"] ?? [],
        stories: mockJiraStories[projectId] ?? mockJiraStories["p1"] ?? [],
      };
    },

    disconnectJira(state, action: PayloadAction<string>) {
      const projectId = action.payload;
      const cfg = state.configs[projectId];
      if (!cfg) return;
      cfg.jiraConnected = false;
      cfg.jiraInstanceUrl = "";
      cfg.jiraProjectKey = "";
      state.jira[projectId] = {
        connected: false,
        projects: [],
        sprints: [],
        issues: [],
        epics: [],
        stories: [],
      };
    },

    setJiraEpics(
      state,
      action: PayloadAction<{ projectId: string; epics: JiraEpic[] }>
    ) {
      const { projectId, epics } = action.payload;
      if (state.jira[projectId]) {
        state.jira[projectId].epics = epics;
      }
    },

    setJiraStories(
      state,
      action: PayloadAction<{ projectId: string; stories: JiraStory[] }>
    ) {
      const { projectId, stories } = action.payload;
      if (state.jira[projectId]) {
        state.jira[projectId].stories = stories;
      }
    },
  },
});

export const {
  initProject,
  updateConfig,
  connectJira,
  disconnectJira,
  setJiraEpics,
  setJiraStories,
} = projectConfigSlice.actions;

export default projectConfigSlice.reducer;
