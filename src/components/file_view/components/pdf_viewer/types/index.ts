import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FilePdfViewerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
