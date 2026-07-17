import type { EditorContent, ExportOptions } from "~/types/editor";

// =============================================================================
// Markdown Utilities - JSON to Markdown Conversion
// =============================================================================

/**
 * Convert ProseMirror JSON content to Markdown
 */
export function convertToMarkdown(content: EditorContent): string {
  if (!content || !content.content) return "";

  const lines: string[] = [];

  for (const node of content.content) {
    const markdown = convertNodeToMarkdown(node);
    if (markdown !== null) {
      lines.push(markdown);
    }
  }

  return lines.join("\n\n");
}

function convertNodeToMarkdown(node: any): string | null {
  switch (node.type) {
    case "paragraph":
      return convertParagraph(node);

    case "heading":
      return convertHeading(node);

    case "bulletList":
      return convertBulletList(node);

    case "orderedList":
      return convertOrderedList(node);

    case "blockquote":
      return convertBlockquote(node);

    case "codeBlock":
      return convertCodeBlock(node);

    case "horizontalRule":
      return "---";

    default:
      return null;
  }
}

function convertParagraph(node: any): string {
  if (!node.content || node.content.length === 0) return "";
  return convertInlineContent(node.content);
}

function convertHeading(node: any): string {
  const level = node.attrs?.level || 1;
  const prefix = "#".repeat(level);
  const text = node.content ? convertInlineContent(node.content) : "";
  return `${prefix} ${text}`;
}

function convertBulletList(node: any): string {
  if (!node.content) return "";
  return node.content
    .map((item: any) => {
      const text = item.content
        ? item.content.map((p: any) => convertParagraph(p)).join("")
        : "";
      return `- ${text}`;
    })
    .join("\n");
}

function convertOrderedList(node: any): string {
  if (!node.content) return "";
  return node.content
    .map((item: any, index: number) => {
      const text = item.content
        ? item.content.map((p: any) => convertParagraph(p)).join("")
        : "";
      return `${index + 1}. ${text}`;
    })
    .join("\n");
}

function convertBlockquote(node: any): string {
  if (!node.content) return "";
  const text = node.content
    .map((p: any) => convertParagraph(p))
    .join("\n");
  return text
    .split("\n")
    .map((line: string) => `> ${line}`)
    .join("\n");
}

function convertCodeBlock(node: any): string {
  const language = node.attrs?.language || "";
  const code = node.content
    ? node.content.map((t: any) => t.text || "").join("")
    : "";
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

function convertInlineContent(content: any[]): string {
  return content
    .map((node) => convertInlineNode(node))
    .join("");
}

function convertInlineNode(node: any): string {
  if (node.type === "text") {
    let text = node.text || "";

    if (node.marks) {
      for (const mark of node.marks) {
        text = applyMark(text, mark);
      }
    }

    return text;
  }

  return "";
}

function applyMark(text: string, mark: any): string {
  switch (mark.type) {
    case "bold":
      return `**${text}**`;
    case "italic":
      return `*${text}*`;
    case "strike":
      return `~~${text}~~`;
    case "code":
      return `\`${text}\``;
    case "link":
      return `[${text}](${mark.attrs?.href || ""})`;
    default:
      return text;
  }
}
