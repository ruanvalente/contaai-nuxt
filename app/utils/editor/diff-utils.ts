import type { EditorContent, DiffSegment } from "~/types/editor";

// =============================================================================
// Diff Utilities - Word-level diff for version comparison
// =============================================================================

interface WordEntry {
  word: string;
  blockType: string;
  marks: any[];
}

/**
 * Extract plain text words from ProseMirror JSON content with their block context
 */
function extractWords(content: EditorContent): WordEntry[] {
  if (!content?.content) return [];

  const result: WordEntry[] = [];

  for (const node of content.content) {
    const blockType = node.type;
    if ("content" in node && Array.isArray((node as any).content)) {
      extractFromNode((node as any).content, blockType, result);
    }
  }

  return result;
}

function extractFromNode(nodes: any[], blockType: string, result: WordEntry[]) {
  for (const node of nodes) {
    if (node.type === "text" && node.text) {
      const words = node.text.split(/(\s+)/);
      for (const w of words) {
        if (w.length > 0) {
          result.push({ word: w, blockType, marks: node.marks || [] });
        }
      }
    }
    if (node.content && Array.isArray(node.content)) {
      extractFromNode(node.content, blockType, result);
    }
  }
}

/**
 * Safe dp accessor
 */
function dpGet(dp: number[][], i: number, j: number): number {
  return dp[i]?.[j] ?? 0;
}

/**
 * Compute Longest Common Subsequence of two arrays of words
 */
function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dpGet(dp, i - 1, j - 1) + 1;
      } else {
        dp[i]![j] = Math.max(dpGet(dp, i - 1, j), dpGet(dp, i, j - 1));
      }
    }
  }

  return dp;
}

/**
 * Classify diff segments from LCS backtracking
 */
function classifySegments(
  oldStrings: string[],
  newStrings: string[],
  _oldWords: WordEntry[],
  _newWords: WordEntry[]
): { added: DiffSegment[]; removed: DiffSegment[]; unchanged: DiffSegment[] } {
  const added: DiffSegment[] = [];
  const removed: DiffSegment[] = [];
  const unchanged: DiffSegment[] = [];

  const dp = lcs(oldStrings, newStrings);
  let i = oldStrings.length;
  let j = newStrings.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldStrings[i - 1] === newStrings[j - 1]) {
      // Collect consecutive unchanged words
      let content = oldStrings[i - 1]!;
      i--;
      j--;
      while (i > 0 && j > 0 && oldStrings[i - 1] === newStrings[j - 1]) {
        content = oldStrings[i - 1]! + " " + content;
        i--;
        j--;
      }
      unchanged.unshift({ type: "text", content: content.trim() });
    } else if (j > 0 && (i === 0 || dpGet(dp, i, j - 1) >= dpGet(dp, i - 1, j))) {
      // Collect consecutive added words
      let content = newStrings[j - 1]!;
      j--;
      while (j > 0 && (i === 0 || dpGet(dp, i, j - 1) >= dpGet(dp, i - 1, j))) {
        if (i > 0 && oldStrings[i - 1] === newStrings[j]) break;
        content = newStrings[j]! + " " + content;
        j--;
      }
      added.unshift({ type: "text", content: content.trim() });
    } else if (i > 0) {
      // Collect consecutive removed words
      let content = oldStrings[i - 1]!;
      i--;
      while (i > 0 && (j === 0 || dpGet(dp, i, j - 1) < dpGet(dp, i - 1, j))) {
        if (j > 0 && oldStrings[i] === newStrings[j - 1]) break;
        content = oldStrings[i]! + " " + content;
        i--;
      }
      removed.unshift({ type: "text", content: content.trim() });
    }
  }

  return { added, removed, unchanged };
}

/**
 * Compute a word-level diff between two ProseMirror JSON contents
 */
export function computeDiff(
  oldContent: EditorContent,
  newContent: EditorContent
): { added: DiffSegment[]; removed: DiffSegment[]; unchanged: DiffSegment[] } {
  const oldWords = extractWords(oldContent);
  const newWords = extractWords(newContent);

  const oldStrings = oldWords.map((w) => w.word);
  const newStrings = newWords.map((w) => w.word);

  if (oldStrings.length === 0 && newStrings.length === 0) {
    return { added: [], removed: [], unchanged: [] };
  }

  return classifySegments(oldStrings, newStrings, oldWords, newWords);
}

/**
 * Extract plain text from ProseMirror content for display
 */
export function extractPlainText(content: EditorContent): string {
  if (!content?.content) return "";

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
