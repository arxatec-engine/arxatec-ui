import type { CSSProperties, ReactNode } from "react";

import type { FileViewLoadingChangeHandler } from "../../../types";

export type FileSpreadsheetConverter = (
  file: File,
  options: { signal: AbortSignal },
) => Promise<Blob>;

export type FileXlsxPreviewViewerProps = {
  className?: string;
  labels?: Partial<FileXlsxPreviewViewerLabels>;
  fileName?: string;
  mimeType?: string;
  convertToXlsx?: FileSpreadsheetConverter;
  isPending?: boolean;
  isError?: boolean;
  loadingOverlay?: ReactNode;
  onDownload?: () => void | Promise<void>;
  onError?: (error: Error) => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
} & ({ file: File; url?: never } | { url: string; file?: never });

export interface SpreadsheetCell {
  text: string;
  style: CSSProperties;
  formula?: string;
  missingResult?: boolean;
}

export interface SpreadsheetAxis {
  size?: number;
  hidden?: boolean;
}

export interface SpreadsheetMerge {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
}

export interface SpreadsheetSheet {
  name: string;
  rowCount: number;
  columnCount: number;
  defaultRowHeight: number;
  defaultColumnWidth: number;
  rows: Record<number, SpreadsheetAxis>;
  columns: Record<number, SpreadsheetAxis>;
  cells: Record<string, SpreadsheetCell>;
  merges: SpreadsheetMerge[];
}

export interface SpreadsheetWorkbook {
  sheets: SpreadsheetSheet[];
  basic: boolean;
}

export interface SpreadsheetPosition {
  row: number;
  column: number;
}

export interface SpreadsheetSelection {
  anchor: SpreadsheetPosition;
  focus: SpreadsheetPosition;
}

export interface SpreadsheetGridAxis {
  indices: number[];
  sizes: number[];
  offsets: number[];
  total: number;
}

export type SpreadsheetWorkerRequest = {
  buffer: ArrayBuffer;
  format: "xls" | "xlsx";
};

export type SpreadsheetWorkerResult =
  | { workbook: SpreadsheetWorkbook; error?: never }
  | { error: string; workbook?: never };

export interface FileXlsxPreviewViewerLabels {
  toolbar: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  download: string;
  basicView: string;
  emptyTitle: string;
  emptyDescription: string;
  sheets: string;
  zoomOut: string;
  zoomIn: string;
  copy: string;
  copyShortcut: string;
  copied: string;
  copyError: string;
  missingResult: string;
  selectionHelp: string;
}

export interface SpreadsheetGridProps {
  sheet: SpreadsheetSheet;
  scale: number;
  selection: SpreadsheetSelection | null;
  onSelectionChange: (selection: SpreadsheetSelection | null) => void;
  onCopyResult: (message: string, success: boolean) => void;
  labels?: Partial<FileXlsxPreviewViewerLabels>;
  className?: string;
}

export interface SpreadsheetGridLayout {
  rows: SpreadsheetGridAxis;
  columns: SpreadsheetGridAxis;
  rowCount: number;
  columnCount: number;
  virtualRows: import("@tanstack/react-virtual").VirtualItem[];
  virtualColumns: import("@tanstack/react-virtual").VirtualItem[];
  visibleMerges: {
    merge: SpreadsheetMerge;
    rowIndex: number;
    left: number;
    width: number;
    height: number;
  }[];
  renderedRows: number[];
}

export interface SpreadsheetGridView {
  id: string;
  sheet: SpreadsheetSheet;
  scale: number;
  layout: SpreadsheetGridLayout;
  range: SpreadsheetMerge | null;
  activeRow?: number;
  activeColumn?: number;
  labels: FileXlsxPreviewViewerLabels;
}
