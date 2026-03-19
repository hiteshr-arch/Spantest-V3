import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { ProjectLayout } from "./components/layout/ProjectLayout";
import { Dashboard } from "./pages/Dashboard";
import { Overview } from "./pages/Overview";
import { Generator } from "./pages/Generator";
import { Repository } from "./pages/Repository";
import { StoryImport } from "./pages/StoryImport";
import { Tools } from "./pages/Tools";
import { Config } from "./pages/Config";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      {
        path: "project/:projectId",
        Component: ProjectLayout,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", Component: Overview },
          { path: "generator", Component: Generator },
          { path: "repository", Component: Repository },
          { path: "stories", Component: StoryImport },
          { path: "tools", Component: Tools },
          { path: "config", Component: Config },
        ],
      },
      { path: "*", Component: Dashboard },
    ],
  },
]);