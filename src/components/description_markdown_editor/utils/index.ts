import { marked } from "marked";

export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "";
  return marked.parse(markdown, {
    async: false,
    gfm: true,
    breaks: true,
  }) as string;
}

/**
 * Párrafos vacíos no sobreviven al ciclo HTML → turndown → marked.
 * Sustituirlos por ZWCSP permite round‑trip estable del markdown persistido.
 */
export function htmlForMarkdownExport(html: string): string {
  return html
    .replace(/<p><br\s+class="ProseMirror-trailingBreak"\s*\/?><\/p>/gi, "<p>\u200b</p>")
    .replace(/<p>(?:\s|<br\s*\/?>|&nbsp;)*<\/p>/gi, "<p>\u200b</p>");
}
