<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useWordCounter } from "~/composables/use-word-counter";
import { useCharacterCounter } from "~/composables/use-character-counter";
import { useReadingTime } from "~/composables/use-reading-time";

const store = useEditorStore();
const { formattedWordCount } = useWordCounter();
const { formattedCharacterCount } = useCharacterCounter();
const { formattedReadingTime, formattedSpeakingTime } = useReadingTime();

const cursorInfo = computed(() => {
  const pos = store.cursorPosition;
  return `Ln ${pos.line}, Col ${pos.column}`;
});

const formattedPages = computed(() => {
  const count = store.pageCount;
  if (count === 1) return "1 página";
  return `${count} páginas`;
});

const formattedSentences = computed(() => {
  const count = store.sentenceCount;
  if (count === 1) return "1 frase";
  return `${count} frases`;
});

const formattedParagraphs = computed(() => {
  const count = store.paragraphCount;
  if (count === 1) return "1 parágrafo";
  return `${count} parágrafos`;
});

const formattedCharNoSpaces = computed(() => {
  const count = store.stats.charactersNoSpaces;
  return `${count.toLocaleString("pt-BR")} sem espaços`;
});
</script>

<template>
  <div class="editor-status-bar border-t border-default px-4 py-2">
    <div class="flex items-center gap-4 text-xs text-muted-foreground">
      <!-- Word Count -->
      <span class="flex items-center gap-1" title="Palavras">
        <UIcon name="i-lucide-type" class="h-3 w-3" />
        {{ formattedWordCount }}
      </span>

      <!-- Character Count -->
      <span class="flex items-center gap-1" title="Caracteres (com espaços)">
        <UIcon name="i-lucide-hash" class="h-3 w-3" />
        {{ formattedCharacterCount }}
      </span>

      <!-- Character Count (no spaces) -->
      <span class="hidden sm:flex items-center gap-1" title="Caracteres (sem espaços)">
        <UIcon name="i-lucide-text-cursor-input" class="h-3 w-3" />
        {{ formattedCharNoSpaces }}
      </span>

      <!-- Separator -->
      <span class="hidden sm:inline text-border">|</span>

      <!-- Pages -->
      <span class="hidden sm:flex items-center gap-1" title="Páginas estimadas">
        <UIcon name="i-lucide-book-open" class="h-3 w-3" />
        {{ formattedPages }}
      </span>

      <!-- Sentences -->
      <span class="hidden md:flex items-center gap-1" title="Frases">
        <UIcon name="i-lucide-message-square" class="h-3 w-3" />
        {{ formattedSentences }}
      </span>

      <!-- Paragraphs -->
      <span class="hidden lg:flex items-center gap-1" title="Parágrafos">
        <UIcon name="i-lucide-align-left" class="h-3 w-3" />
        {{ formattedParagraphs }}
      </span>

      <!-- Separator -->
      <span class="hidden sm:inline text-border">|</span>

      <!-- Reading Time -->
      <span class="flex items-center gap-1" :title="`Leitura: ${formattedReadingTime}`">
        <UIcon name="i-lucide-clock" class="h-3 w-3" />
        {{ formattedReadingTime }}
      </span>

      <!-- Speaking Time -->
      <span class="hidden md:flex items-center gap-1" :title="`Fala: ${formattedSpeakingTime}`">
        <UIcon name="i-lucide-mic" class="h-3 w-3" />
        {{ formattedSpeakingTime }}
      </span>

      <div class="flex-1" />

      <!-- Cursor Position -->
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-text-cursor-input" class="h-3 w-3" />
        {{ cursorInfo }}
      </span>

      <!-- Save Status -->
      <EditorSaveStatus />
    </div>
  </div>
</template>
