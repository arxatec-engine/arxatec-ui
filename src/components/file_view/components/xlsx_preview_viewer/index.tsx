import { FileXlsxPreviewViewerContent } from "./components/file_xlsx_preview_viewer_content";
import type { FileXlsxPreviewViewerProps } from "./types";

export const FileXlsxPreviewViewer = ({
  className,
  ...props
}: FileXlsxPreviewViewerProps) => (
  <FileXlsxPreviewViewerContent className={className} {...props} />
);

export type {
  FileXlsxPreviewViewerProps,
  FileSpreadsheetConverter,
  FileXlsxPreviewViewerLabels,
} from "./types";
