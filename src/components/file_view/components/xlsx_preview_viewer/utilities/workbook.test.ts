import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import ExcelJS from "exceljs";

import { parseSpreadsheet } from "./workbook";
import { columnLabel } from "./column_label";

const fixture = async (name: string) =>
  Uint8Array.from(
    await readFile(
      resolve(
        "src/components/file_view/components/xlsx_preview_viewer/fixtures",
        name,
      ),
    ),
  ).buffer;

describe("spreadsheet document normalization", () => {
  it("keeps coordinates, first-row data, merged cells, formats and visible sheets", async () => {
    const result = await parseSpreadsheet(await fixture("budget.xlsx"), "xlsx");
    expect(result.basic).toBe(false);
    expect(result.sheets.map((sheet) => sheet.name)).toEqual([
      "Presupuesto",
      "Condiciones",
    ]);
    const sheet = result.sheets[0];
    expect(sheet.cells["0:0"].text).toContain("PRESUPUESTO");
    expect(sheet.cells["0:0"].style).toMatchObject({
      fontWeight: 700,
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(30, 58, 95)",
    });
    expect(sheet.cells["0:1"]).toBeUndefined();
    expect(sheet.merges[0]).toEqual({
      startRow: 0,
      endRow: 1,
      startColumn: 0,
      endColumn: 4,
    });
    expect(sheet.cells["3:1"].text).toBe("12/11/2026");
    expect(sheet.cells["6:3"].text).toBe("S/ 375.00");
    expect(sheet.cells["6:4"].text).toBe("50%");
    expect(sheet.cells["10:3"].style.borderTop).toContain("double");
    expect(result.sheets[1].cells["2:2"].text).toBe("30 días");
    expect(result.sheets[1].columnCount).toBe(3);
  });

  it.each([false, true])(
    "formats dates using the workbook date1904=%s system",
    async (date1904) => {
      const book = new ExcelJS.Workbook();
      book.properties.date1904 = date1904;
      const sheet = book.addWorksheet("Fechas");
      sheet.getCell("A1").value = new Date("2026-11-12T00:00:00Z");
      sheet.getCell("A1").numFmt = "dd/mm/yyyy";
      const parsed = await parseSpreadsheet(
        await book.xlsx.writeBuffer(),
        "xlsx",
      );
      expect(parsed.sheets[0].cells["0:0"].text).toBe("12/11/2026");
    },
  );

  it("preserves zero, false, errors, formula results and formulas without cached results", async () => {
    const book = new ExcelJS.Workbook();
    const sheet = book.addWorksheet("Valores");
    sheet.getCell("A1").value = 0;
    sheet.getCell("B1").value = false;
    sheet.getCell("C1").value = { formula: "A1*2", result: 0 };
    sheet.getCell("D1").value = { formula: "SUM(A1:B1)" };
    sheet.getCell("E1").value = { error: "#DIV/0!" };
    sheet.getCell("F1").value = "<script>alert(1)</script>";
    sheet.getRow(1).hidden = true;
    sheet.getColumn(2).hidden = true;
    const cells = (
      await parseSpreadsheet(await book.xlsx.writeBuffer(), "xlsx")
    ).sheets[0];
    expect(cells.cells["0:0"].text).toBe("0");
    expect(cells.cells["0:1"].text).toBe("FALSE");
    expect(cells.cells["0:2"]).toMatchObject({
      text: "0",
      missingResult: false,
    });
    expect(cells.cells["0:3"]).toMatchObject({
      text: "=SUM(A1:B1)",
      missingResult: true,
    });
    expect(cells.cells["0:4"].text).toBe("#DIV/0!");
    expect(cells.cells["0:5"].text).toBe("<script>alert(1)</script>");
    expect(cells.rows[0].hidden).toBe(true);
    expect(cells.columns[1].hidden).toBe(true);
  });

  it("keeps XLS compatibility in the same document model", async () => {
    const workbook = await parseSpreadsheet(await fixture("budget.xls"), "xls");
    expect(workbook.basic).toBe(true);
    expect(workbook.sheets.map((sheet) => sheet.name)).toEqual([
      "Presupuesto",
      "Condiciones",
    ]);
    expect(workbook.sheets[1].cells["2:2"].text).toBe("30 días");
    expect(workbook.sheets[1].columnCount).toBe(3);
  });

  it("returns an empty worksheet without inventing a header", async () => {
    const parsed = await parseSpreadsheet(await fixture("empty.xlsx"), "xlsx");
    expect(parsed.sheets[0]).toMatchObject({
      rowCount: 0,
      columnCount: 0,
      cells: {},
    });
    expect(parsed.sheets[1]).toMatchObject({
      rowCount: 0,
      columnCount: 0,
      cells: {},
    });
    expect(parsed.sheets[1].rows[99].hidden).toBe(true);
    expect(parsed.sheets[1].columns[25].hidden).toBe(true);
  });

  it("rejects empty and invalid archives", async () => {
    await expect(
      parseSpreadsheet(new ArrayBuffer(0), "xlsx"),
    ).rejects.toThrow();
    await expect(
      parseSpreadsheet(
        new TextEncoder().encode("not a workbook").buffer,
        "xlsx",
      ),
    ).rejects.toThrow();
  });

  it("labels columns after Z without changing their coordinates", () => {
    expect([0, 25, 26, 701, 702].map(columnLabel)).toEqual([
      "A",
      "Z",
      "AA",
      "ZZ",
      "AAA",
    ]);
  });
});
