import { getFilePreviewKey } from "../../utilities/file_preview_key";
import { FileSourceFileViewerContent } from "./components/file_source_file_viewer_content";
import type { FileSourceFileViewerProps } from "./types";

export const FileSourceFileViewer = ({
  file,
}: FileSourceFileViewerProps) => <FileSourceFileViewerContent key={getFilePreviewKey(file)} file={file} />;

export type { FileSourceFileViewerProps } from "./types";
