import type { FileViewLoadingChangeHandler } from "../../../types";
import type { FileWordDocumentConverter } from "../../docx_preview_viewer/types";
import type { FileSpreadsheetConverter } from "../../xlsx_preview_viewer/types";

export interface FileOfficeViewerProps {
  className?: string;
  documentLabel?: string;
  url: string;
  fileName?: string;
  mimeType?: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
  convertToDocx?: FileWordDocumentConverter;
  convertToXlsx?: FileSpreadsheetConverter;
}
