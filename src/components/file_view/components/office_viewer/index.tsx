import { FileOfficeEmbedViewer } from "./components/file_office_embed_viewer";
import {
  FileDocxPreviewViewer,
  FileXlsxPreviewViewer,
  FilePptxPreviewViewer,
} from "./constants/lazy_viewers";
import { getFileNameFromUrl } from "../../utilities/get_extension_from_url";
import { resolveWordDocumentFormat } from "../../utilities/word_document_format";
import { resolveSpreadsheetFormat } from "../../utilities/spreadsheet_format";
import { resolvePresentationFormat } from "../../utilities/presentation_format";
import type { FileOfficeViewerProps } from "./types";

export const FileOfficeViewer = (props: FileOfficeViewerProps) => {
  const name =
    props.fileName || (props.url ? getFileNameFromUrl(props.url) : undefined);
  const format = resolveWordDocumentFormat(name, props.mimeType);
  if (
    resolvePresentationFormat(name, props.mimeType) ||
    (!format &&
      !resolveSpreadsheetFormat(name, props.mimeType) &&
      resolvePresentationFormat(props.url))
  ) {
    return <FilePptxPreviewViewer {...props} fileName={name} />;
  }
  if (resolveSpreadsheetFormat(name, props.mimeType)) {
    return <FileXlsxPreviewViewer {...props} fileName={name} />;
  }
  if (format === "docx" || (format && props.convertToDocx)) {
    return <FileDocxPreviewViewer {...props} fileName={name} />;
  }
  return <FileOfficeEmbedViewer key={props.url} {...props} />;
};

export type { FileOfficeViewerProps } from "./types";
