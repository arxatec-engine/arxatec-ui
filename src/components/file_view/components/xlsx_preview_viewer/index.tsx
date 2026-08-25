import { getFilePreviewKey } from "../../utilities/file_preview_key";
import { FileXlsxPreviewViewerContent } from "./components/file_xlsx_preview_viewer_content";
import type { FileXlsxPreviewViewerProps } from "./types";

export const FileXlsxPreviewViewer = ({
  file,
}: FileXlsxPreviewViewerProps) => (
  <FileXlsxPreviewViewerContent key={getFilePreviewKey(file)} file={file} />
);

export type { FileXlsxPreviewViewerProps } from "./types";
