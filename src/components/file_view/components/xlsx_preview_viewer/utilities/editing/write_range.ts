import type { Worksheet } from "exceljs";

import type { SpreadsheetMerge } from "../../types";
import {
  eachSpreadsheetCell,
  spreadsheetRangeContains,
  spreadsheetRangesIntersect,
} from "./range";

function position(address: string): { row: number; column: number } {
  const match = /^([A-Z]+)(\d+)$/i.exec(address);
  if (!match) throw new Error("SPREADSHEET_RANGE_INVALID");
  let column = 0;
  for (const letter of match[1].toUpperCase())
    column = column * 26 + letter.charCodeAt(0) - 64;
  return { row: Number(match[2]) - 1, column: column - 1 };
}

export function writeSpreadsheetMerge(
  sheet: Worksheet,
  range: SpreadsheetMerge,
  merge: boolean,
): void {
  const overlaps = (sheet.model.merges ?? []).filter((address) => {
    const [start, end = start] = address.split(":").map(position);
    return spreadsheetRangesIntersect(range, {
      startRow: start.row,
      endRow: end.row,
      startColumn: start.column,
      endColumn: end.column,
    });
  });
  for (const address of overlaps) {
    const [start, end = start] = address.split(":").map(position);
    if (
      !spreadsheetRangeContains(range, {
        startRow: start.row,
        endRow: end.row,
        startColumn: start.column,
        endColumn: end.column,
      })
    )
      throw new Error("SPREADSHEET_MERGE_PARTIAL");
  }
  if (merge)
    eachSpreadsheetCell(range, (row, column) => {
      const cell = sheet.getCell(row + 1, column + 1);
      if (
        (row !== range.startRow || column !== range.startColumn) &&
        !cell.isMerged &&
        cell.value !== null &&
        cell.value !== ""
      )
        throw new Error("SPREADSHEET_MERGE_HAS_VALUES");
      if (
        cell.isMerged &&
        (Number(cell.master.row) !== range.startRow + 1 ||
          Number(cell.master.col) !== range.startColumn + 1) &&
        cell.master.value !== null &&
        cell.master.value !== ""
      )
        throw new Error("SPREADSHEET_MERGE_HAS_VALUES");
    });
  for (const address of overlaps) sheet.unMergeCells(address);
  if (merge)
    sheet.mergeCells(
      range.startRow + 1,
      range.startColumn + 1,
      range.endRow + 1,
      range.endColumn + 1,
    );
}
