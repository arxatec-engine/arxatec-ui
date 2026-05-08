import { Editor } from "@tiptap/core";
import type { JSONContent } from "@tiptap/core";
import { createRichTextEditorImportExtensions } from "./editor_extensions";

export function htmlToTiptapJson(html: string): JSONContent {
  const editor = new Editor({
    extensions: createRichTextEditorImportExtensions(),
    content: html,
    editable: false,
  });

  try {
    return editor.getJSON();
  } finally {
    editor.destroy();
  }
}
