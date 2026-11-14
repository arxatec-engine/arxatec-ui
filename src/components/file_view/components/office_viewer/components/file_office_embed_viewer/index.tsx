import { useState } from "react";

import { useFileViewLoadingChange } from "../../../../hooks";
import { FileViewErrorState } from "../../../error_state";
import { FileOfficeViewerContent } from "../file_office_viewer_content";
import type { FileOfficeViewerProps } from "../../types";

export const FileOfficeEmbedViewer = ({
  className,
  documentLabel,
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
    !isError && (isPending || (Boolean(url) && isContentLoading)),
    onLoadingChange,
  );

  if (isPending) {
    return null;
  }

  if (isError || !url) return <FileViewErrorState />;

  return (
    <FileOfficeViewerContent
      className={className}
      documentLabel={documentLabel}
      key={url}
      url={url}
      fileName={fileName}
      mimeType={mimeType}
      onDownload={onDownload}
      onLoadingChange={setIsContentLoading}
    />
  );
};
