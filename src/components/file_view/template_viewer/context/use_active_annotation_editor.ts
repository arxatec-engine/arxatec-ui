import { useContext } from "react";
import {
  ActiveAnnotationEditorContext,
  type ActiveAnnotationEditorContextValue,
} from "./active_annotation_editor_context";

export function useActiveAnnotationEditor(): ActiveAnnotationEditorContextValue {
  const ctx = useContext(ActiveAnnotationEditorContext);
  if (!ctx) {
    throw new Error(
      "useActiveAnnotationEditor debe usarse dentro de ActiveAnnotationEditorProvider",
    );
  }
  return ctx;
}
