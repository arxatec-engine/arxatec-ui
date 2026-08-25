export interface FilePdfViewerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
}
