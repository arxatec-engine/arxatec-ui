import { SPREADSHEET_LABELS } from "./labels";
import type { SpreadsheetEditorLabels } from "../types/editing";

export const SPREADSHEET_EDITOR_LIMITS = {
  rows: 20_000,
  columns: 512,
  cells: 100_000,
  operations: 5_000,
} as const;

export const SPREADSHEET_EDITOR_LABELS: SpreadsheetEditorLabels = {
  ...SPREADSHEET_LABELS,
  editCell: "Edit cell",
  formatting: "Cell formatting",
  font: "Font",
  fontSize: "Font size",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strike: "Strikethrough",
  textColor: "Text color",
  fillColor: "Fill color",
  alignment: "Alignment",
  left: "Left",
  center: "Center",
  right: "Right",
  top: "Top",
  middle: "Middle",
  bottom: "Bottom",
  wrap: "Wrap text",
  numberFormat: "Number format",
  general: "General",
  number: "Number",
  currency: "Currency",
  percent: "Percentage",
  date: "Date",
  borders: "Borders",
  none: "None",
  thin: "Thin",
  medium: "Medium",
  thick: "Thick",
  dotted: "Dotted",
  dashed: "Dashed",
  double: "Double",
  dimensions: "Dimensions",
  rowHeight: "Row height",
  columnWidth: "Column width",
  merge: "Merge cells",
  unmerge: "Unmerge cells",
  clear: "Clear values",
  apply: "Apply",
  calculationPending:
    "Formula results are pending recalculation in a compatible spreadsheet application.",
  editError: "This change could not be applied.",
  unsupported:
    "This workbook contains features that this editor cannot safely preserve.",
};

export const SPREADSHEET_FONTS = [
  "Arial",
  "Calibri",
  "Cambria",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Verdana",
];

export const SPREADSHEET_NUMBER_FORMATS = [
  { key: "general", value: "General" },
  { key: "number", value: "#,##0.00" },
  { key: "currency", value: '"$"#,##0.00' },
  { key: "percent", value: "0.00%" },
  { key: "date", value: "yyyy-mm-dd" },
] as const;
