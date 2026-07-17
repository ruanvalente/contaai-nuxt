import { defineStore } from "pinia";
import type {
  BookDocument,
  Chapter,
  EditorContent,
  EditorConfig,
  EditorState,
  EditorStats,
  SaveStatus,
  CursorPosition,
} from "~/types/editor";
import {
  DEFAULT_STATS,
  EMPTY_EDITOR_CONTENT,
} from "~/types/editor";

// =============================================================================
// Editor Store
// =============================================================================

export const useEditorStore = defineStore("editor", {
  state: (): EditorState => ({
    document: null,
    activeChapter: null,
    content: EMPTY_EDITOR_CONTENT,
    stats: { ...DEFAULT_STATS },
    cursorPosition: { line: 1, column: 1, offset: 0 },
    saveStatus: "idle",
    lastSavedAt: null,
    isDirty: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    documentId: (state): string | null => state.document?.id ?? null,

    chapterId: (state): string | null => state.activeChapter?.id ?? null,

    canUndo: (): boolean => {
      return false;
    },

    canRedo: (): boolean => {
      return false;
    },

    hasUnsavedChanges: (state): boolean => {
      return state.isDirty;
    },

    contentJSON: (state): string => {
      return JSON.stringify(state.content);
    },

    wordCount: (state): number => {
      return state.stats.words;
    },

    characterCount: (state): number => {
      return state.stats.characters;
    },

    readingTime: (state): number => {
      return state.stats.readingTimeMinutes;
    },
  },

  actions: {
    // -------------------------------------------------------------------------
    // Document Actions
    // -------------------------------------------------------------------------

    setDocument(document: BookDocument) {
      this.document = document;
      if (document.chapters.length > 0) {
        this.setActiveChapter(document.chapters[0]);
      }
    },

    clearDocument() {
      this.document = null;
      this.activeChapter = null;
      this.content = EMPTY_EDITOR_CONTENT;
      this.stats = { ...DEFAULT_STATS };
      this.isDirty = false;
      this.error = null;
    },

    // -------------------------------------------------------------------------
    // Chapter Actions
    // -------------------------------------------------------------------------

    setActiveChapter(chapter: Chapter) {
      this.activeChapter = chapter;
      this.content = chapter.content;
      this.isDirty = false;
    },

    // -------------------------------------------------------------------------
    // Content Actions
    // -------------------------------------------------------------------------

    updateContent(content: EditorContent) {
      this.content = content;
      this.isDirty = true;
    },

    setStats(stats: EditorStats) {
      this.stats = stats;
    },

    setCursorPosition(position: CursorPosition) {
      this.cursorPosition = position;
    },

    // -------------------------------------------------------------------------
    // Save Actions
    // -------------------------------------------------------------------------

    setSaveStatus(status: SaveStatus) {
      this.saveStatus = status;
    },

    markSaved() {
      this.saveStatus = "saved";
      this.isDirty = false;
      this.lastSavedAt = new Date();
    },

    markDirty() {
      this.isDirty = true;
    },

    // -------------------------------------------------------------------------
    // Loading & Error Actions
    // -------------------------------------------------------------------------

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    // -------------------------------------------------------------------------
    // Reset
    // -------------------------------------------------------------------------

    $reset() {
      this.document = null;
      this.activeChapter = null;
      this.content = EMPTY_EDITOR_CONTENT;
      this.stats = { ...DEFAULT_STATS };
      this.cursorPosition = { line: 1, column: 1, offset: 0 };
      this.saveStatus = "idle";
      this.lastSavedAt = null;
      this.isDirty = false;
      this.isLoading = false;
      this.error = null;
    },
  },
});
