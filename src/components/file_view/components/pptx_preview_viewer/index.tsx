import { Button } from "@/components/button";
import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../hooks";
import { useFilePreviewDownload } from "../../hooks/use_file_preview_download";
import { FileViewLoadingState } from "../loading_state";
import { FileViewErrorState } from "../error_state";
import { PresentationContent } from "./components/content";
import { PRESENTATION_LABELS } from "./constants/labels";
import { usePresentationDocument } from "./hooks/use_presentation_document";
import type { FilePptxPreviewViewerProps } from "./types";

export const FilePptxPreviewViewer = (props: FilePptxPreviewViewerProps) => {
  const { displayName, presentation, error, loading, fail, setPainted, retry } =
    usePresentationDocument(props);
  const labels = { ...PRESENTATION_LABELS, ...props.labels };
  const download = useFilePreviewDownload({ ...props, fileName: displayName });
  useFileViewLoadingChange(loading, props.onLoadingChange);
  return (
    <div
      className={cn(
        "relative h-full min-h-0 w-full bg-background",
        props.className,
      )}
      data-slot="file-pptx-preview-viewer"
      data-document-preview="pptx"
      aria-busy={loading}
    >
      {presentation && !error && (
        <PresentationContent
          labels={labels}
          presentation={presentation}
          onReady={() => setPainted(presentation)}
          onError={fail}
          onDownload={download}
        />
      )}
      {loading && (
        <div className="absolute inset-0 z-40 bg-background">
          {props.loadingOverlay ?? <FileViewLoadingState />}
        </div>
      )}
      {error && (
        <FileViewErrorState
          className="absolute inset-0"
          title={labels.errorTitle}
          description={labels.errorDescription}
          actions={
            <Button
              variant="outline"
              size="sm"
              disabled={
                props.isPending || props.isError || (!props.file && !props.url)
              }
              onClick={retry}
            >
              {labels.retry}
            </Button>
          }
        />
      )}
    </div>
  );
};

export type {
  FilePptxPreviewViewerProps,
  FilePptxPreviewViewerLabels,
} from "./types";
