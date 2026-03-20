import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RepoFolder, RepoItem } from "../lib/mock-data";
import { projectRepoFolders, projectRepoItems } from "../lib/mock-data";

interface RepoState {
  /** Folders keyed by projectId */
  folders: Record<string, RepoFolder[]>;
  /** Items keyed by projectId */
  items: Record<string, RepoItem[]>;
}

const initialState: RepoState = {
  folders: Object.fromEntries(
    Object.entries(projectRepoFolders).map(([id, f]) => [id, [...f]])
  ),
  items: Object.fromEntries(
    Object.entries(projectRepoItems).map(([id, i]) => [id, [...i]])
  ),
};

const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    /** Ensure a project's repo arrays exist (lazy-init for new projects). */
    initRepo(state, action: PayloadAction<string>) {
      const projectId = action.payload;
      if (!state.folders[projectId]) state.folders[projectId] = [];
      if (!state.items[projectId]) state.items[projectId] = [];
    },

    addFolder(
      state,
      action: PayloadAction<{ projectId: string; folder: RepoFolder }>
    ) {
      const { projectId, folder } = action.payload;
      state.folders[projectId] = [...(state.folders[projectId] ?? []), folder];
    },

    renameFolder(
      state,
      action: PayloadAction<{ projectId: string; folderId: string; name: string }>
    ) {
      const { projectId, folderId, name } = action.payload;
      state.folders[projectId] = (state.folders[projectId] ?? []).map((f) =>
        f.id === folderId ? { ...f, name } : f
      );
    },

    deleteFolderTree(
      state,
      action: PayloadAction<{ projectId: string; folderIds: string[] }>
    ) {
      const { projectId, folderIds } = action.payload;
      state.folders[projectId] = (state.folders[projectId] ?? []).filter(
        (f) => !folderIds.includes(f.id)
      );
      state.items[projectId] = (state.items[projectId] ?? []).filter(
        (i) => !folderIds.includes(i.folderId)
      );
    },

    addItem(
      state,
      action: PayloadAction<{ projectId: string; item: RepoItem }>
    ) {
      const { projectId, item } = action.payload;
      state.items[projectId] = [...(state.items[projectId] ?? []), item];
    },

    deleteItem(
      state,
      action: PayloadAction<{ projectId: string; itemId: string }>
    ) {
      const { projectId, itemId } = action.payload;
      state.items[projectId] = (state.items[projectId] ?? []).filter(
        (i) => i.id !== itemId
      );
    },

    deleteItems(
      state,
      action: PayloadAction<{ projectId: string; itemIds: string[] }>
    ) {
      const { projectId, itemIds } = action.payload;
      const set = new Set(itemIds);
      state.items[projectId] = (state.items[projectId] ?? []).filter(
        (i) => !set.has(i.id)
      );
    },

    moveItems(
      state,
      action: PayloadAction<{
        projectId: string;
        itemIds: string[];
        targetFolderId: string;
      }>
    ) {
      const { projectId, itemIds, targetFolderId } = action.payload;
      const set = new Set(itemIds);
      state.items[projectId] = (state.items[projectId] ?? []).map((i) =>
        set.has(i.id) ? { ...i, folderId: targetFolderId } : i
      );
    },

    relinkItems(
      state,
      action: PayloadAction<{
        projectId: string;
        itemIds: string[];
        linkedStoryId: string | undefined;
      }>
    ) {
      const { projectId, itemIds, linkedStoryId } = action.payload;
      const set = new Set(itemIds);
      state.items[projectId] = (state.items[projectId] ?? []).map((i) =>
        set.has(i.id) ? { ...i, linkedStoryId } : i
      );
    },
  },
});

export const {
  initRepo,
  addFolder,
  renameFolder,
  deleteFolderTree,
  addItem,
  deleteItem,
  deleteItems,
  moveItems,
  relinkItems,
} = repoSlice.actions;

export default repoSlice.reducer;
