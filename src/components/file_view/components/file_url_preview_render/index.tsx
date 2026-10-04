import type { ComponentProps } from "react";
import { lazyFileViewer } from "../lazy_viewer";
import { FileUnknownViewer } from "../unknown_viewer";
import { downloadFromUrl } from "../../utilities/download_from_url";
import { getExtensionFromUrl } from "../../utilities/get_extension_from_url";
import { inferMimeFromFileName } from "../../utilities/infer_mime_from_file_name";
import { IMAGE_EXTENSIONS, OFFICE_EXTENSIONS } from "./constants";
import type { FileViewLoadingChangeHandler } from "../../types";

const FileImageViewer = lazyFileViewer<
  ComponentProps<typeof import("../image_viewer").FileImageViewer>
>(() =>
  import("../image_viewer").then((module) => ({
    default: module.FileImageViewer,
  })),
);
const FileOfficeViewer = lazyFileViewer<
  ComponentProps<typeof import("../office_viewer").FileOfficeViewer>
>(() =>
  import("../office_viewer").then((module) => ({
    default: module.FileOfficeViewer,
  })),
);
const FilePdfViewer = lazyFileViewer<
  ComponentProps<typeof import("../pdf_viewer").FilePdfViewer>
>(() =>
  import("../pdf_viewer").then((module) => ({ default: module.FilePdfViewer })),
);

export interface FileUrlPreviewRenderProps {
  url: string;
  fileName: string;
  onLoadingChange?: FileViewLoadingChangeHandler;
}

export const FileUrlPreviewRender = ({
  url,
  fileName,
  onLoadingChange,
}: FileUrlPreviewRenderProps) => {
  const ext = getExtensionFromUrl(url);
  const download = () => downloadFromUrl(url, fileName);

  if (ext === "pdf") {
    return (
      <FilePdfViewer
        url={url}
        fileName={fileName}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (IMAGE_EXTENSIONS.includes(ext)) {
    const mimeType = inferMimeFromFileName(fileName) ?? undefined;
    return (
      <FileImageViewer
        url={url}
        mimeType={mimeType}
        fileName={fileName}
        fileId={url}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (OFFICE_EXTENSIONS.includes(ext)) {
    return (
      <FileOfficeViewer
        url={url}
        fileName={fileName}
        mimeType={inferMimeFromFileName(fileName) ?? undefined}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  return <FileUnknownViewer fileName={fileName} onDownload={download} />;
};
