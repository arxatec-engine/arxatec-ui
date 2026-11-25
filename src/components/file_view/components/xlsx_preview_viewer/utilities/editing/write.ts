import type { Cell, Workbook, Worksheet } from "exceljs";

import { SPREADSHEET_EDITOR_LIMITS } from "../../constants/editor";
import type { SpreadsheetEdit } from "../../types/editing";
import { SPREADSHEET_LIMITS } from "../constants";
import { parseSpreadsheetInput } from "./value";
import { assertEditableSpreadsheetWorkbook } from "./package";
import { assertSpreadsheetRange, eachSpreadsheetCell } from "./range";
import { writeSpreadsheetFormat } from "./write_format";
import { writeSpreadsheetMerge } from "./write_range";
import { assertEditableSpreadsheetXml } from "./validate_xml";
import { preserveSpreadsheetMetadata } from "./preserve";

function setCell(cell: Cell, input: string): void {
  const parsed = parseSpreadsheetInput(input);
  if (
    parsed.valueKind === "date" &&
    (!cell.numFmt || cell.numFmt === "General")
  ) {
    cell.style = structuredClone(cell.style);
    cell.numFmt = "yyyy-mm-dd";
  }
  cell.value = parsed.formula
    ? { formula: parsed.formula }
    : parsed.valueKind === "date"
      ? new Date(String(parsed.value))
      : (parsed.value ?? null);
}

function writeEdit(sheet: Worksheet, edit: SpreadsheetEdit): void {
  if (edit.kind === "dimension") {
    const limit =
      edit.axis === "row"
        ? SPREADSHEET_EDITOR_LIMITS.rows
        : SPREADSHEET_EDITOR_LIMITS.columns;
    if (
      !Number.isInteger(edit.index) ||
      edit.index < 0 ||
      edit.index >= limit ||
      !Number.isFinite(edit.size) ||
      edit.size < 12 ||
      edit.size > 1200
    )
      throw new Error("SPREADSHEET_DIMENSION_INVALID");
    if (edit.axis === "row")
      sheet.getRow(edit.index + 1).height = (edit.size * 3) / 4;
    else
      sheet.getColumn(edit.index + 1).width = Math.max(1, (edit.size - 5) / 7);
    return;
  }
  if (edit.kind === "cell") {
    assertSpreadsheetRange({
      startRow: edit.row,
      endRow: edit.row,
      startColumn: edit.column,
      endColumn: edit.column,
    });
    const cell = sheet.getCell(edit.row + 1, edit.column + 1);
    if (cell.isMerged && cell.master.address !== cell.address)
      throw new Error("SPREADSHEET_MERGE_COVERED");
    setCell(cell, edit.input);
    return;
  }
  const range =
    edit.kind === "paste"
      ? {
          startRow: edit.row,
          endRow: edit.row + edit.values.length - 1,
          startColumn: edit.column,
          endColumn:
            edit.column +
            Math.max(0, ...edit.values.map((row) => row.length)) -
            1,
        }
      : edit.range;
  assertSpreadsheetRange(range);
  if (edit.kind === "merge") {
    writeSpreadsheetMerge(sheet, range, edit.merge);
    return;
  }
  eachSpreadsheetCell(range, (row, column) => {
    const cell = sheet.getCell(row + 1, column + 1);
    if (edit.kind === "paste" && cell.isMerged)
      throw new Error("SPREADSHEET_PASTE_MERGE");
    if (edit.kind === "format") writeSpreadsheetFormat(cell, edit.format);
    else if (!cell.isMerged || cell.master.address === cell.address)
      setCell(
        cell,
        edit.kind === "clear"
          ? ""
          : (edit.values[row - range.startRow]?.[column - range.startColumn] ??
              ""),
      );
  });
}

function formulaValues(workbook: Workbook, keepResults: boolean): void {
  const formulas: { cell: Cell; formula: string; result: Cell["result"] }[] =
    [];
  workbook.eachSheet((sheet) =>
    sheet.eachRow((row) =>
      row.eachCell((cell) => {
        if (cell.formula)
          formulas.push({ cell, formula: cell.formula, result: cell.result });
      }),
    ),
  );
  for (const { cell, formula, result } of formulas)
    cell.value = {
      formula,
      ...(keepResults && result !== undefined ? { result } : {}),
    };
}

export async function writeSpreadsheet(
  buffer: ArrayBuffer,
  edits: SpreadsheetEdit[],
): Promise<Uint8Array<ArrayBuffer>> {
  if (
    !buffer.byteLength ||
    buffer.byteLength > SPREADSHEET_LIMITS.inputBytes ||
    edits.length > SPREADSHEET_EDITOR_LIMITS.operations
  )
    throw new Error("SPREADSHEET_WORKBOOK_LIMIT");
  await assertEditableSpreadsheetXml(buffer);
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  assertEditableSpreadsheetWorkbook(workbook);
  if (!edits.length) return new Uint8Array(buffer.slice(0));
  const changesValues = edits.some((edit) =>
    ["cell", "clear", "paste"].includes(edit.kind),
  );
  if (changesValues) formulaValues(workbook, true);
  for (const edit of edits) {
    const sheet = workbook.getWorksheet(edit.sheet);
    if (!sheet || sheet.state !== "visible")
      throw new Error("SPREADSHEET_SHEET_MISSING");
    writeEdit(sheet, edit);
  }
  if (changesValues) formulaValues(workbook, false);
  workbook.calcProperties.fullCalcOnLoad = true;
  assertEditableSpreadsheetWorkbook(workbook);
  const bytes = await preserveSpreadsheetMetadata(
    buffer,
    new Uint8Array(await workbook.xlsx.writeBuffer()),
  );
  if (bytes.byteLength > SPREADSHEET_LIMITS.inputBytes)
    throw new Error("SPREADSHEET_WORKBOOK_LIMIT");
  return bytes;
}
