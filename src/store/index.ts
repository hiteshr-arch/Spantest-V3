import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projectsSlice";
import projectConfigReducer from "./projectConfigSlice";
import repoReducer from "./repoSlice";

/* ── localStorage persistence helpers ─────────────────────────────────── */

const STORAGE_KEY = "spantest_redux_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function saveState(state: RootState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore write errors (e.g. private browsing quota)
  }
}

/* ── Store ─────────────────────────────────────────────────────────────── */

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    projectConfig: projectConfigReducer,
    repo: repoReducer,
  },
  preloadedState: loadState(),
});

// Persist state to localStorage after every dispatch
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
