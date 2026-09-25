import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileVideoPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
