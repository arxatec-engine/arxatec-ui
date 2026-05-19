import { useMemo } from "react";
import { LoadingState } from "../";
import { Document, Page, pdfjs } from "react-pdf";

interface Props {
  url: string;
  remountKey: number;
  pageNumber: number;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  numPages: number;
}

export const Content: React.FC<Props> = ({
  url,
  remountKey,
  pageNumber,
  scale,
  onLoadSuccess,
  onLoadError,
  numPages,
}) => {
  const options = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    [],
  );

  return (
    <div className="flex-1 overflow-auto p-6 flex justify-center muted h-full w-full bg-accent">
      <Document
        key={remountKey}
        file={url}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={<LoadingState />}
        options={options}
      >
        {numPages > 0 && (
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={<LoadingState />}
          />
        )}
      </Document>
    </div>
  );
};
