<script setup lang="ts">
import type { EditorToolbarItem } from "@nuxt/ui";
import type { Editor } from "@tiptap/vue-3";
import { useFocusMode } from "~/composables/use-focus-mode";
import { useFullscreen } from "~/composables/use-fullscreen";

interface Props {
  editor: Editor;
  items?: EditorToolbarItem[][];
}

const props = defineProps<Props>();

const { toggleFocusMode, isEnabled: focusMode } = useFocusMode();
const { toggleFullscreen, fullscreenIcon, fullscreenLabel } = useFullscreen();
</script>

<template>
  <div class="editor-toolbar border-b border-default px-4 py-2">
    <div class="flex items-center gap-1 flex-wrap">
      <!-- Nuxt UI Editor Toolbar -->
      <UEditorToolbar
        v-if="props.items && props.items.length > 0"
        :editor="props.editor"
        :items="props.items"
        class="flex-1"
      />

      <div class="flex-1" />

      <!-- Focus Mode Toggle -->
      <UButton
        icon="i-lucide-eye-off"
        aria-label="Modo foco"
        variant="ghost"
        color="neutral"
        size="sm"
        :class="{ 'text-primary': focusMode }"
        @click="toggleFocusMode"
      />

      <!-- Fullscreen Toggle -->
      <UButton
        :icon="fullscreenIcon"
        :aria-label="fullscreenLabel"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="toggleFullscreen"
      />
    </div>
  </div>
</template>
