export interface FileAudioPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
}
