import type { Editor } from "@tiptap/core";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ActiveAnnotationEditorContext } from "./active_annotation_editor_context";

type Entry = { id: string; editor: Editor };

export function ActiveAnnotationEditorProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Entry | null>(null);

  const registerEditor = useCallback((id: string, editor: Editor | null) => {
    setActive((prev) => {
      if (editor) return { id, editor };
      if (prev?.id === id) return null;
      return prev;
    });
  }, []);

  const value = useMemo(() => ({ active, registerEditor }), [active, registerEditor]);

  return (
    <ActiveAnnotationEditorContext.Provider value={value}>
      {children}
    </ActiveAnnotationEditorContext.Provider>
  );
}
