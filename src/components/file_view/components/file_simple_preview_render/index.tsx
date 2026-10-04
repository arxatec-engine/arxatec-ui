import type { ComponentProps } from "react";
import { lazyFileViewer } from "../lazy_viewer";
import { FileBlobOfficeUnavailable } from "../blob_office_unavailable";
import { FileUnknownViewer } from "../unknown_viewer";
import { downloadFromUrl } from "../../utilities/download_from_url";
import { effectiveMimeFromFile } from "../../utilities/effective_mime_from_file";
import {
  CODE_FILE_EXTENSIONS,
  CODE_MIME_PREFIXES,
  DOCX_MIME,
  OFFICE_MIME_TYPES,
  XLSX_MIME,
  XLS_MIME,
} from "./constants";
import type { FileViewLoadingChangeHandler } from "../../types";

const FileAudioPlayer = lazyFileViewer<
  ComponentProps<typeof import("../audio_player").FileAudioPlayer>
>(() =>
  import("../audio_player").then((module) => ({
    default: module.FileAudioPlayer,
  })),
);
const FileDocxPreviewViewer = lazyFileViewer<
  ComponentProps<typeof import("../docx_preview_viewer").FileDocxPreviewViewer>
>(() =>
  import("../docx_preview_viewer").then((module) => ({
    default: module.FileDocxPreviewViewer,
  })),
);
const FileImageViewer = lazyFileViewer<
  ComponentProps<typeof import("../image_viewer").FileImageViewer>
>(() =>
  import("../image_viewer").then((module) => ({
    default: module.FileImageViewer,
  })),
);
const FilePdfViewer = lazyFileViewer<
  ComponentProps<typeof import("../pdf_viewer").FilePdfViewer>
>(() =>
  import("../pdf_viewer").then((module) => ({ default: module.FilePdfViewer })),
);
const FileSourceFileViewer = lazyFileViewer<
  ComponentProps<
    typeof import("../file_source_file_viewer").FileSourceFileViewer
  >
>(() =>
  import("../file_source_file_viewer").then((module) => ({
    default: module.FileSourceFileViewer,
  })),
);
const FileVideoPlayer = lazyFileViewer<
  ComponentProps<typeof import("../video_player").FileVideoPlayer>
>(() =>
  import("../video_player").then((module) => ({
    default: module.FileVideoPlayer,
  })),
);
const FileXlsxPreviewViewer = lazyFileViewer<
  ComponentProps<typeof import("../xlsx_preview_viewer").FileXlsxPreviewViewer>
>(() =>
  import("../xlsx_preview_viewer").then((module) => ({
    default: module.FileXlsxPreviewViewer,
  })),
);

export interface FileSimplePreviewRenderProps {
  file: File;
  url: string;
  onLoadingChange?: FileViewLoadingChangeHandler;
}

export const FileSimplePreviewRender = ({
  file,
  url,
  onLoadingChange,
}: FileSimplePreviewRenderProps) => {
  const mimeType = effectiveMimeFromFile(file);
  const download = () => downloadFromUrl(url, file.name);

  if (mimeType === "application/pdf") {
    return (
      <FilePdfViewer
        url={url}
        fileName={file.name}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (mimeType.startsWith("image/")) {
    return (
      <FileImageViewer
        url={url}
        mimeType={mimeType}
        fileId={url}
        fileName={file.name}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (mimeType.startsWith("video/")) {
    return (
      <FileVideoPlayer
        url={url}
        fileName={file.name}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <FileAudioPlayer
        url={url}
        fileName={file.name}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  const isCode =
    CODE_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix)) ||
    CODE_FILE_EXTENSIONS.test(file.name);

  if (isCode) {
    return (
      <FileSourceFileViewer file={file} onLoadingChange={onLoadingChange} />
    );
  }

  if (mimeType === DOCX_MIME) {
    return (
      <FileDocxPreviewViewer file={file} onLoadingChange={onLoadingChange} />
    );
  }

  if (mimeType === XLSX_MIME || mimeType === XLS_MIME) {
    return (
      <FileXlsxPreviewViewer file={file} onLoadingChange={onLoadingChange} />
    );
  }

  if ((OFFICE_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return <FileBlobOfficeUnavailable url={url} fileName={file.name} />;
  }

  return <FileUnknownViewer fileName={file.name} onDownload={download} />;
};
