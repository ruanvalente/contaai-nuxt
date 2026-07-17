import { ref, computed, watch, onUnmounted } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import { calculateStats } from "~/utils/editor/editor-utils";
import type { EditorContent, EditorStats } from "~/types/editor";
import { EMPTY_EDITOR_CONTENT } from "~/types/editor";

// =============================================================================
// useEditor - Core Editor Composable
// =============================================================================

export function useEditor() {
  const store = useEditorStore();
  const editorRef = ref<any>(null);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const content = computed({
    get: () => store.content,
    set: (value: EditorContent) => store.updateContent(value),
  });

  const stats = computed(() => store.stats);
  const saveStatus = computed(() => store.saveStatus);
  const isActive = computed(() => store.document !== null);
  const isLoading = computed(() => store.isLoading);
  const error = computed(() => store.error);
  const isDirty = computed(() => store.isDirty);
  const cursorPosition = computed(() => store.cursorPosition);

  // ---------------------------------------------------------------------------
  // Content Methods
  // ---------------------------------------------------------------------------

  function loadContent(newContent: EditorContent) {
    store.updateContent(newContent);
    recalculateStats(newContent);
  }

  function getContent(): EditorContent {
    return store.content;
  }

  function clearContent() {
    store.updateContent(EMPTY_EDITOR_CONTENT);
    recalculateStats(EMPTY_EDITOR_CONTENT);
  }

  function recalculateStats(newContent?: EditorContent) {
    const contentToUse = newContent ?? store.content;
    const stats = calculateStats(contentToUse);
    store.setStats(stats);
    return stats;
  }

  // ---------------------------------------------------------------------------
  // Stats Methods
  // ---------------------------------------------------------------------------

  function updateStats(newStats: EditorStats) {
    store.setStats(newStats);
  }

  // ---------------------------------------------------------------------------
  // Document Methods
  // ---------------------------------------------------------------------------

  function resetState() {
    store.$reset();
  }

  function setLoading(loading: boolean) {
    store.setLoading(loading);
  }

  function setError(error: string | null) {
    store.setError(error);
  }

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    // Refs
    editorRef,

    // Computed
    content,
    stats,
    saveStatus,
    isActive,
    isLoading,
    error,
    isDirty,
    cursorPosition,

    // Methods
    loadContent,
    getContent,
    clearContent,
    recalculateStats,
    updateStats,
    resetState,
    setLoading,
    setError,
  };
}
