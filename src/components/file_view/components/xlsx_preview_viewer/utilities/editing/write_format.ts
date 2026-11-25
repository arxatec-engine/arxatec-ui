import type { Cell } from "exceljs";

import type { SpreadsheetCellFormat } from "../../types/editing";
import { assertSpreadsheetFormat } from "./validate_format";

function color(value: string) {
  if (!/^#[a-f0-9]{6}$/i.test(value))
    throw new Error("SPREADSHEET_COLOR_INVALID");
  return { argb: `FF${value.slice(1).toUpperCase()}` };
}

export function writeSpreadsheetFormat(
  cell: Cell,
  format: SpreadsheetCellFormat,
): void {
  assertSpreadsheetFormat(format);
  cell.style = structuredClone(cell.style);
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
  const font = { ...cell.font };
  if (format.fontName !== undefined) font.name = format.fontName;
  if (format.fontSize !== undefined) font.size = format.fontSize;
  for (const key of ["bold", "italic", "underline", "strike"] as const)
    if (format[key] !== undefined) font[key] = format[key];
  if (format.color !== undefined) font.color = color(format.color);
  cell.font = font;
  if (format.fill !== undefined)
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: color(format.fill),
    };
  const alignment = { ...cell.alignment };
  if (format.horizontal !== undefined) alignment.horizontal = format.horizontal;
  if (format.vertical !== undefined) alignment.vertical = format.vertical;
  if (format.wrap !== undefined) alignment.wrapText = format.wrap;
  if (format.indent !== undefined) {
    if (
      !Number.isInteger(format.indent) ||
      format.indent < 0 ||
      format.indent > 20
    )
      throw new Error("SPREADSHEET_INDENT_INVALID");
    alignment.indent = format.indent;
  }
  cell.alignment = alignment;
  if (format.numberFormat !== undefined) {
    if (!format.numberFormat || format.numberFormat.length > 128)
      throw new Error("SPREADSHEET_NUMBER_FORMAT_INVALID");
    cell.numFmt = format.numberFormat;
  }
  if (format.border !== undefined) {
    const border = { ...cell.border };
    for (const side of ["top", "bottom", "left", "right"] as const)
      border[side] =
        format.border === "none"
          ? {}
          : {
              style: format.border,
              color: color(format.borderColor ?? "#000000"),
            };
    cell.border = border;
  }
}
