import type { Ref } from "react";

import type { FileXlsxPreviewViewerLabels, SpreadsheetMerge } from ".";

export interface SpreadsheetCellFormat {
  fontName?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  fill?: string;
  horizontal?: "left" | "center" | "right" | "justify";
  vertical?: "top" | "middle" | "bottom";
  wrap?: boolean;
  indent?: number;
  numberFormat?: string;
  border?:
    "none" | "thin" | "medium" | "thick" | "dotted" | "dashed" | "double";
  borderColor?: string;
}

export type SpreadsheetEdit =
  | { kind: "cell"; sheet: string; row: number; column: number; input: string }
  | { kind: "clear"; sheet: string; range: SpreadsheetMerge }
  | {
      kind: "format";
      sheet: string;
      range: SpreadsheetMerge;
      format: SpreadsheetCellFormat;
    }
  | {
      kind: "dimension";
      sheet: string;
      axis: "row" | "column";
      index: number;
      size: number;
    }
  | { kind: "merge"; sheet: string; range: SpreadsheetMerge; merge: boolean }
  | {
      kind: "paste";
      sheet: string;
      row: number;
      column: number;
      values: string[][];
    };

export interface SpreadsheetEditorHandle {
  save: () => Promise<Uint8Array<ArrayBuffer>>;
  getRevision: () => number | null;
  focus: () => void;
}

export interface SpreadsheetEditorLabels extends FileXlsxPreviewViewerLabels {
  editCell: string;
  formatting: string;
  font: string;
  fontSize: string;
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  textColor: string;
  fillColor: string;
  alignment: string;
  left: string;
  center: string;
  right: string;
  top: string;
  middle: string;
  bottom: string;
  wrap: string;
  numberFormat: string;
  general: string;
  number: string;
  currency: string;
  percent: string;
  date: string;
  borders: string;
  none: string;
  thin: string;
  medium: string;
  thick: string;
  dotted: string;
  dashed: string;
  double: string;
  dimensions: string;
  rowHeight: string;
  columnWidth: string;
  merge: string;
  unmerge: string;
  clear: string;
  apply: string;
  calculationPending: string;
  editError: string;
  unsupported: string;
}

export interface FileXlsxDocumentEditorProps {
  file: File;
  className?: string;
  labels?: Partial<SpreadsheetEditorLabels>;
  currencyFormat?: string;
  ref?: Ref<SpreadsheetEditorHandle>;
  onReady?: (ready: boolean) => void;
  onChange?: (revision: number) => void;
  onError?: (error: Error) => void;
}
