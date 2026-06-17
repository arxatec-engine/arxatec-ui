import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import React, { useState } from "react";
import { pdfjs } from "react-pdf";
import { toast } from "sonner";
import { downloadFileFromUrl } from "@/utilities/download";
import { ErrorState, Toolbar, Content, ErrorBoundary } from "./components";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface FilePdfViewerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
}

const FilePdfViewerContent: React.FC<FilePdfViewerProps> = ({
  url,
  fileName,
  onDownload,
}) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({
    numPages: totalPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(totalPages);
    setError(null);
  };

  const onDocumentLoadError = (loadError: Error) => {
    console.error("Error loading PDF:", loadError);
    setError("Error al cargar el documento PDF");
  };

  const handlePreviousPage = () =>
    setPageNumber((prev) => Math.max(prev - 1, 1));

  const handleNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));

  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const handleDownloadFile = async () => {
    try {
      if (onDownload) {
        await onDownload();
        return;
      }
      await downloadFileFromUrl(url, fileName);
    } catch (downloadError) {
      console.error(downloadError);
      toast.error("Error al descargar el archivo");
    }
  };

  if (error) return <ErrorState />;

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col h-full w-full bg-background">
        <Content
          url={url}
          remountKey={0}
          pageNumber={pageNumber}
          scale={scale}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          numPages={numPages}
        />
        <Toolbar
          scale={scale}
          pageNumber={pageNumber}
          numPages={numPages}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onPrevPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onDownload={handleDownloadFile}
        />
      </div>
    </ErrorBoundary>
  );
};

export const FilePdfViewer: React.FC<FilePdfViewerProps> = ({
  url,
  fileName,
  onDownload,
}) => {
  if (!url) return <ErrorState />;

  return (
    <FilePdfViewerContent
      key={url}
      url={url}
      fileName={fileName}
      onDownload={onDownload}
    />
  );
};
