import { Button } from "@/components/button";
import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../../../hooks";
import { useFilePreviewDownload } from "../../../../hooks/use_file_preview_download";
import { FileViewLoadingState } from "../../../loading_state";
import { FileViewErrorState } from "../../../error_state";
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
        <FileViewErrorState
          title={labels.errorTitle}
          description={
            props.labels?.errorDescription ??
            (error instanceof Error ? error.message : labels.errorDescription)
          }
          actions={
            <>
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
            </>
          }
        />
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
