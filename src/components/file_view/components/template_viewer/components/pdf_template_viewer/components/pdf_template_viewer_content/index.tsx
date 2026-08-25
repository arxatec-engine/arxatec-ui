import type { Props } from "../../types";
import { useMemo, useState, useCallback } from "react";
import { Document, pdfjs } from "react-pdf";
import { PdfTemplatePageRow } from "../../../pdf_template_page_row";
import { LoadingState, ErrorState } from "../../../../../pdf_viewer/components";

const PdfTemplateViewerContent = ({
  url,
  pageNumber,
  scale,
  pageWidthAtScale1,
  pageHeightAtScale1,
  annotations,
  annotationAssetUrls,
  selectedId,
  shapeDrawTool,
  createShapeLabel,
  onSelect,
  onClearSelection,
  onChangeTextAnnotation,
  onChangeShapeAnnotation,
  onShapeDrawToolChange,
  onDocumentPagesLoaded,
  scrollContainerRef,
  onPageViewportAtScaleOne,
}: Props) => {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    [],
  );

  const onLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      setError(null);
      onDocumentPagesLoaded?.(n);
    },
    [onDocumentPagesLoaded],
  );

  const onLoadError = useCallback((err: Error) => {
    console.error(err);
    setError("Error al cargar el documento PDF");
  }, []);

  const displayPage =
    numPages > 0 ? Math.min(Math.max(1, pageNumber), numPages) : 1;

  if (error) return <ErrorState />;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-accent">
      <div
        ref={scrollContainerRef}
        className="flex min-h-0 w-full flex-1 justify-center overflow-auto overscroll-contain p-6 pb-24"
        onPointerDownCapture={(e) => {
          const el = e.target as HTMLElement | null;
          if (!el?.closest) return;
          if (el.closest("[data-annotation-box]")) return;
          if (el.closest(".konvajs-content")) return;
          if (
            el.closest(
              ".moveable-control-box, .moveable-line, .moveable-control, .moveable-area, .moveable-padding",
            )
          ) {
            return;
          }
          onClearSelection();
        }}
      >
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<LoadingState />}
          options={options}
        >
          {numPages > 0 && (
            <PdfTemplatePageRow
              pageNumber={displayPage}
              scale={scale}
              pageWidthAtScale1={pageWidthAtScale1}
              pageHeightAtScale1={pageHeightAtScale1}
              annotations={annotations}
              annotationAssetUrls={annotationAssetUrls}
              selectedId={selectedId}
              shapeDrawTool={shapeDrawTool}
              createShapeLabel={createShapeLabel}
              onSelect={onSelect}
              onClearSelection={onClearSelection}
              onChangeText={onChangeTextAnnotation}
              onChangeShape={onChangeShapeAnnotation}
              onShapeDrawToolChange={onShapeDrawToolChange}
              onPageViewportAtScaleOne={onPageViewportAtScaleOne}
            />
          )}
        </Document>
      </div>
    </div>
  );
};

export { PdfTemplateViewerContent };
