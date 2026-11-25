import type { SpreadsheetEdit, SpreadsheetEditorLabels } from "./editing";

export interface SpreadsheetEditorController {
  currencyFormat?: string;
  apply: (edit: SpreadsheetEdit) => boolean;
  registerDraft: (commit: (() => void) | null, dirty: boolean) => void;
  labels: SpreadsheetEditorLabels;
}

export interface SpreadsheetCellEditing {
  row: number;
  column: number;
  initialValue: string;
  originalValue: string;
  controller: SpreadsheetEditorController;
  close: (movement?: "next" | "down") => void;
}
