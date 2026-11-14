import type { FileSimplePreviewRenderProps as Props } from "../../types";
import {
  FileAudioPlayer,
  FileDocxPreviewViewer,
  FileImageViewer,
  FilePdfViewer,
  FileSourceFileViewer,
  FileVideoPlayer,
  FileXlsxPreviewViewer,
  FilePptxPreviewViewer,
} from "../.././constants/lazy_viewers";
import { FileBlobOfficeUnavailable } from "../../../blob_office_unavailable";
import { FileUnknownViewer } from "../../../unknown_viewer";
import { downloadFromUrl } from "../../../../utilities/download_from_url";
import { effectiveMimeFromFile } from "../../../../utilities/effective_mime_from_file";
import {
  CODE_FILE_EXTENSIONS,
  CODE_MIME_PREFIXES,
  OFFICE_MIME_TYPES,
} from "../.././constants";
import { resolveSpreadsheetFormat } from "../../../../utilities/spreadsheet_format";
import { resolvePresentationFormat } from "../../../../utilities/presentation_format";
import { resolveWordDocumentFormat } from "../../../../utilities/word_document_format";

export const FileSimplePreviewRenderContent = ({
  file,
  url,
  onLoadingChange,
  convertToDocx,
  convertToXlsx,
}: Props) => {
  const mimeType = effectiveMimeFromFile(file);
  const download = () => downloadFromUrl(url, file.name);

  if (resolvePresentationFormat(file.name, mimeType)) {
    return (
      <FilePptxPreviewViewer
        file={file}
        onLoadingChange={onLoadingChange}
        onDownload={download}
      />
    );
  }

  if (resolveSpreadsheetFormat(file.name, mimeType)) {
    return (
      <FileXlsxPreviewViewer
        file={file}
        onLoadingChange={onLoadingChange}
        onDownload={download}
        convertToXlsx={convertToXlsx}
      />
    );
  }

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

  if (resolveWordDocumentFormat(file.name, mimeType)) {
    return (
      <FileDocxPreviewViewer
        file={file}
        convertToDocx={convertToDocx}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if ((OFFICE_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return <FileBlobOfficeUnavailable url={url} fileName={file.name} />;
  }

  return <FileUnknownViewer fileName={file.name} onDownload={download} />;
};
