<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useFocusMode } from "~/composables/use-focus-mode";
import { useFullscreen } from "~/composables/use-fullscreen";

const store = useEditorStore();
const { toggleFocusMode, isEnabled: focusMode } = useFocusMode();
const { toggleFullscreen, fullscreenIcon, fullscreenLabel } = useFullscreen();

interface ToolbarAction {
  icon: string;
  label: string;
  action: () => void;
  active?: boolean;
  disabled?: boolean;
}

const formattingActions: ToolbarAction[] = [
  {
    icon: "i-lucide-bold",
    label: "Negrito",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-italic",
    label: "Itálico",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-underline",
    label: "Sublinhado",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-strikethrough",
    label: "Tachado",
    action: () => {},
    disabled: true,
  },
];

const blockActions: ToolbarAction[] = [
  {
    icon: "i-lucide-heading",
    label: "Cabeçalho",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-list",
    label: "Lista",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-list-ordered",
    label: "Lista numerada",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-code",
    label: "Código",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-quote",
    label: "Citação",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-link",
    label: "Link",
    action: () => {},
    disabled: true,
  },
];

const historyActions: ToolbarAction[] = [
  {
    icon: "i-lucide-undo",
    label: "Desfazer",
    action: () => {},
    disabled: true,
  },
  {
    icon: "i-lucide-redo",
    label: "Refazer",
    action: () => {},
    disabled: true,
  },
];
</script>

<template>
  <div class="editor-toolbar border-b border-default px-4 py-2">
    <div class="flex items-center gap-1 flex-wrap">
      <!-- Formatting Actions -->
      <UButton
        v-for="action in formattingActions"
        :key="action.label"
        :icon="action.icon"
        :aria-label="action.label"
        variant="ghost"
        color="neutral"
        size="sm"
        :disabled="action.disabled"
        @click="action.action"
      />

      <div class="w-px h-6 bg-default mx-1" />

      <!-- Block Actions -->
      <UButton
        v-for="action in blockActions"
        :key="action.label"
        :icon="action.icon"
        :aria-label="action.label"
        variant="ghost"
        color="neutral"
        size="sm"
        :disabled="action.disabled"
        @click="action.action"
      />

      <div class="w-px h-6 bg-default mx-1" />

      <!-- History Actions -->
      <UButton
        v-for="action in historyActions"
        :key="action.label"
        :icon="action.icon"
        :aria-label="action.label"
        variant="ghost"
        color="neutral"
        size="sm"
        :disabled="action.disabled"
        @click="action.action"
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
