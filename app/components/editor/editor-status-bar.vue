<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store";
import { useWordCounter } from "~/composables/use-word-counter";
import { useCharacterCounter } from "~/composables/use-character-counter";
import { useReadingTime } from "~/composables/use-reading-time";

const store = useEditorStore();
const { formattedWordCount } = useWordCounter();
const { formattedCharacterCount } = useCharacterCounter();
const { formattedReadingTime } = useReadingTime();
</script>

<template>
  <div class="editor-status-bar border-t border-default px-4 py-2">
    <div class="flex items-center gap-4 text-xs text-muted-foreground">
      <!-- Word Count -->
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-type" class="h-3 w-3" />
        {{ formattedWordCount }}
      </span>

      <!-- Character Count -->
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-hash" class="h-3 w-3" />
        {{ formattedCharacterCount }}
      </span>

      <!-- Reading Time -->
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-clock" class="h-3 w-3" />
        {{ formattedReadingTime }}
      </span>

      <div class="flex-1" />

      <!-- Save Status -->
      <EditorSaveStatus />
    </div>
  </div>
</template>
