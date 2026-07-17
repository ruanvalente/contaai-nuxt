import { ref, computed, onMounted, onUnmounted } from "vue";

// =============================================================================
// useFullscreen - Fullscreen Mode Composable
// =============================================================================

export function useFullscreen() {
  const isFullscreen = ref(false);
  const isSupported = ref(false);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const fullscreenIcon = computed(() =>
    isFullscreen.value ? "i-lucide-minimize" : "i-lucide-maximize"
  );

  const fullscreenLabel = computed(() =>
    isFullscreen.value ? "Sair da tela cheia" : "Tela cheia"
  );

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------

  async function enterFullscreen(element?: HTMLElement): Promise<boolean> {
    if (!isSupported.value) return false;

    try {
      const target = element || document.documentElement;
      await target.requestFullscreen();
      isFullscreen.value = true;
      return true;
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
      return false;
    }
  }

  async function exitFullscreen(): Promise<boolean> {
    if (!isSupported.value) return false;

    try {
      await document.exitFullscreen();
      isFullscreen.value = false;
      return true;
    } catch (err) {
      console.error("Failed to exit fullscreen:", err);
      return false;
    }
  }

  async function toggleFullscreen(element?: HTMLElement): Promise<boolean> {
    if (isFullscreen.value) {
      return exitFullscreen();
    }
    return enterFullscreen(element);
  }

  // ---------------------------------------------------------------------------
  // Event Listeners
  // ---------------------------------------------------------------------------

  function onFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement;
  }

  onMounted(() => {
    isSupported.value =
      typeof document !== "undefined" &&
      !!document.documentElement.requestFullscreen;

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("fullscreenerror", onFullscreenChange);
  });

  onUnmounted(() => {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    document.removeEventListener("fullscreenerror", onFullscreenChange);
  });

  return {
    isFullscreen,
    isSupported,
    fullscreenIcon,
    fullscreenLabel,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
