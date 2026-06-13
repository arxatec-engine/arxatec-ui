import { FileViewerFloatingBar } from "@/components/file_view/shared";

interface Props {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  pdfPageCount: number;
  activePdfPage: number;
  onPdfPrevPage: () => void;
  onPdfNextPage: () => void;
  onFitWidth: () => void;
  onDownloadAnnotated: () => void;
  isBusy: boolean;
  hasAnnotations: boolean;
}

export const TemplateFloatingBar: React.FC<Props> = ({
  scale,
  onZoomIn,
  onZoomOut,
  pdfPageCount,
  activePdfPage,
  onPdfPrevPage,
  onPdfNextPage,
  onFitWidth,
  onDownloadAnnotated,
  isBusy,
  hasAnnotations,
}) => (
  <FileViewerFloatingBar
    scale={scale}
    onZoomIn={onZoomIn}
    onZoomOut={onZoomOut}
    pageNumber={activePdfPage}
    pageCount={pdfPageCount}
    onPrevPage={onPdfPrevPage}
    onNextPage={onPdfNextPage}
    onFitWidth={onFitWidth}
    onDownload={onDownloadAnnotated}
    downloadLabel="Descargar PDF con anotaciones"
    downloadDisabled={!hasAnnotations || isBusy}
    ariaLabel="Controles del visor de plantilla"
  />
);
