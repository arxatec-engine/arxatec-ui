import type { Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

export function createAnnotationEditorExtensions(
  placeholder = "Escribe aquí…",
): Extension[] {
  return [
    StarterKit.configure({
      heading: false,
      blockquote: false,
      horizontalRule: false,
      codeBlock: false,
      code: false,
      strike: false,
      link: false,
      underline: false,
    }),
    Placeholder.configure({
      placeholder,
      emptyNodeClass: "is-editor-empty",
      includeChildren: false,
    }),
    TextStyle,
    FontFamily,
    FontSize,
    Underline,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
  ] as Extension[];
}
