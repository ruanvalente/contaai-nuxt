<script setup lang="ts">
import type { EditorToolbarItem } from "@nuxt/ui";
import { useEditorStore } from "~/stores/editor-store";
import { useFocusMode } from "~/composables/use-focus-mode";
import { useFullscreen } from "~/composables/use-fullscreen";
import { calculateStats, getCursorPosition } from "~/utils/editor/editor-utils";
import type { EditorContent } from "~/types/editor";

interface Props {
  modelValue?: EditorContent;
  placeholder?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: "Comece a escrever...",
  readOnly: false,
  showToolbar: true,
  showStatusBar: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: EditorContent];
  "update:stats": [value: ReturnType<typeof calculateStats>];
  "update:cursor": [value: { line: number; column: number; offset: number }];
  save: [];
}>();

const store = useEditorStore();
const { isEnabled: focusMode, isToolbarVisible } = useFocusMode();
const { isFullscreen } = useFullscreen();

const editorRef = useTemplateRef("editorRef");
const internalContent = ref<EditorContent>(
  props.modelValue ?? {
    type: "doc",
    content: [{ type: "paragraph", content: [] }],
  }
);

// Sync prop modelValue → internal
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      internalContent.value = newVal;
    }
  }
);

// Sync store.content → internal (handles chapter switch & version restore)
let isInternalUpdate = false;
watch(
  () => store.content,
  (newVal) => {
    if (isInternalUpdate) return;
    internalContent.value = newVal;
  }
);

// ---------------------------------------------------------------------------
// Toolbar Items (fixed toolbar)
// ---------------------------------------------------------------------------

const toolbarItems: EditorToolbarItem[][] = [
  [
    {
      kind: "undo",
      icon: "i-lucide-undo",
      tooltip: { text: "Desfazer" },
    },
    {
      kind: "redo",
      icon: "i-lucide-redo",
      tooltip: { text: "Refazer" },
    },
  ],
  [
    {
      icon: "i-lucide-heading",
      tooltip: { text: "Cabeçalhos" },
      content: { align: "start" },
      items: [
        {
          kind: "heading",
          level: 1,
          icon: "i-lucide-heading-1",
          label: "Título 1",
        },
        {
          kind: "heading",
          level: 2,
          icon: "i-lucide-heading-2",
          label: "Título 2",
        },
        {
          kind: "heading",
          level: 3,
          icon: "i-lucide-heading-3",
          label: "Título 3",
        },
        {
          kind: "heading",
          level: 4,
          icon: "i-lucide-heading-4",
          label: "Título 4",
        },
      ],
    },
    {
      icon: "i-lucide-list",
      tooltip: { text: "Listas" },
      content: { align: "start" },
      items: [
        {
          kind: "bulletList",
          icon: "i-lucide-list",
          label: "Lista com marcadores",
        },
        {
          kind: "orderedList",
          icon: "i-lucide-list-ordered",
          label: "Lista numerada",
        },
      ],
    },
    {
      kind: "blockquote",
      icon: "i-lucide-text-quote",
      tooltip: { text: "Citação" },
    },
    {
      kind: "codeBlock",
      icon: "i-lucide-square-code",
      tooltip: { text: "Bloco de código" },
    },
  ],
  [
    {
      kind: "mark",
      mark: "bold",
      icon: "i-lucide-bold",
      tooltip: { text: "Negrito" },
    },
    {
      kind: "mark",
      mark: "italic",
      icon: "i-lucide-italic",
      tooltip: { text: "Itálico" },
    },
    {
      kind: "mark",
      mark: "underline",
      icon: "i-lucide-underline",
      tooltip: { text: "Sublinhado" },
    },
    {
      kind: "mark",
      mark: "strike",
      icon: "i-lucide-strikethrough",
      tooltip: { text: "Tachado" },
    },
    {
      kind: "mark",
      mark: "code",
      icon: "i-lucide-code",
      tooltip: { text: "Código" },
    },
  ],
  [
    {
      kind: "link",
      icon: "i-lucide-link",
      tooltip: { text: "Link" },
    },
  ],
];

// ---------------------------------------------------------------------------
// Bubble Toolbar Items
// ---------------------------------------------------------------------------

const bubbleToolbarItems: EditorToolbarItem[][] = [
  [
    {
      kind: "mark",
      mark: "bold",
      icon: "i-lucide-bold",
      tooltip: { text: "Negrito" },
    },
    {
      kind: "mark",
      mark: "italic",
      icon: "i-lucide-italic",
      tooltip: { text: "Itálico" },
    },
    {
      kind: "mark",
      mark: "underline",
      icon: "i-lucide-underline",
      tooltip: { text: "Sublinhado" },
    },
    {
      kind: "mark",
      mark: "strike",
      icon: "i-lucide-strikethrough",
      tooltip: { text: "Tachado" },
    },
    {
      kind: "mark",
      mark: "code",
      icon: "i-lucide-code",
      tooltip: { text: "Código" },
    },
  ],
  [
    {
      kind: "link",
      icon: "i-lucide-link",
      tooltip: { text: "Link" },
    },
  ],
];

