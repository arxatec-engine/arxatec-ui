import type { SpreadsheetCellFormat } from "../../types/editing";

export function assertSpreadsheetFormat(format: SpreadsheetCellFormat): void {
  if (
    format.fontSize !== undefined &&
    (!Number.isFinite(format.fontSize) ||
      format.fontSize < 6 ||
      format.fontSize > 96)
  )
    throw new Error("SPREADSHEET_FONT_SIZE_INVALID");
  if (
    format.fontName !== undefined &&
    (!format.fontName.trim() || format.fontName.length > 100)
  )
    throw new Error("SPREADSHEET_FONT_INVALID");
  if (
    format.indent !== undefined &&
    (!Number.isInteger(format.indent) ||
      format.indent < 0 ||
      format.indent > 20)
  )
    throw new Error("SPREADSHEET_INDENT_INVALID");
  if (
    format.numberFormat !== undefined &&
    (!format.numberFormat || format.numberFormat.length > 128)
  )
    throw new Error("SPREADSHEET_NUMBER_FORMAT_INVALID");
  for (const value of [format.color, format.fill, format.borderColor])
    if (value !== undefined && !/^#[a-f0-9]{6}$/i.test(value))
      throw new Error("SPREADSHEET_COLOR_INVALID");
}
