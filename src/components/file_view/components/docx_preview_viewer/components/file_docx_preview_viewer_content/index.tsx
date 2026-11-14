import { useState } from "react";
import { FileX } from "lucide-react";

import { Button } from "@/components/button";
import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { StatusMessage } from "@/components/status_message";
import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../../../hooks";
import { useFilePreviewDownload } from "../../../../hooks/use_file_preview_download";
import { FileViewLoadingState } from "../../../loading_state";
import { WORD_DOCUMENT_LABELS } from "../../constants/labels";
import { useWordDocument } from "../../hooks/use_word_document";
import { useWordDocumentViewport } from "../../hooks/use_word_document_viewport";
import type { FileDocxPreviewViewerProps } from "../../types";
import { Toolbar } from "../toolbar";

export const FileDocxPreviewViewerContent = (
  props: FileDocxPreviewViewerProps,
) => {
  const { hostRef, source, loading, error, displayName, attempt, retry } =
    useWordDocument(props);
  const { viewportRef, dimensions, fit } = useWordDocumentViewport(
    hostRef,
    loading,
    error,
    source,
    attempt,
  );
  const [zoom, setZoom] = useState(1);
  const scale = fit * zoom;
  const labels = { ...WORD_DOCUMENT_LABELS, ...props.labels };
  const download = useFilePreviewDownload({ ...props, fileName: displayName });
  useFileViewLoadingChange(loading, props.onLoadingChange);
  return (
    <div
      data-slot="file-docx-preview-viewer"
      className={cn(
        "relative h-full min-h-0 w-full bg-background",
        props.className,
      )}
      aria-busy={loading}
    >
      <ScrollArea
        viewportRef={viewportRef}
        className="h-full w-full overflow-hidden"
        style={{ visibility: loading || error ? "hidden" : undefined }}
      >
        <div className="min-w-full pb-16">
          <div
            className="relative mx-auto"
            style={{
              width: dimensions.width
                ? dimensions.width * scale
                : "max-content",
              height: dimensions.height ? dimensions.height * scale : undefined,
            }}
          >
            <div
              ref={hostRef}
              data-slot="word-document-pages"
              data-document-preview="docx"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {loading && (
        <div className="absolute inset-0 bg-background">
          {props.loadingOverlay ?? <FileViewLoadingState />}
        </div>
      )}
      {error && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background p-6"
          role="alert"
        >
          <StatusMessage
            title={labels.errorTitle}
            description={labels.errorDescription}
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
            <Button variant="outline" onClick={download} disabled={!source}>
              {labels.downloadOriginal}
            </Button>
          </div>
        </div>
      )}
      {!loading && !error && (
        <Toolbar
          labels={labels}
          scale={zoom}
          onZoomIn={() => setZoom((value) => Math.min(value + 0.2, 3))}
          onZoomOut={() => setZoom((value) => Math.max(value - 0.2, 0.5))}
          onDownload={download}
        />
      )}
    </div>
  );
};
