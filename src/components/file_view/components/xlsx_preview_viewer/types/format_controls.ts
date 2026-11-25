import type { SpreadsheetCellFormat, SpreadsheetEditorLabels } from "./editing";

export interface SpreadsheetFormatControlsProps {
  currencyFormat?: string;
  className?: string;
  format: SpreadsheetCellFormat;
  labels: SpreadsheetEditorLabels;
  onChange: (format: SpreadsheetCellFormat) => void;
}
