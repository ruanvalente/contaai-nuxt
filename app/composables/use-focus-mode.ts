import { computed, onMounted, onUnmounted } from "vue";
import type { FocusModeState } from "~/types/editor";

// =============================================================================
// useFocusMode - Focus Mode Composable
// =============================================================================

const FOCUS_MODE_STORAGE_KEY = "editor-focus-mode";

export function useFocusMode() {
  const state = useState<FocusModeState>("editor-focus-mode", () => ({
    enabled: false,
    sidebarVisible: true,
    toolbarVisible: true,
    statusBarVisible: true,
  }));

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const isEnabled = computed(() => state.value.enabled);
  const isSidebarVisible = computed(() => state.value.sidebarVisible);
  const isToolbarVisible = computed(() => state.value.toolbarVisible);
  const isStatusBarVisible = computed(() => state.value.statusBarVisible);

  const focusModeClass = computed(() =>
    state.value.enabled ? "editor-focus-mode" : ""
  );

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------

  function enableFocusMode() {
    state.value.enabled = true;
    state.value.sidebarVisible = false;
    state.value.toolbarVisible = false;
    state.value.statusBarVisible = false;
    saveState();
    if (typeof document !== "undefined") {
      document.body.classList.add("focus-mode-active");
    }
  }

  function disableFocusMode() {
    state.value.enabled = false;
    state.value.sidebarVisible = true;
    state.value.toolbarVisible = true;
    state.value.statusBarVisible = true;
    saveState();
    if (typeof document !== "undefined") {
      document.body.classList.remove("focus-mode-active");
    }
  }

  function toggleFocusMode() {
    if (state.value.enabled) {
      disableFocusMode();
    } else {
      enableFocusMode();
    }
  }

  function toggleSidebar() {
    state.value.sidebarVisible = !state.value.sidebarVisible;
    saveState();
  }

  function toggleToolbar() {
    state.value.toolbarVisible = !state.value.toolbarVisible;
    saveState();
  }

  function toggleStatusBar() {
    state.value.statusBarVisible = !state.value.statusBarVisible;
    saveState();
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  function saveState() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        FOCUS_MODE_STORAGE_KEY,
        JSON.stringify(state.value)
      );
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }

  function loadState() {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(FOCUS_MODE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FocusModeState;
        state.value = { ...state.value, ...parsed };
        if (state.value.enabled) {
          document.body.classList.add("focus-mode-active");
        }
      }
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }

  // ---------------------------------------------------------------------------
  // Keyboard Shortcut
  // ---------------------------------------------------------------------------

  function handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === "F") {
      event.preventDefault();
      toggleFocusMode();
    }
  }

  onMounted(() => {
    loadState();
    document.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeydown);
    if (typeof document !== "undefined") {
      document.body.classList.remove("focus-mode-active");
    }
  });

  return {
    state,
    isEnabled,
    isSidebarVisible,
    isToolbarVisible,
    isStatusBarVisible,
    focusModeClass,
    enableFocusMode,
    disableFocusMode,
    toggleFocusMode,
    toggleSidebar,
    toggleToolbar,
    toggleStatusBar,
  };
}
