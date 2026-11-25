import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { parseSpreadsheet } from "../workbook";
import { applySpreadsheetEdit } from "./apply";

const example = async () => {
  const workbook = new ExcelJS.Workbook();
  const first = workbook.addWorksheet("Datos");
  first.getCell("A1").value = 3;
  first.getCell("B1").value = { formula: "A1*2", result: 6 };
  first.getCell("A2").value = 0;
  first.getCell("B2").value = false;
  first.getCell("A4").value = false;
  first.getCell("B4").value = 0;
  first.getCell("C3").value = "anchor";
  first.mergeCells("C3:D3");
  const second = workbook.addWorksheet("Resumen");
  second.getCell("A1").value = { formula: "Datos!A1=0", result: false };
  second.getCell("B1").value = { formula: "Datos!A2", result: 0 };
  workbook.addWorksheet("Oculta", { state: "hidden" }).getCell("A1").value = "private";
  const bytes = new Uint8Array(await workbook.xlsx.writeBuffer());
  return parseSpreadsheet(bytes.buffer, "xlsx", true);
};

describe("applying spreadsheet edits to the view model", () => {
  it("updates a cell immutably and invalidates every formula on every visible sheet", async () => {
    const original = await example();
    const snapshot = JSON.stringify(original);
    const updated = applySpreadsheetEdit(original, {
      kind: "cell", sheet: "Datos", row: 0, column: 0, input: "5",
    });

    expect(updated.sheets[0].cells["0:0"]).toMatchObject({ value: 5, text: "5" });
    expect(updated.calculationPending).toBe(true);
    expect(updated.sheets[0].cells["0:1"]).toMatchObject({
      formula: "A1*2", value: null, missingResult: true, text: "=A1*2",
    });
    expect(updated.sheets[1].cells["0:0"]).toMatchObject({
      formula: "Datos!A1=0", value: null, missingResult: true, text: "=Datos!A1=0",
    });
    expect(updated.sheets[1].cells["0:1"]).toMatchObject({
      formula: "Datos!A2", value: null, missingResult: true, text: "=Datos!A2",
    });
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  it("pastes a rectangle with typed inputs and clears only the selected cells", async () => {
    const original = await example();
    const pasted = applySpreadsheetEdit(original, {
      kind: "paste", sheet: "Datos", row: 3, column: 1,
      values: [["0", "FALSE"], ["0012", "=A1+1"]],
    });
    expect(pasted.sheets[0].cells["3:1"]).toMatchObject({ value: 0, text: "0" });
    expect(pasted.sheets[0].cells["3:2"]).toMatchObject({ value: false, text: "FALSE" });
    expect(pasted.sheets[0].cells["4:1"]).toMatchObject({ value: "0012", text: "0012" });
    expect(pasted.sheets[0].cells["4:2"]).toMatchObject({ formula: "A1+1", missingResult: true });
    const cleared = applySpreadsheetEdit(pasted, {
      kind: "clear", sheet: "Datos",
      range: { startRow: 3, endRow: 4, startColumn: 1, endColumn: 1 },
    });
    expect(cleared.sheets[0].cells["3:1"].text).toBe("");
    expect(cleared.sheets[0].cells["4:1"].text).toBe("");
    expect(cleared.sheets[0].cells["3:2"].value).toBe(false);
    expect(pasted.sheets[0].cells["4:1"].value).toBe("0012");
  });

  it("formats a range without changing neighboring cells or invalidating formulas", async () => {
    const original = await example();
    const snapshot = JSON.stringify(original);
    const updated = applySpreadsheetEdit(original, {
      kind: "format", sheet: "Datos",
      range: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 0 },
      format: { bold: true, fill: "#123456", numberFormat: "0.00" },
    });
    expect(updated.sheets[0].cells["0:0"]).toMatchObject({
      text: "3.00", format: { bold: true, fill: "#123456" },
    });
    expect(updated.sheets[0].cells["1:0"]).toMatchObject({ text: "0.00", format: { bold: true } });
    expect(updated.sheets[0].cells["0:1"]).toEqual(original.sheets[0].cells["0:1"]);
    expect(updated.sheets[1]).toEqual(original.sheets[1]);
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  it("resizes rows and columns without modifying values", async () => {
    const original = await example();
    const row = applySpreadsheetEdit(original, { kind: "dimension", sheet: "Datos", axis: "row", index: 0, size: 48 });
    const column = applySpreadsheetEdit(row, { kind: "dimension", sheet: "Datos", axis: "column", index: 1, size: 110 });
    expect(column.sheets[0].rows[0].size).toBe(48);
    expect(column.sheets[0].columns[1].size).toBe(110);
    expect(column.sheets[0].cells).toEqual(original.sheets[0].cells);
    expect(original.sheets[0].rows[0]?.size).not.toBe(48);
  });

  it("refuses merges that would discard zero or false and rejects partial merges", async () => {
    const original = await example();
    expect(() => applySpreadsheetEdit(original, {
      kind: "merge", sheet: "Datos", merge: true,
      range: { startRow: 1, endRow: 1, startColumn: 0, endColumn: 1 },
    })).toThrow();
    expect(() => applySpreadsheetEdit(original, {
      kind: "merge", sheet: "Datos", merge: true,
      range: { startRow: 3, endRow: 3, startColumn: 0, endColumn: 1 },
    })).toThrow();
    expect(() => applySpreadsheetEdit(original, {
      kind: "merge", sheet: "Datos", merge: false,
      range: { startRow: 2, endRow: 2, startColumn: 3, endColumn: 3 },
    })).toThrow();
    expect(original.sheets[0].cells["1:1"].value).toBe(false);
  });

  it("rejects edits to an omitted hidden sheet", async () => {
    const original = await example();
    expect(() => applySpreadsheetEdit(original, {
      kind: "cell", sheet: "Oculta", row: 0, column: 0, input: "changed",
    })).toThrow();
  });
});
