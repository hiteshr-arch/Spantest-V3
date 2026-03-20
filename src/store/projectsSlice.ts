import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project, ProjectConfig } from "../lib/mock-data";
import {
  projects as initialProjects,
  mockProjectConfigs as initialConfigs,
  projectRepoFolders,
  projectRepoItems,
  projectJiraData,
} from "../lib/mock-data";

interface ProjectsState {
  list: Project[];
}

const initialState: ProjectsState = {
  list: [...initialProjects],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject(
      state,
      action: PayloadAction<{
        project: Project;
        config: ProjectConfig;
      }>
    ) {
      const { project, config } = action.payload;
      state.list.push(project);

      // Keep the shared mock-data objects in sync so newly created projects
      // work correctly when navigated to (ProjectConfig slice reads from them).
      initialConfigs[project.id] = config;
      projectRepoFolders[project.id] = [];
      projectRepoItems[project.id] = [];
      projectJiraData[project.id] = {
        connected: false,
        connection: null,
        projects: [],
        sprints: [],
        issues: [],
      };
    },
  },
});

export const { addProject } = projectsSlice.actions;
export default projectsSlice.reducer;
