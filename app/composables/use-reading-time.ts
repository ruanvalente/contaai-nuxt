import { computed } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import { extractTextFromContent } from "~/utils/editor/editor-utils";

// =============================================================================
// useReadingTime - Reading Time Composable
// =============================================================================

const WORDS_PER_MINUTE = 200;
const SPEAKING_WORDS_PER_MINUTE = 150;

export function useReadingTime() {
  const store = useEditorStore();

  const readingTimeMinutes = computed(() => store.stats.readingTimeMinutes);
  const speakingTimeMinutes = computed(() => store.stats.speakingTimeMinutes);

  const formattedReadingTime = computed(() => {
    const minutes = readingTimeMinutes.value;
    if (minutes < 1) return "Menos de 1 min";
    if (minutes === 1) return "1 min de leitura";
    return `${Math.ceil(minutes)} min de leitura`;
  });

  const formattedSpeakingTime = computed(() => {
    const minutes = speakingTimeMinutes.value;
    if (minutes < 1) return "Menos de 1 min";
    if (minutes === 1) return "1 min de fala";
    return `${Math.ceil(minutes)} min de fala`;
  });

  function calculateReadingTime(wordCount: number): number {
    return wordCount / WORDS_PER_MINUTE;
  }

  function calculateSpeakingTime(wordCount: number): number {
    return wordCount / SPEAKING_WORDS_PER_MINUTE;
  }

  function calculateWordCountFromContent(content: any): number {
    const text = extractTextFromContent(content);
    if (!text || text.trim().length === 0) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  function calculateTimes(content: any): {
    reading: number;
    speaking: number;
  } {
    const wordCount = calculateWordCountFromContent(content);
    return {
      reading: calculateReadingTime(wordCount),
      speaking: calculateSpeakingTime(wordCount),
    };
  }

  return {
    readingTimeMinutes,
    speakingTimeMinutes,
    formattedReadingTime,
    formattedSpeakingTime,
    calculateReadingTime,
    calculateSpeakingTime,
    calculateTimes,
    WORDS_PER_MINUTE,
    SPEAKING_WORDS_PER_MINUTE,
  };
}
