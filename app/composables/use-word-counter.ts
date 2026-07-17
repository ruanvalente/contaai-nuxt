import { computed } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import { extractTextFromContent } from "~/utils/editor/editor-utils";

// =============================================================================
// useWordCounter - Word Count Composable
// =============================================================================

export function useWordCounter() {
  const store = useEditorStore();

  const wordCount = computed(() => store.stats.words);

  const formattedWordCount = computed(() => {
    const count = wordCount.value;
    if (count === 1) return "1 palavra";
    return `${count.toLocaleString("pt-BR")} palavras`;
  });

  function countWords(text: string): number {
    if (!text || text.trim().length === 0) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  function calculateWordCount(content: any): number {
    const text = extractTextFromContent(content);
    return countWords(text);
  }

  return {
    wordCount,
    formattedWordCount,
    countWords,
    calculateWordCount,
    extractTextFromContent,
  };
}
