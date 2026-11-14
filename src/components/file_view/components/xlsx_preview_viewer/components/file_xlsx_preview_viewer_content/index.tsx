import { FileX } from "lucide-react";

import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";
import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../../../hooks";
import { useFilePreviewDownload } from "../../../../hooks/use_file_preview_download";
import { FileViewLoadingState } from "../../../loading_state";
import { SPREADSHEET_LABELS } from "../../constants/labels";
import { useSpreadsheetWorkbook } from "../../hooks/use_spreadsheet_workbook";
import type { FileXlsxPreviewViewerProps } from "../../types";
import { SpreadsheetWorkspace } from "../workspace";

export const FileXlsxPreviewViewerContent = (
  props: FileXlsxPreviewViewerProps,
) => {
  const { displayName, source, error, loading, workbook, retry } =
    useSpreadsheetWorkbook(props);
  const labels = { ...SPREADSHEET_LABELS, ...props.labels };
  const download = useFilePreviewDownload({ ...props, fileName: displayName });
  useFileViewLoadingChange(loading, props.onLoadingChange);
  return (
    <div
      data-slot="file-xlsx-preview-viewer"
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col bg-background",
        props.className,
      )}
      data-spreadsheet-preview
      aria-busy={loading}
    >
      {loading && (
        <div className="absolute inset-0 bg-background">
          {props.loadingOverlay ?? <FileViewLoadingState />}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="flex h-full flex-col items-center justify-center gap-4 p-6"
        >
          <StatusMessage
            title={labels.errorTitle}
            description={
              props.labels?.errorDescription ??
              (error instanceof Error ? error.message : labels.errorDescription)
            }
            icon={FileX}
            classNameCard="flex-col items-center text-center"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={retry}
              disabled={props.isPending || props.isError || !source}
            >
              {labels.retry}
            </Button>
            <Button
              variant="outline"
              onClick={() => void download()}
              disabled={!source}
            >
              {labels.download}
            </Button>
          </div>
        </div>
      )}
      {!loading && !error && workbook && (
        <SpreadsheetWorkspace
          workbook={workbook}
          labels={labels}
          onDownload={download}
        />
      )}
    </div>
  );
};
