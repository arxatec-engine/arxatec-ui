import type { FileUrlPreviewRenderProps as Props } from "../../types";
import {
  FileImageViewer,
  FileOfficeViewer,
  FilePdfViewer,
  FileXlsxPreviewViewer,
  FilePptxPreviewViewer,
} from "../.././constants/lazy_viewers";
import { FileUnknownViewer } from "../../../unknown_viewer";
import { downloadFromUrl } from "../../../../utilities/download_from_url";
import { getExtensionFromUrl } from "../../../../utilities/get_extension_from_url";
import { inferMimeFromFileName } from "../../../../utilities/infer_mime_from_file_name";
import { IMAGE_EXTENSIONS, OFFICE_EXTENSIONS } from "../.././constants";
import { resolveWordDocumentFormat } from "../../../../utilities/word_document_format";
import { resolveSpreadsheetFormat } from "../../../../utilities/spreadsheet_format";
import { resolvePresentationFormat } from "../../../../utilities/presentation_format";

export const FileUrlPreviewRenderContent = ({
  url,
  fileName,
  onLoadingChange,
  convertToDocx,
  convertToXlsx,
}: Props) => {
  const ext = getExtensionFromUrl(url);
  const download = () => downloadFromUrl(url, fileName);

  if (resolvePresentationFormat(fileName) || resolvePresentationFormat(url)) {
    return (
      <FilePptxPreviewViewer
        url={url}
        fileName={fileName}
        onDownload={download}
        onLoadingChange={onLoadingChange}
      />
    );
  }

  if (resolveSpreadsheetFormat(fileName) || resolveSpreadsheetFormat(url)) {
    return (
      <FileXlsxPreviewViewer
        url={url}
        fileName={fileName}
        onDownload={download}
        onLoadingChange={onLoadingChange}
        convertToXlsx={convertToXlsx}
      />
    );
  }

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

  if (OFFICE_EXTENSIONS.includes(ext) || resolveWordDocumentFormat(fileName)) {
    return (
      <FileOfficeViewer
        url={url}
        fileName={fileName}
        mimeType={inferMimeFromFileName(fileName) ?? undefined}
        onDownload={download}
        onLoadingChange={onLoadingChange}
        convertToDocx={convertToDocx}
        convertToXlsx={convertToXlsx}
      />
    );
  }

  return <FileUnknownViewer fileName={fileName} onDownload={download} />;
};
