export interface FileImageViewerProps {
  url: string | undefined;
  mimeType?: string;
  fileId?: string;
  fileName?: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void | Promise<void>;
}
