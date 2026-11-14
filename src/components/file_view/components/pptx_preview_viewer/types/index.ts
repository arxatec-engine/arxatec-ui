import type { ReactNode } from "react";

import type { FileViewLoadingChangeHandler } from "../../../types";

export type FilePptxPreviewViewerProps = {
  className?: string;
  labels?: Partial<FilePptxPreviewViewerLabels>;
  fileName?: string;
  mimeType?: string;
  isPending?: boolean;
  isError?: boolean;
  loadingOverlay?: ReactNode;
  onDownload?: () => void;
  onError?: (error: Error) => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
} & ({ file: File; url?: never } | { url: string; file?: never });

export interface FilePptxPreviewViewerLabels {
  toolbar: string;
  viewer: string;
  slide: string;
  of: string;
  hidden: string;
  thumbnails: string;
  previous: string;
  next: string;
  zoomOut: string;
  zoomIn: string;
  fit: string;
  hideThumbnails: string;
  showThumbnails: string;
  download: string;
  startPresentation: string;
  exitPresentation: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  downloadOriginal: string;
}

export interface PresentationNavigationProps {
  presentation: import("../utilities/presentation").Presentation;
  activeIndex: number;
  idPrefix: string;
  onSelect: (index: number) => void;
  labels: FilePptxPreviewViewerLabels;
  className?: string;
}
