import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import type { EditorContent, EditorConfig, EditorStats } from "~/types/editor";
import { DEFAULT_EDITOR_CONFIG, DEFAULT_STATS } from "~/types/editor";

// =============================================================================
// useEditor - Core Editor Composable
// =============================================================================

export function useEditor(config: Partial<EditorConfig> = {}) {
  const store = useEditorStore();
  const editorConfig = { ...DEFAULT_EDITOR_CONFIG, ...config };

  const isInitialized = ref(false);
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

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  function initialize(editor: any) {
    editorRef.value = editor;
    isInitialized.value = true;
  }

  function destroy() {
    editorRef.value = null;
    isInitialized.value = false;
  }

  function loadContent(newContent: EditorContent) {
    store.updateContent(newContent);
  }

  function getContent(): EditorContent {
    return store.content;
  }

  function clearContent() {
    const emptyContent: EditorContent = {
      type: "doc",
      content: [{ type: "paragraph", content: [] }],
    };
    store.updateContent(emptyContent);
  }

  function resetState() {
    store.$reset();
    destroy();
  }

  function updateStats(newStats: EditorStats) {
    store.setStats(newStats);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  onMounted(() => {
    isInitialized.value = true;
  });

  onUnmounted(() => {
    destroy();
  });

  return {
    // Refs
    editorRef,
    isInitialized,

    // Computed
    content,
    stats,
    saveStatus,
    isActive,
    isLoading,
    error,
    isDirty,

    // Methods
    initialize,
    destroy,
    loadContent,
    getContent,
    clearContent,
    resetState,
    updateStats,
  };
}
