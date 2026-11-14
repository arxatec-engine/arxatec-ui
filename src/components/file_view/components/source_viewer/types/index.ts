import type { FileViewLoadingChangeHandler } from "../../../types";

export interface FileSourceViewerLabels {
  toolbar: string;
  zoomOut: string;
  zoomIn: string;
  wrapLines: string;
  copy: string;
  copied: string;
  copyError: string;
  download: string;
  downloadError: string;
  lines: string;
  errorTitle: string;
  errorDescription: string;
}

export interface FileSourceViewerProps {
  content?: string | null;
  mimeType: string;
  fileName: string;
  isPending?: boolean;
  isError?: boolean;
  onLoadingChange?: FileViewLoadingChangeHandler;
  onDownload?: () => void | Promise<void>;
  labels?: Partial<FileSourceViewerLabels>;
  className?: string;
}
