import { ErrorState } from "./components";
import { FilePdfViewerContent } from "./components/file_pdf_viewer_content";
import type { FilePdfViewerProps } from "./types";

export const FilePdfViewer = ({
  url,
  fileName,
  onDownload,
}: FilePdfViewerProps) => {
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

export type { FilePdfViewerProps } from "./types";
