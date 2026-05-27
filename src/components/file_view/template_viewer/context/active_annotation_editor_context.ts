import type { Editor } from "@tiptap/core";
import { createContext } from "react";
import type {
  FileAnnotation,
  FileAnnotationsSchema,
} from "../../types/annotations";

export type ActiveAnnotationEditorEntry = {
  id: string;
  editor: Editor;
  font_size: number;
  font_family: string;
  patchAnnotation: (patch: Partial<FileAnnotation>) => void;
};

export type ActiveAnnotationEditorContextValue = {
  active: ActiveAnnotationEditorEntry | null;
  registerEditor: (
    id: string,
    editor: Editor | null,
    meta?: Omit<ActiveAnnotationEditorEntry, "id" | "editor"> | null,
  ) => void;
  getActiveEditorHtml: () => string | null;
  registerActiveEditorHtmlSource: (fn: (() => string) | null) => void;
  prepareSchemaForPersist: (
    schema: FileAnnotationsSchema,
    selectedId: string | null,
  ) => FileAnnotationsSchema;
};

export const ActiveAnnotationEditorContext =
  createContext<ActiveAnnotationEditorContextValue | null>(null);
