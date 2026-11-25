import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import {
  assertEditableSpreadsheetPackage,
  assertEditableSpreadsheetWorkbook,
} from "./package";
import { writeSpreadsheet } from "./write";

const bytesOf = async (workbook: ExcelJS.Workbook) =>
  new Uint8Array(await workbook.xlsx.writeBuffer()).buffer;

describe("editable spreadsheet eligibility", () => {
  it("accepts a basic ExcelJS package and rejects malformed archives", async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("Datos").getCell("A1").value = 1;
    const valid = await bytesOf(workbook);
    expect(() => assertEditableSpreadsheetPackage(valid)).not.toThrow();
    expect(() =>
      assertEditableSpreadsheetPackage(new ArrayBuffer(0)),
    ).toThrow();
    expect(() =>
      assertEditableSpreadsheetPackage(
        new TextEncoder().encode("not a zip").buffer,
      ),
    ).toThrow();
    const corrupt = valid.slice(0);
    const view = new DataView(corrupt);
    const end = corrupt.byteLength - 22;
    view.setUint32(end + 16, corrupt.byteLength + 100, true);
    expect(() => assertEditableSpreadsheetPackage(corrupt)).toThrow();
  });

  it("rejects a real workbook containing unsupported drawing and image parts", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    const image = workbook.addImage({
      base64:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      extension: "png",
    });
    sheet.addImage(image, "A1:B2");
    const input = await bytesOf(workbook);
    expect(() => assertEditableSpreadsheetPackage(input)).toThrow();
    await expect(
      writeSpreadsheet(input, [
        { kind: "cell", sheet: "Datos", row: 0, column: 0, input: "1" },
      ]),
    ).rejects.toThrow();
  });

  it("rejects protected sheets, conditional formatting and array formulas", async () => {
    const protectedBook = new ExcelJS.Workbook();
    const protectedSheet = protectedBook.addWorksheet("Datos");
    protectedSheet.getCell("A1").value = 1;
    await protectedSheet.protect("password", { spinCount: 1 });
    expect(() => assertEditableSpreadsheetWorkbook(protectedBook)).toThrow();
    const protectedInput = await bytesOf(protectedBook);
    await expect(writeSpreadsheet(protectedInput, [])).rejects.toThrow();

    const conditionalBook = new ExcelJS.Workbook();
    const conditionalSheet = conditionalBook.addWorksheet("Datos");
    conditionalSheet.getCell("A1").value = 1;
    conditionalSheet.addConditionalFormatting({
      ref: "A1",
      rules: [
        {
          type: "expression",
          priority: 1,
          formulae: ["A1>0"],
          style: { font: { bold: true } },
        },
      ],
    });
    expect(() => assertEditableSpreadsheetWorkbook(conditionalBook)).toThrow();
    const conditionalInput = await bytesOf(conditionalBook);
    await expect(writeSpreadsheet(conditionalInput, [])).rejects.toThrow();

    const arrayBook = new ExcelJS.Workbook();
    const arrayFormula = {
      formula: "ROW(A1:A2)",
      shareType: "array",
      ref: "A1:A2",
    };
    arrayBook.addWorksheet("Datos").getCell("A1").value = arrayFormula;
    expect(() => assertEditableSpreadsheetWorkbook(arrayBook)).toThrow();
    const arrayInput = await bytesOf(arrayBook);
    await expect(writeSpreadsheet(arrayInput, [])).rejects.toThrow();
  });

  it("enforces sheet count and requires at least one visible sheet", () => {
    const workbook = new ExcelJS.Workbook();
    for (let index = 0; index < 50; index++)
      workbook.addWorksheet(`Sheet ${index}`);
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).not.toThrow();
    workbook.addWorksheet("Sheet 50");
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).toThrow();
    const hidden = new ExcelJS.Workbook();
    hidden.addWorksheet("Oculta", { state: "hidden" });
    expect(() => assertEditableSpreadsheetWorkbook(hidden)).toThrow();
  });

  it("enforces row and column limits at the boundary", () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell(20000, 512).value = 1;
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).not.toThrow();
    sheet.getCell(20001, 1).value = 1;
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).toThrow();
    const columns = new ExcelJS.Workbook();
    columns.addWorksheet("Datos").getCell(1, 513).value = 1;
    expect(() => assertEditableSpreadsheetWorkbook(columns)).toThrow();
  });

  it("accepts 100,000 populated cells and rejects one more", () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    for (let row = 1; row <= 200; row++) {
      for (let column = 1; column <= 500; column++)
        sheet.getCell(row, column).value = 1;
    }
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).not.toThrow();
    sheet.getCell(201, 1).value = 1;
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).toThrow();
  }, 30000);

  it("rejects empty and greater-than-20-MiB input before exporting", async () => {
    await expect(writeSpreadsheet(new ArrayBuffer(0), [])).rejects.toThrow();
    await expect(
      writeSpreadsheet(new ArrayBuffer(20 * 1024 * 1024 + 1), []),
    ).rejects.toThrow();
  });

  it("counts styled empty cells toward the workbook limit", () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Styles");
    for (let row = 1; row <= 200; row++)
      for (let column = 1; column <= 500; column++)
        sheet.getCell(row, column).numFmt = "0.00";
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).not.toThrow();
    sheet.getCell(201, 1).numFmt = "0.00";
    expect(() => assertEditableSpreadsheetWorkbook(workbook)).toThrow(
      "SPREADSHEET_WORKBOOK_LIMIT",
    );
  });
});
