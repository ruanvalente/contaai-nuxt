import type { EditorContent, ExportOptions } from "~/types/editor";
import { DEFAULT_EXPORT_OPTIONS } from "~/types/editor";

// =============================================================================
// PDF Utilities - JSON to PDF Conversion
// =============================================================================

/**
 * Convert ProseMirror JSON content to HTML for PDF generation
 */
export function convertToHTML(content: EditorContent): string {
  if (!content || !content.content) return "<div></div>";

  const elements = content.content
    .map((node) => convertNodeToHTML(node))
    .filter(Boolean)
    .join("\n");

  return `<div class="editor-content">${elements}</div>`;
}

function convertNodeToHTML(node: any): string {
  switch (node.type) {
    case "paragraph":
      return convertParagraphToHTML(node);

    case "heading":
      return convertHeadingToHTML(node);

    case "bulletList":
      return convertBulletListToHTML(node);

    case "orderedList":
      return convertOrderedListToHTML(node);

    case "blockquote":
      return convertBlockquoteToHTML(node);

    case "codeBlock":
      return convertCodeBlockToHTML(node);

    case "horizontalRule":
      return "<hr />";

    default:
      return "";
  }
}

function convertParagraphToHTML(node: any): string {
  const content = node.content ? convertInlineContentToHTML(node.content) : "";
  const textAlign = node.attrs?.textAlign
    ? ` style="text-align: ${node.attrs.textAlign}"`
    : "";
  return `<p${textAlign}>${content}</p>`;
}

function convertHeadingToHTML(node: any): string {
  const level = node.attrs?.level || 1;
  const content = node.content ? convertInlineContentToHTML(node.content) : "";
  return `<h${level}>${content}</h${level}>`;
}

function convertBulletListToHTML(node: any): string {
  if (!node.content) return "<ul></ul>";
  const items = node.content
    .map((item: any) => {
      const content = item.content
        ? item.content.map((p: any) => convertParagraphToHTML(p)).join("")
        : "";
      return `  <li>${content}</li>`;
    })
    .join("\n");
  return `<ul>\n${items}\n</ul>`;
}

function convertOrderedListToHTML(node: any): string {
  if (!node.content) return "<ol></ol>";
  const items = node.content
    .map((item: any) => {
      const content = item.content
        ? item.content.map((p: any) => convertParagraphToHTML(p)).join("")
        : "";
      return `  <li>${content}</li>`;
    })
    .join("\n");
  return `<ol>\n${items}\n</ol>`;
}

function convertBlockquoteToHTML(node: any): string {
  if (!node.content) return "<blockquote></blockquote>";
  const content = node.content
    .map((p: any) => convertParagraphToHTML(p))
    .join("\n");
  return `<blockquote>\n${content}\n</blockquote>`;
}

function convertCodeBlockToHTML(node: any): string {
  const language = node.attrs?.language || "";
  const code = node.content
    ? node.content.map((t: any) => t.text || "").join("")
    : "";
  return `<pre><code class="language-${language}">${escapeHTML(code)}</code></pre>`;
}

function convertInlineContentToHTML(content: any[]): string {
  return content.map((node) => convertInlineNodeToHTML(node)).join("");
}

function convertInlineNodeToHTML(node: any): string {
  if (node.type === "text") {
    let text = escapeHTML(node.text || "");

    if (node.marks) {
      for (const mark of node.marks) {
        text = applyMarkToHTML(text, mark);
      }
    }

    return text;
  }

  return "";
}

function applyMarkToHTML(text: string, mark: any): string {
  switch (mark.type) {
    case "bold":
      return `<strong>${text}</strong>`;
    case "italic":
      return `<em>${text}</em>`;
    case "underline":
      return `<u>${text}</u>`;
    case "strike":
      return `<s>${text}</s>`;
    case "code":
      return `<code>${text}</code>`;
    case "link":
      return `<a href="${mark.attrs?.href || "#"}" target="_blank">${text}</a>`;
    case "highlight":
      return `<mark>${text}</mark>`;
    default:
      return text;
  }
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate a complete HTML document for PDF export
 */
export function generateFullHTML(
  content: EditorContent,
  options: Partial<ExportOptions> = {}
): string {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const bodyHTML = convertToHTML(content);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.filename || "Documento"}</title>
  <style>
    @page {
      size: ${opts.pageSize || "A4"};
      margin: ${opts.margins?.top || 2.5}cm ${opts.margins?.right || 2.5}cm ${opts.margins?.bottom || 2.5}cm ${opts.margins?.left || 2.5}cm;
    }
    body {
      font-family: ${opts.font || "Inter"}, sans-serif;
      font-size: ${opts.fontSize || 12}pt;
      line-height: 1.6;
      color: #1a1a1a;
    }
    h1 { font-size: 2em; margin-top: 1.5em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.2em; margin-bottom: 0.4em; }
    h3 { font-size: 1.25em; margin-top: 1em; margin-bottom: 0.3em; }
    p { margin: 0.5em 0; }
    ul, ol { margin: 0.5em 0; padding-left: 2em; }
    li { margin: 0.25em 0; }
    blockquote {
      border-left: 3px solid #ccc;
      margin: 1em 0;
      padding: 0.5em 1em;
      color: #555;
      background: #f9f9f9;
    }
    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      background: #f0f0f0;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre code {
      background: none;
      padding: 0;
    }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 2em 0;
    }
    a { color: #4f46e5; text-decoration: none; }
    .editor-content { max-width: 100%; }
  </style>
</head>
<body>
${opts.header ? `<header>${opts.header}</header>` : ""}
${bodyHTML}
${opts.footer ? `<footer>${opts.footer}</footer>` : ""}
</body>
</html>`;
}
