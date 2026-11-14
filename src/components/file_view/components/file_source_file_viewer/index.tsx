import { getFilePreviewKey } from "../../utilities/file_preview_key";
import { downloadFromUrl } from "../../utilities/download_from_url";
import { FileSourceFileViewerContent } from "./components/file_source_file_viewer_content";
import type { FileSourceFileViewerProps } from "./types";

export const FileSourceFileViewer = ({
  file,
  className,
  onLoadingChange,
  onDownload,
  ...props
}: FileSourceFileViewerProps) => {
  const download = async () => {
    const url = URL.createObjectURL(file);
    try {
      await downloadFromUrl(url, file.name);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <FileSourceFileViewerContent
      className={className}
      key={getFilePreviewKey(file)}
      file={file}
      onLoadingChange={onLoadingChange}
      onDownload={onDownload ?? download}
      {...props}
    />
  );
};

export type { FileSourceFileViewerProps } from "./types";
