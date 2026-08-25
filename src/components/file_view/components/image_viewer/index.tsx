
import { FileImageViewerContent } from "./components/file_image_viewer_content";
import type { FileImageViewerProps } from "./types";

export const FileImageViewer = ({
  url,
  mimeType,
  fileId,
  fileName,
  isPending = false,
  isError = false,
  onDownload,
}: FileImageViewerProps) => {
  const sessionKey = `${fileId ?? "preview"}-${url ?? "empty"}`;

  return (
    <FileImageViewerContent
      key={sessionKey}
      url={url}
      mimeType={mimeType}
      fileId={fileId}
      fileName={fileName}
      isPending={isPending}
      isError={isError}
      onDownload={onDownload}
    />
  );
};

export type { FileImageViewerProps } from "./types";
