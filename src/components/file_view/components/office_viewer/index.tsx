import { FileViewErrorState } from "../error_state";
import { useState } from "react";
import { useFileViewLoadingChange } from "../../hooks";
import { FileOfficeViewerContent } from "./components/file_office_viewer_content";
import type { FileOfficeViewerProps } from "./types";

export const FileOfficeViewer = ({
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  onDownload,
  onLoadingChange,
}: FileOfficeViewerProps) => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  useFileViewLoadingChange(
    !isError && (isPending || isContentLoading),
    onLoadingChange,
  );

  if (isPending) {
    return null;
  }

  if (isError || !url) return <FileViewErrorState />;

  return (
    <FileOfficeViewerContent
      key={url}
      url={url}
      fileName={fileName}
      mimeType={mimeType}
      onDownload={onDownload}
      onLoadingChange={setIsContentLoading}
    />
  );
};

export type { FileOfficeViewerProps } from "./types";
