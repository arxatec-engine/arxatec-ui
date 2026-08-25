import { FileViewErrorState } from "../error_state";
import { FileViewLoadingState } from "../loading_state";
import { FileOfficeViewerContent } from "./components/file_office_viewer_content";
import type { FileOfficeViewerProps } from "./types";

export const FileOfficeViewer = ({
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  onDownload,
}: FileOfficeViewerProps) => {
  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FileViewLoadingState />
      </div>
    );
  }

  if (isError || !url) return <FileViewErrorState />;

  return (
    <FileOfficeViewerContent
      key={url}
      url={url}
      fileName={fileName}
      mimeType={mimeType}
      onDownload={onDownload}
    />
  );
};

export type { FileOfficeViewerProps } from "./types";
