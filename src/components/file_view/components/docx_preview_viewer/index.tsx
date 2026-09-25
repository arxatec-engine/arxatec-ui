import { getFilePreviewKey } from "../../utilities/file_preview_key";
import { FileDocxPreviewViewerContent } from "./components/file_docx_preview_viewer_content";
import type { FileDocxPreviewViewerProps } from "./types";

export const FileDocxPreviewViewer = ({
  file,
  onLoadingChange,
}: FileDocxPreviewViewerProps) => (
  <FileDocxPreviewViewerContent
    key={getFilePreviewKey(file)}
    file={file}
    onLoadingChange={onLoadingChange}
  />
);

export type { FileDocxPreviewViewerProps } from "./types";