// ---------------------------------------------------------------------------
// Suggestion Menu Items
// ---------------------------------------------------------------------------

const suggestionItems = [
  [
    {
      type: "label" as const,
      label: "Estilo",
    },
    {
      kind: "paragraph" as const,
      label: "Parágrafo",
      icon: "i-lucide-type",
    },
    {
      kind: "heading" as const,
      level: 1,
      icon: "i-lucide-heading-1",
      label: "Título 1",
    },
    {
      kind: "heading" as const,
      level: 2,
      icon: "i-lucide-heading-2",
      label: "Título 2",
    },
    {
      kind: "heading" as const,
      level: 3,
      icon: "i-lucide-heading-3",
      label: "Título 3",
    },
  ],
  [
    {
      type: "label" as const,
      label: "Listas",
    },
    {
      kind: "bulletList" as const,
      label: "Lista com marcadores",
      icon: "i-lucide-list",
    },
    {
      kind: "orderedList" as const,
      label: "Lista numerada",
      icon: "i-lucide-list-ordered",
    },
  ],
  [
    {
      type: "label" as const,
      label: "Inserir",
    },
    {
      kind: "blockquote" as const,
      label: "Citação",
      icon: "i-lucide-text-quote",
    },
    {
      kind: "codeBlock" as const,
      label: "Bloco de código",
      icon: "i-lucide-square-code",
    },
    {
      kind: "horizontalRule" as const,
      label: "Linha horizontal",
      icon: "i-lucide-separator-horizontal",
    },
  ],
];

// ---------------------------------------------------------------------------
// Editor Events
// ---------------------------------------------------------------------------

function handleUpdate(value: string | object) {
  let content: EditorContent;

  if (typeof value === "string") {
    // HTML string — not expected for JSON mode, but handle gracefully
    content = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: value }] }],
    };
  } else {
    content = value as EditorContent;
  }

  isInternalUpdate = true;
  internalContent.value = content;
  store.updateContent(content);
  nextTick(() => { isInternalUpdate = false; });

  const stats = calculateStats(content);
  store.setStats(stats);
  emit("update:modelValue", content);
  emit("update:stats", stats);
}

function handleSelectionUpdate(props: any) {
  const cursor = getCursorPosition(props.editor);
  store.setCursorPosition(cursor);
  emit("update:cursor", { line: cursor.line, column: cursor.column, offset: cursor.offset });
}

function handleCreate(props: any) {
  const editor = props.editor;
  store.setLoading(false);

  const stats = calculateStats(editor.getJSON() as EditorContent);
  store.setStats(stats);
  emit("update:stats", stats);
}

const showToolbarComputed = computed(
  () => props.showToolbar && isToolbarVisible.value
);

// SSR-safe portal target for suggestion menus
const appendToBody = import.meta.client ? () => document.body : undefined;
</script>

<template>
  <div
    class="book-editor"
    :class="{
      'focus-mode': focusMode,
      'fullscreen-mode': isFullscreen,
    }"
  >
    <UEditor
      ref="editorRef"
      v-slot="{ editor }"
      v-model="internalContent"
      content-type="json"
      :placeholder="placeholder"
      :editable="!readOnly"
      :ui="{ base: 'p-8 sm:px-16 py-13.5' }"
      class="w-full flex-1"
      @update:model-value="handleUpdate"
      @selection-update="handleSelectionUpdate"
      @create="handleCreate"
    >
      <!-- Fixed Toolbar -->
      <EditorEditorToolbar
        v-if="showToolbarComputed"
        :editor="editor"
        :items="toolbarItems"
      />

      <!-- Bubble Toolbar (appears on text selection) -->
      <UEditorToolbar
        :editor="editor"
        :items="bubbleToolbarItems"
        layout="bubble"
        :should-show="({ editor: e, view }) => {
          const { selection } = e.state
          return view.hasFocus() && !selection.empty
        }"
      />

      <!-- Suggestion Menu (slash commands) -->
      <UEditorSuggestionMenu
        :editor="editor"
        :items="suggestionItems"
        :append-to="appendToBody"
      />

      <!-- Drag Handle -->
      <UEditorDragHandle :editor="editor" />

      <!-- Editor Area (the UEditor renders its own editable area) -->
      <div class="editor-area flex-1" />
    </UEditor>

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
