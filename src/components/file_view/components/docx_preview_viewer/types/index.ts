import type { ReactNode } from "react";
import type { FileViewLoadingChangeHandler } from "../../../types";

export type FileWordDocumentConverter = (
  file: File,
  options: { signal: AbortSignal },
) => Promise<Blob>;

export type FileDocxPreviewViewerProps = {
  fileName?: string;
  mimeType?: string;
  isPending?: boolean;
  isError?: boolean;
  convertToDocx?: FileWordDocumentConverter;
  loadingOverlay?: ReactNode;
  onDownload?: () => void;
  onError?: (error: Error) => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
} & ({ file: File; url?: never } | { url: string; file?: never });
