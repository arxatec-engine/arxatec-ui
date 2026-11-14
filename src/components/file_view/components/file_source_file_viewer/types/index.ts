import type { FileViewLoadingChangeHandler } from "../../../types";
import type { FileSourceViewerProps } from "../../source_viewer";

export interface FileSourceFileViewerProps extends Pick<
  FileSourceViewerProps,
  "labels" | "className" | "onDownload"
> {
  file: File;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
