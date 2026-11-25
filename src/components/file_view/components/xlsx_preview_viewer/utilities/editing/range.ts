import { SPREADSHEET_EDITOR_LIMITS } from "../../constants/editor";
import type { SpreadsheetMerge } from "../../types";

export function assertSpreadsheetRange(range: SpreadsheetMerge): void {
  const values = [
    range.startRow,
    range.endRow,
    range.startColumn,
    range.endColumn,
  ];
  if (
    values.some((value) => !Number.isInteger(value) || value < 0) ||
    range.endRow < range.startRow ||
    range.endColumn < range.startColumn ||
    range.endRow >= SPREADSHEET_EDITOR_LIMITS.rows ||
    range.endColumn >= SPREADSHEET_EDITOR_LIMITS.columns ||
    (range.endRow - range.startRow + 1) *
      (range.endColumn - range.startColumn + 1) >
      SPREADSHEET_EDITOR_LIMITS.cells
  )
    throw new Error("SPREADSHEET_RANGE_LIMIT");
}

export function spreadsheetRangesIntersect(
  a: SpreadsheetMerge,
  b: SpreadsheetMerge,
): boolean {
  return (
    a.startRow <= b.endRow &&
    a.endRow >= b.startRow &&
    a.startColumn <= b.endColumn &&
    a.endColumn >= b.startColumn
  );
}

export function spreadsheetRangeContains(
  a: SpreadsheetMerge,
  b: SpreadsheetMerge,
): boolean {
  return (
    a.startRow <= b.startRow &&
    a.endRow >= b.endRow &&
    a.startColumn <= b.startColumn &&
    a.endColumn >= b.endColumn
  );
}

export function eachSpreadsheetCell(
  range: SpreadsheetMerge,
  visit: (row: number, column: number) => void,
): void {
  assertSpreadsheetRange(range);
  for (let row = range.startRow; row <= range.endRow; row++)
    for (let column = range.startColumn; column <= range.endColumn; column++)
      visit(row, column);
}

export function parseSpreadsheetClipboard(text: string): string[][] {
  const rows: string[][] = [[]];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"' && (quoted || field === "")) {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index++;
      } else quoted = !quoted;
    } else if (
      !quoted &&
      (character === "\t" || character === "\n" || character === "\r")
    ) {
      rows[rows.length - 1].push(field);
      field = "";
      if (character !== "\t") {
        if (character === "\r" && text[index + 1] === "\n") index++;
        rows.push([]);
      }
    } else field += character;
    if (
      rows.length > SPREADSHEET_EDITOR_LIMITS.rows ||
      rows[rows.length - 1].length > SPREADSHEET_EDITOR_LIMITS.columns
    )
      throw new Error("SPREADSHEET_RANGE_LIMIT");
  }
  rows[rows.length - 1].push(field);
  if (
    quoted ||
    rows.some((row) => row.length > SPREADSHEET_EDITOR_LIMITS.columns)
  )
    throw new Error("SPREADSHEET_RANGE_LIMIT");
  if (rows.length > 1 && rows[rows.length - 1].length === 1 && field === "")
    rows.pop();
  return rows;
}
