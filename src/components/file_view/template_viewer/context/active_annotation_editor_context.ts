import type { Editor } from "@tiptap/core";
import { createContext } from "react";

export type ActiveAnnotationEditorContextValue = {
  active: { id: string; editor: Editor } | null;
  registerEditor: (id: string, editor: Editor | null) => void;
};

export const ActiveAnnotationEditorContext =
  createContext<ActiveAnnotationEditorContextValue | null>(null);
