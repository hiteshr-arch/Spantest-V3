# SpanTest+

**SpanTest+** is an AI-powered test management platform built for QA engineers and developers. It centralises test scenario generation, repository management, Jira story integration, and project configuration in a single, project-scoped workspace.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Application Flows](#application-flows)
5. [Frontend Architecture](#frontend-architecture)
6. [Folder Structure](#folder-structure)
7. [State Management](#state-management)
8. [Routing](#routing)
9. [Getting Started](#getting-started)

---

## Project Overview

SpanTest+ addresses the problem of fragmented QA workflows by providing:

- A **Generator** that produces structured test scenarios and test cases from user prompts
- A **Repository** that organises generated tests into a searchable, folder-based library
- A **Stories** page that connects to Jira and maps epics/stories to test cases in the repository
- A **Config** page for managing project metadata, team members, framework preferences, and Jira integration

The app is a **client-side SPA with no backend** — all state is managed in Redux Toolkit and persisted to `localStorage`.

---

## Key Features

| Feature | Description |
|---|---|
| **Multi-project workspace** | Create and switch between isolated projects, each with its own config, repo, and Jira connection |
| **Test Generator** | Chat-style interface to generate scenarios, test cases, and automation scripts with folder-save support |
| **Repository** | Folder tree navigation, full-text search, type/priority/category filters, inline preview, bulk move/delete |
| **Jira Integration** | Connect a Jira instance, browse epics and stories, link stories to repository test items |
| **Project Config** | Framework selection, default test type, Jira connection settings, team members, attachments, activity log |
| **Persistent state** | Full Redux state serialised to `localStorage` — survives browser refresh with no backend |
| **Error isolation** | React Error Boundaries at layout level — a crash in one page does not break the shell |

---

## Tech Stack

| Layer | Library / Tool | Version |
|---|---|---|
| UI Framework | React | 18.3 |
| Language | TypeScript | — |
| Build Tool | Vite | 6.4 |
| Routing | React Router | 7.13 |
| State Management | Redux Toolkit + React Redux | 2.x / 9.x |
| Primary UI Library | Ant Design | 6.x |
| Primitive UI Library | Radix UI + Shadcn components | — |
| Styling | Tailwind CSS v4 | 4.1 |
| Icons | Ant Design Icons + Lucide React | — |
| Charts | Recharts | 2.x |
| Drag and Drop | React DnD | 16.x |
| Animations | Motion (Framer) | 12.x |
| Date Utilities | date-fns | 3.x |

---

## Application Flows

### 1. Project Creation Flow

```
Dashboard
  └─ "New Project" button
       └─ CreateProjectModal (name, description, framework)
            └─ dispatch(addProject({ project, config }))
                 ├─ projectsSlice → adds to projects.list
                 ├─ projectConfigSlice → seeded via mock-data sync
                 └─ repoSlice → seeded with empty folders/items
                      └─ Navigate to /project/:projectId/generator
```

### 2. Test Generation Flow

```
Generator page (/project/:id/generator)
  └─ GeneratorChat — user types a prompt
       └─ ScenarioTable — generated test cases displayed
            └─ "Save to Repo" button
                 └─ SaveToRepoModal — pick or create folder
                      └─ dispatch(addItem({ projectId, item }))
                           └─ Repository page reflects new item immediately
```

### 3. Repository Management Flow

```
Repository page (/project/:id/repository)
  ├─ FolderTree (sidebar) — navigate folders
  │    ├─ Create / Rename / Delete folder → dispatch(addFolder / renameFolder / deleteFolderTree)
  │    └─ Select folder → filters item table
  ├─ RepositoryToolbar — search, type/priority/category filters, breadcrumb
  ├─ Item table — click row → ScenarioPreview (steps, API calls)
  └─ Bulk actions (select checkboxes)
       ├─ "Move to Folder" → BulkMoveModal → dispatch(moveItems)
       └─ "Delete" → dispatch(deleteItems)
```

### 4. Jira Integration Flow

```
Config page (/project/:id/config)
  └─ Jira section — enter instance URL + project key → dispatch(connectJira)
       └─ projectConfigSlice populates jira.projects / sprints / epics / stories

Stories page (/project/:id/stories)  [JiraImport]
  ├─ Epic selector → filters stories list
  ├─ Story rows — expand to see details
  └─ "Link to Test" button
       └─ Select repository item → dispatch(relinkItems({ projectId, itemIds, linkedStoryId }))
            └─ repoSlice updates item.linkedStoryId
```

### 5. State Persistence Flow

```
Any dispatch()
  └─ store.subscribe() fires
       └─ saveState(store.getState())
            └─ localStorage["spantest_redux_state"] = JSON.stringify(state)

Browser refresh
  └─ loadState() reads localStorage
       └─ configureStore({ preloadedState: loadState() })
            └─ Redux hydrated — UI renders as if nothing changed
```

---

## Frontend Architecture

### Layout Hierarchy

```
<Provider store={store}>          ← src/main.tsx
  <RouterProvider>
    <AppLayout>                   ← shell: Header + ErrorBoundary
      <Dashboard />               ← / (project list)
      <ProjectLayout>             ← /project/:projectId
        │  sidebar nav (Generator / Repository / Stories / Tools / Config)
        │  dispatches initProject + initRepo on mount (lazy-init)
        ├─ <Generator />
        ├─ <Repository />
        ├─ <StoryImport />        ← JiraImport
        ├─ <Tools />
        └─ <Config />
```

### Component Decomposition

Large pages are decomposed into focused feature components:

| Page | Extracted Components |
|---|---|
| `Repository.tsx` | `RepositoryToolbar`, `MoveToFolderModal`, `BulkMoveModal`, `ScenarioPreview` |
| `Generator.tsx` | `GeneratorChat`, `ScenarioTable`, `SaveToRepoModal` |
| Common | `FolderTree`, `StoryDetailView`, `ScriptView`, `StatCard`, `ProjectCard` |

### Error Boundary Strategy

`ErrorBoundary` (class component) wraps the `<Outlet>` at both `AppLayout` and `ProjectLayout` levels. A runtime error in any page is caught and shows a "Try again" reset button without crashing the entire shell.

---

## Folder Structure

```
src/
├── main.tsx                        # App entry — Redux Provider + RouterProvider
├── store/
│   ├── index.ts                    # configureStore, localStorage persistence, RootState / AppDispatch types
│   ├── hooks.ts                    # useAppDispatch / useAppSelector (typed)
│   ├── projectsSlice.ts            # projects.list — create/list projects
│   ├── projectConfigSlice.ts       # configs + jira state keyed by projectId
│   └── repoSlice.ts                # folders + items keyed by projectId
└── app/
    ├── App.tsx                     # RouterProvider
    ├── routes.tsx                  # createBrowserRouter route tree
    ├── lib/
    │   └── mock-data.ts            # Seed data — projects, configs, repo, Jira mock fixtures
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx       # Top-level shell (Header + Outlet)
    │   │   ├── ProjectLayout.tsx   # Per-project sidebar + Outlet
    │   │   └── Header.tsx          # Global top bar
    │   ├── ui/                     # Shadcn/Radix primitives + shared widgets
    │   │   ├── FolderTree.tsx
    │   │   ├── GeneratorChat.tsx
    │   │   ├── ScenarioTable.tsx
    │   │   ├── SaveToRepoModal.tsx
    │   │   ├── StoryDetailView.tsx
    │   │   ├── ScriptView.tsx
    │   │   ├── StatCard.tsx
    │   │   ├── ProjectCard.tsx
    │   │   └── ...                 # Radix-based primitives (button, dialog, select, …)
    │   └── ErrorBoundary.tsx       # Class-based error catcher
    ├── features/
    │   └── repository/
    │       ├── RepositoryToolbar.tsx   # Search, filters, breadcrumb, bulk-action bar
    │       ├── MoveToFolderModal.tsx   # Single + bulk move modals
    │       └── ScenarioPreview.tsx     # Step / API preview table
    └── pages/
        ├── Dashboard.tsx           # Project grid + create project
        ├── Generator.tsx           # AI test generation
        ├── Repository.tsx          # Folder-based test library
        ├── JiraImport.tsx          # Story-to-test linking (Stories page)
        ├── Config.tsx              # Project settings + Jira config
        ├── StoryImport.tsx         # Story import wrapper
        └── Tools.tsx               # Utility tools page
```

---

## State Management

SpanTest+ uses **Redux Toolkit** as its single source of truth. There are three slices, each keyed by `projectId` where per-project data is needed.

### Store Shape

```ts
{
  projects: {
    list: Project[]                            // all projects
  },
  projectConfig: {
    configs: Record<projectId, ProjectConfig>, // settings, frameworks, members
    jira:    Record<projectId, {               // Jira connection + loaded data
      connected, projects, sprints, issues, epics, stories
    }>
  },
  repo: {
    folders: Record<projectId, RepoFolder[]>,  // folder tree
    items:   Record<projectId, RepoItem[]>     // test items (scenarios / test cases / scripts)
  }
}
```

### Slices at a Glance

| Slice | File | Key Actions |
|---|---|---|
| `projects` | `projectsSlice.ts` | `addProject` |
| `projectConfig` | `projectConfigSlice.ts` | `initProject`, `updateConfig`, `connectJira`, `disconnectJira`, `setJiraEpics`, `setJiraStories` |
| `repo` | `repoSlice.ts` | `initRepo`, `addFolder`, `renameFolder`, `deleteFolderTree`, `addItem`, `deleteItem`, `deleteItems`, `moveItems`, `relinkItems` |

### Typed Hooks

All components use typed wrappers from `src/store/hooks.ts`:

```ts
// Reading state
const items = useAppSelector(s => s.repo.items[projectId] ?? []);

// Dispatching actions
const dispatch = useAppDispatch();
dispatch(addItem({ projectId, item }));
```

### localStorage Persistence

The store subscribes to itself and serialises the entire state tree after every dispatch:

```ts
store.subscribe(() => {
  localStorage.setItem("spantest_redux_state", JSON.stringify(store.getState()));
});
```

On startup, `preloadedState: loadState()` rehydrates the store — no backend required.

### Lazy Initialisation

New projects created after first load are registered via `initProject(projectId)` and `initRepo(projectId)` dispatched in `ProjectLayout`'s `useEffect`. This ensures the per-project keys exist in the store before any child page reads from them.

---

## Routing

```
/                          → Dashboard (project list)
/project/:projectId        → redirects to /project/:projectId/generator
/project/:projectId/generator
/project/:projectId/repository
/project/:projectId/stories
/project/:projectId/tools
/project/:projectId/config
*                          → Dashboard (fallback)
```

Each project route renders inside `ProjectLayout`, which provides the sidebar navigation and exposes the active `project` object via React Router's `useOutletContext`.

---

## Getting Started

```bash
# Install dependencies
npm i

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default. No environment variables or backend services are required — all data is seeded from `src/app/lib/mock-data.ts` and persisted to the browser's `localStorage`.

To reset all state, run the following in the browser console:

```js
localStorage.removeItem("spantest_redux_state");
location.reload();
```
# Spantest-V3
