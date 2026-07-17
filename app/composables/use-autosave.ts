import { ref, watch, onUnmounted } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import type { SaveStatus, SaveResult } from "~/types/editor";

// =============================================================================
// useAutosave - Automatic Save Composable
// =============================================================================

export function useAutosave(delay: number = 3000) {
  const store = useEditorStore();
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
  const isAutoSaveEnabled = ref(true);
  const lastSaveResult = ref<SaveResult | null>(null);

  // ---------------------------------------------------------------------------
  // Save Handler (to be provided by consumer)
  // ---------------------------------------------------------------------------

  let saveHandler: ((content: any) => Promise<SaveResult>) | null = null;

  function setSaveHandler(handler: (content: any) => Promise<SaveResult>) {
    saveHandler = handler;
  }

  // ---------------------------------------------------------------------------
  // Core Save Logic
  // ---------------------------------------------------------------------------

  async function performSave(): Promise<SaveResult> {
    if (!saveHandler) {
      return { success: false, error: "No save handler configured" };
    }

    store.setSaveStatus("saving");

    try {
      const result = await saveHandler(store.content);
      lastSaveResult.value = result;

      if (result.success) {
        store.markSaved();
      } else {
        store.setSaveStatus("error");
      }

      return result;
    } catch (err) {
      const errorResult: SaveResult = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown save error",
      };
      lastSaveResult.value = errorResult;
      store.setSaveStatus("error");
      return errorResult;
    }
  }

  function scheduleSave() {
    if (!isAutoSaveEnabled.value) return;

    if (timeout.value) {
      clearTimeout(timeout.value);
    }

    timeout.value = setTimeout(() => {
      performSave();
    }, delay);
  }

  function cancelPendingSave() {
    if (timeout.value) {
      clearTimeout(timeout.value);
      timeout.value = null;
    }
  }

  function enableAutoSave() {
    isAutoSaveEnabled.value = true;
  }

  function disableAutoSave() {
    isAutoSaveEnabled.value = false;
    cancelPendingSave();
  }

  function saveNow(): Promise<SaveResult> {
    cancelPendingSave();
    return performSave();
  }

  // ---------------------------------------------------------------------------
  // Watch for content changes
  // ---------------------------------------------------------------------------

  const stopWatcher = watch(
    () => store.isDirty,
    (dirty) => {
      if (dirty) {
        scheduleSave();
      }
    }
  );

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  onUnmounted(() => {
    cancelPendingSave();
    stopWatcher();
  });

  return {
    isAutoSaveEnabled,
    lastSaveResult,
    setSaveHandler,
    scheduleSave,
    cancelPendingSave,
    enableAutoSave,
    disableAutoSave,
    saveNow,
    performSave,
  };
}
