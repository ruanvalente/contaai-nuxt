import { computed } from "vue";
import { useEditorStore } from "~/stores/editor-store";
import { extractTextFromContent } from "~/utils/editor/editor-utils";

// =============================================================================
// useCharacterCounter - Character Count Composable
// =============================================================================

export function useCharacterCounter() {
  const store = useEditorStore();

  const characterCount = computed(() => store.stats.characters);
  const characterCountNoSpaces = computed(() => store.stats.charactersNoSpaces);

  const formattedCharacterCount = computed(() => {
    return `${characterCount.value.toLocaleString("pt-BR")} caracteres`;
  });

  function countCharacters(text: string, includeSpaces: boolean = true): number {
    if (!text) return 0;
    return includeSpaces ? text.length : text.replace(/\s/g, "").length;
  }

  function calculateCharacterCount(
    content: any
  ): { total: number; noSpaces: number } {
    const text = extractTextFromContent(content);
    return {
      total: countCharacters(text, true),
      noSpaces: countCharacters(text, false),
    };
  }

  return {
    characterCount,
    characterCountNoSpaces,
    formattedCharacterCount,
    countCharacters,
    calculateCharacterCount,
    extractTextFromContent,
  };
}
