<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useFocusMode } from "~/composables/use-focus-mode";
import { useFullscreen } from "~/composables/use-fullscreen";

interface Props {
  showToolbar?: boolean;
  showStatusBar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showToolbar: true,
  showStatusBar: true,
});

const store = useEditorStore();
const { isEnabled: focusMode, isToolbarVisible } = useFocusMode();
const { isFullscreen } = useFullscreen();

const showToolbarComputed = computed(
  () => props.showToolbar && isToolbarVisible.value
);
</script>

<template>
  <div
    class="book-editor"
    :class="{
      'focus-mode': focusMode,
      'fullscreen-mode': isFullscreen,
    }"
  >
    <!-- Toolbar -->
    <EditorEditorToolbar v-if="showToolbarComputed" />

    <!-- Editor Area -->
    <div class="editor-area flex-1">
      <slot name="editor" />
    </div>

    <!-- Status Bar -->
    <EditorEditorStatusBar v-if="showStatusBar" />
  </div>
</template>

<style scoped>
.book-editor {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--ui-bg);
}

.book-editor.focus-mode {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--ui-bg);
}

.book-editor.fullscreen-mode {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
