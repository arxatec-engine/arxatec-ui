import type { FileWordDocumentConverter } from "../../docx_preview_viewer/types";
import type { FileSpreadsheetConverter } from "../../xlsx_preview_viewer/types";

export interface FilePublicPreviewRenderProps {
  className?: string;
  fileName: string;
  nativeDocumentMimeType?: string;
  mimeType?: string | null;
  objectUrl: string | null;
  signedUrl: string | null;
  onDownload?: () => void;
  convertToDocx?: FileWordDocumentConverter;
  convertToXlsx?: FileSpreadsheetConverter;
}
