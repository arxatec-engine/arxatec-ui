import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileAudioPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
