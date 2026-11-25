import type {
  SpreadsheetCell,
  SpreadsheetMerge,
  SpreadsheetSheet,
  SpreadsheetWorkbook,
} from "../../types";
import type { SpreadsheetEdit } from "../../types/editing";
import {
  assertSpreadsheetRange,
  eachSpreadsheetCell,
  spreadsheetRangeContains,
  spreadsheetRangesIntersect,
} from "./range";
import { spreadsheetFormatStyle } from "./format";
import {
  parseSpreadsheetInput,
  spreadsheetInput,
  spreadsheetText,
} from "./value";
import { assertSpreadsheetFormat } from "./validate_format";
import { SPREADSHEET_EDITOR_LIMITS } from "../../constants/editor";

function changedCell(
  cell: SpreadsheetCell | undefined,
  input: string,
): SpreadsheetCell {
  const parsed = parseSpreadsheetInput(input);
  const format = { ...cell?.format };
  if (
    parsed.valueKind === "date" &&
    (!format.numberFormat || format.numberFormat === "General")
  )
    format.numberFormat = "yyyy-mm-dd";
  const next: SpreadsheetCell = {
    text: "",
    style: cell?.style ?? {},
    format,
    ...parsed,
  };
  next.text = spreadsheetText(next);
  return next;
}

function dataRange(
  edit: Exclude<SpreadsheetEdit, { kind: "dimension" }>,
): SpreadsheetMerge {
  if ("range" in edit) return edit.range;
  const rows = edit.kind === "paste" ? edit.values.length : 1;
  const columns =
    edit.kind === "paste"
      ? Math.max(0, ...edit.values.map((row) => row.length))
      : 1;
  return {
    startRow: edit.row,
    endRow: edit.row + rows - 1,
    startColumn: edit.column,
    endColumn: edit.column + columns - 1,
  };
}

function applySheetEdit(
  source: SpreadsheetSheet,
  edit: SpreadsheetEdit,
): SpreadsheetSheet {
  if (edit.kind === "dimension") {
    const limit = edit.axis === "row" ? 20_000 : 512;
    if (
      !Number.isInteger(edit.index) ||
      edit.index < 0 ||
      edit.index >= limit ||
      !Number.isFinite(edit.size) ||
      edit.size < 12 ||
      edit.size > 1200
    )
      throw new Error("SPREADSHEET_DIMENSION_INVALID");
    const key = edit.axis === "row" ? "rows" : "columns";
    return {
      ...source,
      [key]: {
        ...source[key],
        [edit.index]: { ...source[key][edit.index], size: edit.size },
      },
    };
  }
  const range = dataRange(edit);
  assertSpreadsheetRange(range);
  if (edit.kind === "format") assertSpreadsheetFormat(edit.format);
  if (
    edit.kind === "cell" &&
    spreadsheetInput(source.cells[`${edit.row}:${edit.column}`]) === edit.input
  )
    return source;
  const sheet = { ...source, cells: { ...source.cells } };
  const overlaps = source.merges.filter((merge) =>
    spreadsheetRangesIntersect(range, merge),
  );
  if (edit.kind === "merge") {
    if (
      overlaps.length === 1 &&
      JSON.stringify(overlaps[0]) === JSON.stringify(range) &&
      edit.merge
    )
      return source;
    if (overlaps.some((merge) => !spreadsheetRangeContains(range, merge)))
      throw new Error("SPREADSHEET_MERGE_PARTIAL");
    if (edit.merge)
      eachSpreadsheetCell(range, (row, column) => {
        if (
          (row !== range.startRow || column !== range.startColumn) &&
          sheet.cells[`${row}:${column}`]?.text
        )
          throw new Error("SPREADSHEET_MERGE_HAS_VALUES");
      });
    sheet.merges = [
      ...source.merges.filter(
        (merge) => !spreadsheetRangesIntersect(range, merge),
      ),
      ...(edit.merge ? [range] : []),
    ];
  } else {
    if (edit.kind === "paste" && overlaps.length > 0)
      throw new Error("SPREADSHEET_PASTE_MERGE");
    eachSpreadsheetCell(range, (row, column) => {
      const merge = overlaps.find(
        (item) =>
          row >= item.startRow &&
          row <= item.endRow &&
          column >= item.startColumn &&
          column <= item.endColumn,
      );
      if (
        merge &&
        edit.kind !== "format" &&
        (row !== merge.startRow || column !== merge.startColumn)
      )
        return;
      const key = `${row}:${column}`;
      const cell = sheet.cells[key];
      if (edit.kind === "format") {
        const format = { ...cell?.format, ...edit.format };
        const next = {
          ...(cell ?? { text: "", value: null }),
          format,
          style: { ...cell?.style, ...spreadsheetFormatStyle(format) },
        };
        next.text = spreadsheetText(next);
        sheet.cells[key] = next;
      } else {
        const input =
          edit.kind === "clear"
            ? ""
            : edit.kind === "cell"
              ? edit.input
              : (edit.values[row - range.startRow]?.[
                  column - range.startColumn
                ] ?? "");
        sheet.cells[key] = changedCell(cell, input);
      }
    });
  }
  sheet.rowCount = Math.max(source.rowCount, range.endRow + 1);
  sheet.columnCount = Math.max(source.columnCount, range.endColumn + 1);
  return sheet;
}

export function applySpreadsheetEdit(
  workbook: SpreadsheetWorkbook,
  edit: SpreadsheetEdit,
): SpreadsheetWorkbook {
  const index = workbook.sheets.findIndex((sheet) => sheet.name === edit.sheet);
  if (index < 0) throw new Error("SPREADSHEET_SHEET_MISSING");
  const changed = applySheetEdit(workbook.sheets[index], edit);
  if (changed === workbook.sheets[index]) return workbook;
  const sheets = workbook.sheets.map((sheet, position) =>
    position === index ? changed : sheet,
  );
  if (
    sheets.reduce(
      (count, sheet) => count + Object.keys(sheet.cells).length,
      0,
    ) > SPREADSHEET_EDITOR_LIMITS.cells
  )
    throw new Error("SPREADSHEET_WORKBOOK_LIMIT");
  const dataChanged = ["cell", "clear", "paste"].includes(edit.kind);
  let calculationPending = workbook.calculationPending;
  if (dataChanged)
    for (let position = 0; position < sheets.length; position++) {
      const cells = { ...sheets[position].cells };
      let invalidated = false;
      for (const [key, cell] of Object.entries(cells))
        if (cell.formula) {
          cells[key] = {
            ...cell,
            value: null,
            text: `=${cell.formula}`,
            missingResult: true,
          };
          invalidated = true;
        }
      if (invalidated) {
        sheets[position] = { ...sheets[position], cells };
        calculationPending = true;
      }
    }
  return { ...workbook, sheets, calculationPending };
}
