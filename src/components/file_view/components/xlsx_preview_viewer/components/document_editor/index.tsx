import { forwardRef, lazy, Suspense } from "react";

import { FileViewLoadingState } from "../../../loading_state";
import type {
  FileXlsxDocumentEditorProps,
  SpreadsheetEditorHandle,
} from "../../types/editing";

const Editor = lazy(() =>
  import("../document_editor_content").then((module) => ({
    default: module.FileXlsxDocumentEditorContent,
  })),
);

export const FileXlsxDocumentEditor = forwardRef<
  SpreadsheetEditorHandle,
  Omit<FileXlsxDocumentEditorProps, "ref">
>((props, ref) => (
  <Suspense fallback={<FileViewLoadingState />}>
    <Editor {...props} ref={ref} />
  </Suspense>
));
