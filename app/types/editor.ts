// =============================================================================
// Editor Types - Book Editor Module
// =============================================================================

// -----------------------------------------------------------------------------
// Document & Chapter Types
// -----------------------------------------------------------------------------

export interface BookDocument {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  category?: string;
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface Chapter {
  id: string;
  documentId: string;
  title: string;
  content: EditorContent;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Editor Content (ProseMirror JSON Format)
// -----------------------------------------------------------------------------

export interface EditorContent {
  type: "doc";
  content: EditorNode[];
}

export type EditorNode =
  | ParagraphNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode
  | BlockquoteNode
  | CodeBlockNode
  | HorizontalRuleNode;

export interface ParagraphNode {
  type: "paragraph";
  content?: InlineNode[];
  attrs?: { level?: number; textAlign?: string };
}

export interface HeadingNode {
  type: "heading";
  content?: InlineNode[];
  attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 };
}

export interface BulletListNode {
  type: "bulletList";
  content: ListItemNode[];
}

export interface OrderedListNode {
  type: "orderedList";
  content: ListItemNode[];
  attrs?: { order?: number };
}

export interface ListItemNode {
  type: "listItem";
  content: ParagraphNode[];
}

export interface BlockquoteNode {
  type: "blockquote";
  content: ParagraphNode[];
}

export interface CodeBlockNode {
  type: "codeBlock";
  content?: TextNode[];
  attrs?: { language?: string };
}

export interface HorizontalRuleNode {
  type: "horizontalRule";
}

// -----------------------------------------------------------------------------
// Inline Content Types
// -----------------------------------------------------------------------------

export type InlineNode = TextNode | MentionNode;

export interface TextNode {
  type: "text";
  text: string;
  marks?: Mark[];
}

export interface MentionNode {
  type: "mention";
  attrs: { id: string; label: string };
}

export type Mark =
  | BoldMark
  | ItalicMark
  | UnderlineMark
  | StrikeMark
  | CodeMark
  | LinkMark
  | HighlightMark;

export interface BoldMark {
  type: "bold";
}

export interface ItalicMark {
  type: "italic";
}

export interface UnderlineMark {
  type: "underline";
}

export interface StrikeMark {
  type: "strike";
}

export interface CodeMark {
  type: "code";
}

export interface LinkMark {
  type: "link";
  attrs: { href: string; target?: string; rel?: string };
}

export interface HighlightMark {
  type: "highlight";
  attrs?: { color?: string };
}

// -----------------------------------------------------------------------------
// Version History Types
// -----------------------------------------------------------------------------

export interface Version {
  id: string;
  chapterId: string;
  documentId: string;
  content: EditorContent;
  label?: string;
  wordCount?: number;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface VersionDiff {
  added: DiffSegment[];
  removed: DiffSegment[];
  unchanged: DiffSegment[];
}

export interface DiffSegment {
  type: "text" | "heading" | "list" | "blockquote" | "code";
  content: string;
  marks?: Mark[];
}

// -----------------------------------------------------------------------------
// Editor Statistics Types
// -----------------------------------------------------------------------------

export interface EditorStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  pages: number;
}

export interface CursorPosition {
  line: number;
  column: number;
  offset: number;
}

// -----------------------------------------------------------------------------
// Save Status Types
// -----------------------------------------------------------------------------

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface SaveResult {
  success: boolean;
  savedAt?: Date;
  error?: string;
}

// -----------------------------------------------------------------------------
// Editor State Types
// -----------------------------------------------------------------------------

export interface EditorState {
  document: BookDocument | null;
  activeChapter: Chapter | null;
  content: EditorContent;
  stats: EditorStats;
  cursorPosition: CursorPosition;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

// -----------------------------------------------------------------------------
// Editor Configuration Types
// -----------------------------------------------------------------------------

export interface EditorConfig {
  autosaveDelay: number;
  autosaveEnabled: boolean;
  focusMode: boolean;
  spellcheck: boolean;
  readOnly: boolean;
  maxLength?: number;
  placeholder?: string;
}

// -----------------------------------------------------------------------------
// Export Types
// -----------------------------------------------------------------------------

export type ExportFormat = "markdown" | "pdf" | "html" | "txt";

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeMetadata: boolean;
  pageSize?: "A4" | "A5" | "Letter" | "Legal";
  margins?: ExportMargins;
  font?: string;
  fontSize?: number;
  header?: string;
  footer?: string;
}

export interface ExportMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}

// -----------------------------------------------------------------------------
// Chapter CRUD Types
// -----------------------------------------------------------------------------

export interface CreateChapterInput {
  documentId: string;
  title: string;
  content?: EditorContent;
  order?: number;
}

export interface UpdateChapterInput {
  id: string;
  title?: string;
  content?: EditorContent;
  order?: number;
}

export interface ReorderChaptersInput {
  chapterIds: string[];
  documentId: string;
}

// -----------------------------------------------------------------------------
// Focus Mode Types
// -----------------------------------------------------------------------------

export interface FocusModeState {
  enabled: boolean;
  sidebarVisible: boolean;
  toolbarVisible: boolean;
  statusBarVisible: boolean;
}

// -----------------------------------------------------------------------------
// Fullscreen Types
// -----------------------------------------------------------------------------

export interface FullscreenState {
  isFullscreen: boolean;
  isSupported: boolean;
}

// -----------------------------------------------------------------------------
// Default Values
// -----------------------------------------------------------------------------

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  autosaveDelay: 3000,
  autosaveEnabled: true,
  focusMode: false,
  spellcheck: true,
  readOnly: false,
  placeholder: "Comece a escrever...",
};

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: "pdf",
  includeMetadata: true,
  pageSize: "A4",
  margins: { top: 2.5, right: 2.5, bottom: 2.5, left: 2.5 },
  font: "Inter",
  fontSize: 12,
};

export const DEFAULT_STATS: EditorStats = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  readingTimeMinutes: 0,
  speakingTimeMinutes: 0,
  pages: 0,
};

export const EMPTY_EDITOR_CONTENT: EditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};
