import type { FileViewLoadingChangeHandler } from "../../../types";
import type { FileWordDocumentConverter } from "../../docx_preview_viewer/types";

export interface FileOfficeViewerProps {
  url: string;
  fileName?: string;
  mimeType?: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
  convertToDocx?: FileWordDocumentConverter;
}
