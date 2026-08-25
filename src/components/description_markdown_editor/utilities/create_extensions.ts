import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

export const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    codeBlock: false,
    horizontalRule: false,
  }),
  Underline,
  Placeholder.configure({
    placeholder,
    emptyNodeClass: "is-description-editor-empty",
  }),
];
