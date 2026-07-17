import type { EditorContent, EditorStats, CursorPosition } from "~/types/editor";
import { DEFAULT_STATS } from "~/types/editor";

// =============================================================================
// Editor Utilities
// =============================================================================

/**
 * Extract plain text from ProseMirror JSON content
 */
export function extractTextFromContent(content: EditorContent): string {
  if (!content || !content.content) return "";

  const texts: string[] = [];

  function traverse(node: any) {
    if (node.text) {
      texts.push(node.text);
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  content.content.forEach(traverse);
  return texts.join(" ");
}

/**
 * Calculate all editor statistics from content
 */
export function calculateStats(content: EditorContent): EditorStats {
  const text = extractTextFromContent(content);

  if (!text || text.trim().length === 0) {
    return { ...DEFAULT_STATS };
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    .length;

  const paragraphs = content.content?.filter(
    (node) => node.type === "paragraph"
  ).length || 0;

  const readingTimeMinutes = words / 200;
  const speakingTimeMinutes = words / 150;

  const pages = Math.max(1, Math.ceil(words / 250));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    pages,
  };
}

/**
 * Format a number with locale-specific separators
 */
export function formatNumber(num: number, locale: string = "pt-BR"): string {
  return num.toLocaleString(locale);
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "Menos de 1 min";
  if (minutes === 1) return "1 min";
  return `${Math.ceil(minutes)} min`;
}

/**
 * Get cursor position from ProseMirror editor
 */
export function getCursorPosition(editor: any): CursorPosition {
  if (!editor || !editor.state) {
    return { line: 1, column: 1, offset: 0 };
  }

  const { from } = editor.state.selection;
  const doc = editor.state.doc;

  let line = 1;
  let column = 1;
  let currentOffset = 0;

  doc.descendants((node: any, pos: number) => {
    if (pos >= from) return false;

    if (node.isBlock && pos > 0) {
      line++;
      column = 1;
    }

    if (node.isText) {
      const textLength = node.text?.length || 0;
      if (pos + textLength <= from) {
        column += textLength;
        currentOffset = pos + textLength;
      } else {
        column += from - pos;
        currentOffset = from;
        return false;
      }
    }

    return true;
  });

  return { line, column, offset: from };
}

/**
 * Validate editor content structure
 */
export function validateContent(content: any): boolean {
  if (!content) return false;
  if (content.type !== "doc") return false;
  if (!Array.isArray(content.content)) return false;
  return true;
}

/**
 * Create empty editor content
 */
export function createEmptyContent(): EditorContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [],
      },
    ],
  };
}

/**
 * Sanitize content for safe HTML rendering
 */
export function sanitizeHTML(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
