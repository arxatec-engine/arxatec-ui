export interface SheetData {
  name: string;
  rows: string[][];
}

export interface FileXlsxPreviewViewerProps {
  file: File;
  onLoadingChange?: FileViewLoadingChangeHandler;
}
import type { FileViewLoadingChangeHandler } from "../../../types";
