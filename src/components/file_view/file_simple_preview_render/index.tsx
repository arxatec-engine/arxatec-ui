import { FileAudioPlayer } from "../audio_player";
import { FileBlobOfficeUnavailable } from "../blob_office_unavailable";
import { FileDocxPreviewViewer } from "../docx_preview_viewer";
import { FileImageViewer } from "../image_viewer";
import { FilePdfViewer } from "../pdf_viewer";
import { FileSourceFileViewer } from "../file_source_file_viewer";
import { FileUnknownViewer } from "../unknown_viewer";
import { FileVideoPlayer } from "../video_player";
import { FileXlsxPreviewViewer } from "../xlsx_preview_viewer";
import { downloadFromUrl } from "../utilities/download_from_url";
import { effectiveMimeFromFile } from "../utilities/effective_mime_from_file";

export interface FileSimplePreviewRenderProps {
  file: File;
  url: string;
}

const CODE_MIME_PREFIXES = [
  "text/",
  "application/javascript",
  "application/json",
  "application/xml",
  "application/typescript",
] as const;

const CODE_FILE_EXTENSIONS =
  /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|rb|go|rs|php|sql|sh|bash|md|json|yml|yaml|html|css)$/i;

const OFFICE_MIME_TYPES = [
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const;

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const XLS_MIME = "application/vnd.ms-excel";

export const FileSimplePreviewRender: React.FC<
  FileSimplePreviewRenderProps
> = ({ file, url }) => {
  const mimeType = effectiveMimeFromFile(file);
  const download = () => downloadFromUrl(url, file.name);

  if (mimeType === "application/pdf") {
    return (
      <FilePdfViewer url={url} fileName={file.name} onDownload={download} />
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
      />
    );
  }

  if (mimeType.startsWith("video/")) {
    return (
      <FileVideoPlayer url={url} fileName={file.name} onDownload={download} />
    );
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <FileAudioPlayer url={url} fileName={file.name} onDownload={download} />
    );
  }

  const isCode =
    CODE_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix)) ||
    CODE_FILE_EXTENSIONS.test(file.name);

  if (isCode) return <FileSourceFileViewer file={file} />;

  if (mimeType === DOCX_MIME) return <FileDocxPreviewViewer file={file} />;

  if (mimeType === XLSX_MIME || mimeType === XLS_MIME) {
    return <FileXlsxPreviewViewer file={file} />;
  }

  if ((OFFICE_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return <FileBlobOfficeUnavailable url={url} fileName={file.name} />;
  }

  return <FileUnknownViewer fileName={file.name} onDownload={download} />;
};
