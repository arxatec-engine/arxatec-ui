import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileOfficeViewerProps {
  url: string;
  fileName?: string;
  mimeType?: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
