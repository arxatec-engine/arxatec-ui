import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileVideoPlayerLabels {
  toolbar: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  volume: string;
  progress: string;
  fullscreen: string;
  exitFullscreen: string;
  download: string;
  playbackError: string;
  downloadError: string;
  fullscreenError: string;
  errorTitle: string;
  errorDescription: string;
}

export interface FileVideoPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
  onLoadingChange?: FileViewLoadingChangeHandler;
  labels?: Partial<FileVideoPlayerLabels>;
  className?: string;
}
