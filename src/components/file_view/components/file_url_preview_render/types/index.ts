import type { FileViewLoadingChangeHandler } from "../../../types";
import type { FileWordDocumentConverter } from "../../docx_preview_viewer/types";
import type { FileSpreadsheetConverter } from "../../xlsx_preview_viewer/types";

export interface FileUrlPreviewRenderProps {
  className?: string;
  url: string;
  fileName: string;
  onLoadingChange?: FileViewLoadingChangeHandler;
  convertToDocx?: FileWordDocumentConverter;
  convertToXlsx?: FileSpreadsheetConverter;
}
