import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileSourceFileViewerProps {
  file: File;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
