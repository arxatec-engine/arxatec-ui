import { useEffect, useState } from "react";

import { Button } from "@/components/button";
import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../../../hooks";
import { useFilePreviewDownload } from "../../../../hooks/use_file_preview_download";
import { FileViewLoadingState } from "../../../loading_state";
import { FileViewErrorState } from "../../../error_state";
import { DocumentOutline, type DocumentOutlineItem } from "../../../document_outline";
import { getWordHeadingLevel } from "../../../document_outline/utilities/word_headings";
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
  const [outline, setOutline] = useState<DocumentOutlineItem[]>([]);
  useEffect(() => {
    if (loading || error) return;
    const nodes = Array.from(
      hostRef.current?.shadowRoot?.querySelectorAll<HTMLElement>(
        "h1, h2, h3, h4, h5, h6, p[class]",
      ) ?? [],
    )
      .map((node) => ({
        node,
        title: node.textContent?.trim(),
        level: getWordHeadingLevel(node),
      }))
      .filter(
        (entry): entry is { node: HTMLElement; title: string; level: number } =>
          Boolean(entry.title) && entry.level !== null,
      );
    const levels = [...new Set(nodes.map(({ level }) => level))].sort(
      (a, b) => a - b,
    );
    const nextOutline = nodes.map(({ node, title, level }) => ({
      title,
      level: levels.indexOf(level),
      position: () =>
        node.getBoundingClientRect().top -
        (viewportRef.current?.getBoundingClientRect().top ?? 0),
      navigate: () => node.scrollIntoView({ block: "start", behavior: "smooth" }),
    }));
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setOutline(nextOutline);
    });
    return () => {
      cancelled = true;
    };
  }, [loading, error, hostRef, viewportRef, attempt]);
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
      {!loading && !error && <DocumentOutline items={outline} />}
      {loading && (
        <div className="absolute inset-0 bg-background">
          {props.loadingOverlay ?? <FileViewLoadingState />}
        </div>
      )}
      {error && (
        <FileViewErrorState
          className="absolute inset-0"
          title={labels.errorTitle}
          description={labels.errorDescription}
          actions={
            <>
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
            </>
          }
        />
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
