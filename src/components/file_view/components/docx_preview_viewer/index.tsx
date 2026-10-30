import { FileDocxPreviewViewerContent } from "./components/file_docx_preview_viewer_content";
import type { FileDocxPreviewViewerProps } from "./types";

export const FileDocxPreviewViewer = (props: FileDocxPreviewViewerProps) => (
  <FileDocxPreviewViewerContent {...props} />
);

export type {
  FileDocxPreviewViewerProps,
  FileWordDocumentConverter,
} from "./types";
