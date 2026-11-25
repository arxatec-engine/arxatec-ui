import { forwardRef, useImperativeHandle } from "react";

import { Button } from "@/components/button";
import { cn } from "@/utilities/class";

import { FileViewErrorState } from "../../../error_state";
import { FileViewLoadingState } from "../../../loading_state";
import { SpreadsheetEditingContext } from "../../contexts/editing";
import { useSpreadsheetEditor } from "../../hooks/use_spreadsheet_editor";
import type {
  FileXlsxDocumentEditorProps,
  SpreadsheetEditorHandle,
} from "../../types/editing";
import { SpreadsheetWorkspace } from "../workspace";

type Props = Omit<FileXlsxDocumentEditorProps, "ref">;

export const FileXlsxDocumentEditorContent = forwardRef<
  SpreadsheetEditorHandle,
  Props
>((props, ref) => {
  const editor = useSpreadsheetEditor(props);
  useImperativeHandle(ref, () => editor.handle);
  return (
    <div
      ref={editor.containerRef}
      data-slot="file-xlsx-document-editor"
      className={cn("flex h-full min-h-0 flex-1 flex-col", props.className)}
    >
      {editor.error ? (
        <FileViewErrorState
          title={editor.labels.errorTitle}
          description={editor.labels.unsupported}
          actions={
            <Button variant="outline" onClick={editor.retry}>
              {editor.labels.retry}
            </Button>
          }
        />
      ) : !editor.workbook ? (
        <FileViewLoadingState />
      ) : (
        <SpreadsheetEditingContext.Provider value={editor.controller}>
          {editor.editError && (
            <p
              role="alert"
              className="shrink-0 px-3 py-1 text-sm text-destructive"
            >
              {editor.labels.editError}
            </p>
          )}
          {editor.workbook.calculationPending && (
            <p
              role="status"
              className="shrink-0 px-3 py-1 text-xs text-muted-foreground"
            >
              {editor.labels.calculationPending}
            </p>
          )}
          <SpreadsheetWorkspace
            workbook={editor.workbook}
            labels={editor.labels}
            onDownload={() => undefined}
          />
        </SpreadsheetEditingContext.Provider>
      )}
    </div>
  );
});
