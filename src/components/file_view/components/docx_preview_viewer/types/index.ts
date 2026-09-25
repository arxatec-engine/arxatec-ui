import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileDocxPreviewViewerProps {
  file: File;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
