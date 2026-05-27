import type { Editor } from "@tiptap/core";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import type { FileAnnotationsSchema } from "../../types/annotations";
import {
  ActiveAnnotationEditorContext,
  type ActiveAnnotationEditorEntry,
} from "./active_annotation_editor_context";

export function ActiveAnnotationEditorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [active, setActive] = useState<ActiveAnnotationEditorEntry | null>(
    null,
  );
  const activeEditorHtmlSourceRef = useRef<(() => string) | null>(null);

  const registerActiveEditorHtmlSource = useCallback(
    (fn: (() => string) | null) => {
      activeEditorHtmlSourceRef.current = fn;
    },
    [],
  );

  const getActiveEditorHtml = useCallback(
    () => activeEditorHtmlSourceRef.current?.() ?? null,
    [],
  );

  const prepareSchemaForPersist = useCallback(
    (schema: FileAnnotationsSchema, selectedId: string | null) => {
      const html = activeEditorHtmlSourceRef.current?.();
      if (!html || !selectedId) return schema;
      return {
        annotations: schema.annotations.map((a) =>
          a.id === selectedId ? { ...a, content_html: html } : a,
        ),
      };
    },
    [],
  );

  const registerEditor = useCallback(
    (
      id: string,
      editor: Editor | null,
      meta?: Omit<ActiveAnnotationEditorEntry, "id" | "editor"> | null,
    ) => {
      setActive((prev) => {
        if (editor && meta) {
          return { id, editor, ...meta };
        }
        if (prev?.id === id) return null;
        return prev;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      active,
      registerEditor,
      getActiveEditorHtml,
      registerActiveEditorHtmlSource,
      prepareSchemaForPersist,
    }),
    [
      active,
      registerEditor,
      getActiveEditorHtml,
      registerActiveEditorHtmlSource,
      prepareSchemaForPersist,
    ],
  );

  return (
    <ActiveAnnotationEditorContext.Provider value={value}>
      {children}
    </ActiveAnnotationEditorContext.Provider>
  );
}
