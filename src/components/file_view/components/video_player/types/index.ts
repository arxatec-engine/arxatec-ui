export interface FileVideoPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
}
