import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { parseSpreadsheet } from "../workbook";
import { parseSpreadsheetClipboard } from "./range";
import { writeSpreadsheet } from "./write";

const bytesOf = async (workbook: ExcelJS.Workbook) =>
  new Uint8Array(await workbook.xlsx.writeBuffer()).buffer;

const open = async (buffer: ArrayBuffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
};

const workbookXml = async (bytes: Uint8Array) => {
  const require = createRequire(import.meta.url);
  const fromExcel = createRequire(require.resolve("exceljs"));
  const zip = fromExcel("jszip") as {
    loadAsync: (input: Uint8Array) => Promise<{
      file: (name: string) => { async: (type: "string") => Promise<string> };
    }>;
  };
  return (await zip.loadAsync(bytes)).file("xl/workbook.xml").async("string");
};

describe("saving spreadsheet edits", () => {
  it("keeps a newly typed ISO date formatted consistently after reopening", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Dates");
    const sharedStyle = { numFmt: "General" };
    sheet.getCell("A1").style = sharedStyle;
    sheet.getCell("B1").style = sharedStyle;
    sheet.getCell("B1").value = 4;
    const saved = await writeSpreadsheet(await bytesOf(workbook), [
      { kind: "cell", sheet: "Dates", row: 0, column: 0, input: "2026-11-25" },
    ]);
    const native = (await open(saved.buffer))
      .getWorksheet("Dates")!
      .getCell("A1");
    expect(native.value).toEqual(new Date("2026-11-25T00:00:00Z"));
    expect(native.numFmt).toBe("yyyy-mm-dd");
    expect(
      (await open(saved.buffer)).getWorksheet("Dates")!.getCell("B1").numFmt ??
        "General",
    ).toBe("General");
    const view = await parseSpreadsheet(saved.buffer, "xlsx", true);
    expect(view.sheets[0].cells["0:0"].text).toBe("2026-11-25");
  });
  it("returns the original budget fixture byte for byte when there are no edits", async () => {
    const original = Uint8Array.from(
      await readFile(
        resolve(
          "src/components/file_view/components/xlsx_preview_viewer/fixtures/budget.xlsx",
        ),
      ),
    ).buffer;
    const saved = await writeSpreadsheet(original, []);
    expect(saved).toEqual(new Uint8Array(original));
  });

  it("preserves sheets and 1904 dates while invalidating all saved formula results", async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.properties.date1904 = true;
    const first = workbook.addWorksheet("Datos");
    first.getCell("A1").value = 5;
    first.getCell("B1").value = { formula: "A1*2", result: 10 };
    first.getCell("C1").value = { formula: "A1=0", result: false };
    first.getCell("D1").value = { formula: "A1-A1", result: 0 };
    first.getCell("C2").numFmt = "yyyy-mm-dd";
    first.getCell("A5").value = "hidden row";
    first.getRow(5).hidden = true;
    first.getColumn(5).hidden = true;
    const second = workbook.addWorksheet("Resumen");
    second.getCell("A1").value = { formula: "Datos!A1+1", result: 6 };
    second.getCell("B1").value = "keep";
    const hidden = workbook.addWorksheet("Oculta", { state: "hidden" });
    hidden.getCell("A1").value = { formula: "Datos!A1", result: 5 };
    hidden.getCell("B1").value = "hidden data";

    const original = await bytesOf(workbook);
    const saved = await writeSpreadsheet(original, [
      { kind: "cell", sheet: "Datos", row: 0, column: 0, input: "0" },
      {
        kind: "paste",
        sheet: "Datos",
        row: 1,
        column: 0,
        values: [["FALSE", "0012", "2026-11-12"]],
      },
    ]);
    const result = await open(saved.buffer);
    const sheet = result.getWorksheet("Datos")!;
    expect(result.properties.date1904).toBe(true);
    expect(sheet.getCell("A1").value).toBe(0);
    expect(sheet.getCell("A2").value).toBe(false);
    expect(sheet.getCell("B2").value).toBe("0012");
    expect(sheet.getCell("C2").value).toEqual(new Date("2026-11-12T00:00:00Z"));
    expect(sheet.getRow(5).hidden).toBe(true);
    expect(sheet.getColumn(5).hidden).toBe(true);
    expect(result.getWorksheet("Oculta")?.state).toBe("hidden");
    expect(result.getWorksheet("Oculta")?.getCell("B1").value).toBe(
      "hidden data",
    );
    expect(result.getWorksheet("Resumen")?.getCell("B1").value).toBe("keep");
    for (const [name, address, formula] of [
      ["Datos", "B1", "A1*2"],
      ["Datos", "C1", "A1=0"],
      ["Datos", "D1", "A1-A1"],
      ["Resumen", "A1", "Datos!A1+1"],
      ["Oculta", "A1", "Datos!A1"],
    ]) {
      const cell = result.getWorksheet(name)!.getCell(address);
      expect(cell.formula).toBe(formula);
      expect(cell.result).toBeUndefined();
    }
    // ExcelJS writes calcPr but does not parse fullCalcOnLoad when reloading.
    expect(await workbookXml(saved)).toMatch(
      /<calcPr\b[^>]*\bfullCalcOnLoad="(?:1|true)"/,
    );
    const view = await parseSpreadsheet(saved.buffer, "xlsx", true);
    expect(view.sheets[0].cells["1:2"]).toMatchObject({
      valueKind: "date",
      value: "2026-11-12T00:00:00.000Z",
      text: "2026-11-12",
    });
  });

  it("invalidates each shared formula without changing its translated expression", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("A1").value = 1;
    sheet.getCell("A2").value = 2;
    sheet.fillFormula("B1:B2", "A1*2", [2, 4]);
    const input = await bytesOf(workbook);
    const original = (await open(input)).getWorksheet("Datos")!;
    expect(original.getCell("B1").formula).toBe("A1*2");
    expect(original.getCell("B2").formula).toBe("A2*2");
    const saved = await writeSpreadsheet(input, [
      { kind: "cell", sheet: "Datos", row: 0, column: 0, input: "3" },
    ]);
    const result = (await open(saved.buffer)).getWorksheet("Datos")!;
    expect(result.getCell("B1").formula).toBe("A1*2");
    expect(result.getCell("B2").formula).toBe("A2*2");
    expect(result.getCell("B1").result).toBeUndefined();
    expect(result.getCell("B2").result).toBeUndefined();
  });

  it("round-trips quoted TSV fields and preserves neighboring values", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("D1").value = "keep";
    const input = await bytesOf(workbook);
    const values = parseSpreadsheetClipboard(
      '"a\tb"\t"first\nsecond"\r\n"say ""hello"""\t0',
    );
    const saved = await writeSpreadsheet(input, [
      { kind: "paste", sheet: "Datos", row: 0, column: 0, values },
    ]);
    const result = (await open(saved.buffer)).getWorksheet("Datos")!;
    expect(result.getCell("A1").value).toBe("a\tb");
    expect(result.getCell("B1").value).toBe("first\nsecond");
    expect(result.getCell("A2").value).toBe('say "hello"');
    expect(result.getCell("B2").value).toBe(0);
    expect(result.getCell("D1").value).toBe("keep");
  });

  it("clears a rectangle without erasing its formats or other cells", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("A1").value = 0;
    sheet.getCell("A1").numFmt = "0.00";
    sheet.getCell("B1").value = false;
    sheet.getCell("A2").value = "text";
    sheet.getCell("B2").value = 42;
    sheet.getCell("C1").value = "keep";
    const input = await bytesOf(workbook);
    const saved = await writeSpreadsheet(input, [
      {
        kind: "clear",
        sheet: "Datos",
        range: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
      },
    ]);
    const result = (await open(saved.buffer)).getWorksheet("Datos")!;
    for (const address of ["A1", "B1", "A2", "B2"])
      expect(result.getCell(address).value).toBeNull();
    expect(result.getCell("A1").numFmt).toBe("0.00");
    expect(result.getCell("C1").value).toBe("keep");
  });

  it("retains zero and false formula caches when only formatting changes", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("A1").value = { formula: "1-1", result: 0 };
    const second = workbook.addWorksheet("Resumen");
    second.getCell("A1").value = { formula: "1=0", result: false };
    const input = await bytesOf(workbook);
    const saved = await writeSpreadsheet(input, [
      {
        kind: "format",
        sheet: "Datos",
        range: { startRow: 0, endRow: 0, startColumn: 0, endColumn: 0 },
        format: { bold: true },
      },
    ]);
    const result = await open(saved.buffer);
    expect(result.getWorksheet("Datos")!.getCell("A1").result).toBe(0);
    expect(result.getWorksheet("Resumen")!.getCell("A1").result).toBe(false);
  });

  it("retains an existing recalculation request after a format-only edit", async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.calcProperties.fullCalcOnLoad = true;
    workbook.addWorksheet("Datos").getCell("A1").value = { formula: "1+1" };
    const input = await bytesOf(workbook);
    expect(await workbookXml(new Uint8Array(input))).toMatch(
      /<calcPr\b[^>]*\bfullCalcOnLoad="(?:1|true)"/,
    );
    const saved = await writeSpreadsheet(input, [
      {
        kind: "format",
        sheet: "Datos",
        range: { startRow: 0, endRow: 0, startColumn: 0, endColumn: 0 },
        format: { bold: true },
      },
    ]);
    expect(await workbookXml(saved)).toMatch(
      /<calcPr\b[^>]*\bfullCalcOnLoad="(?:1|true)"/,
    );
  });

  it("isolates a range's styles and preserves unrelated theme colors and formula caches", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estilos");
    const shared: Partial<ExcelJS.Style> = {
      font: { name: "Calibri", italic: true, color: { theme: 4 } },
      fill: { type: "pattern", pattern: "solid", fgColor: { theme: 5 } },
      border: { top: { style: "thin", color: { theme: 4 } } },
      alignment: { horizontal: "right" },
      numFmt: "0.00",
    };
    for (const address of ["A1", "B1", "A2", "B2", "C1"]) {
      sheet.getCell(address).value = 4;
      sheet.getCell(address).style = shared;
    }
    sheet.getCell("D1").value = { formula: "C1*2", result: 8 };
    const input = await bytesOf(workbook);
    const before = await open(input);
    const saved = await writeSpreadsheet(input, [
      {
        kind: "format",
        sheet: "Estilos",
        range: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
        format: {
          bold: true,
          fill: "#112233",
          horizontal: "center",
          border: "double",
        },
      },
    ]);
    const after = await open(saved.buffer);
    const result = after.getWorksheet("Estilos")!;
    for (const address of ["A1", "B1", "A2", "B2"]) {
      const cell = result.getCell(address);
      expect(cell.font).toMatchObject({
        bold: true,
        italic: true,
        color: { theme: 4 },
      });
      expect(cell.fill).toMatchObject({ fgColor: { argb: "FF112233" } });
      expect(cell.alignment.horizontal).toBe("center");
      expect(cell.border.top?.style).toBe("double");
    }
    expect(result.getCell("C1").style).toEqual(
      before.getWorksheet("Estilos")!.getCell("C1").style,
    );
    expect(result.getCell("D1").result).toBe(8);
    expect(after.model.themes).toEqual(before.model.themes);
  });

  it("keeps values through row/column resizing and merge/unmerge", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("A1").value = "unchanged";
    sheet.getCell("C3").value = "anchor";
    const input = await bytesOf(workbook);
    const range = { startRow: 2, endRow: 2, startColumn: 2, endColumn: 3 };
    const merged = await writeSpreadsheet(input, [
      { kind: "dimension", sheet: "Datos", axis: "row", index: 0, size: 48 },
      {
        kind: "dimension",
        sheet: "Datos",
        axis: "column",
        index: 0,
        size: 110,
      },
      { kind: "merge", sheet: "Datos", range, merge: true },
    ]);
    const mergedSheet = (await open(merged.buffer)).getWorksheet("Datos")!;
    expect(mergedSheet.getRow(1).height).toBeCloseTo(36);
    expect(mergedSheet.getColumn(1).width).toBeCloseTo(15);
    expect(mergedSheet.getCell("C3").value).toBe("anchor");
    expect(mergedSheet.getCell("D3").master.address).toBe("C3");
    const unmerged = await writeSpreadsheet(merged.buffer, [
      { kind: "merge", sheet: "Datos", range, merge: false },
    ]);
    const result = (await open(unmerged.buffer)).getWorksheet("Datos")!;
    expect(result.getCell("A1").value).toBe("unchanged");
    expect(result.getCell("C3").value).toBe("anchor");
    expect(result.getCell("D3").isMerged).toBe(false);
  });

  it("rejects a merge that would discard a populated cell", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("A1").value = 0;
    sheet.getCell("B1").value = false;
    const input = await bytesOf(workbook);
    const error = await writeSpreadsheet(input, [
      {
        kind: "merge",
        sheet: "Datos",
        merge: true,
        range: { startRow: 0, endRow: 0, startColumn: 0, endColumn: 1 },
      },
    ]).then(
      () => null,
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(Error);
  });

  it("does not overwrite a merged anchor when asked to edit a covered cell", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    sheet.getCell("A1").value = "keep";
    sheet.mergeCells("A1:B1");
    const input = await bytesOf(workbook);
    let output: Uint8Array<ArrayBuffer> | undefined;
    try {
      output = await writeSpreadsheet(input, [
        { kind: "cell", sheet: "Datos", row: 0, column: 1, input: "overwrite" },
      ]);
    } catch {
      return;
    }
    expect(
      (await open(output.buffer)).getWorksheet("Datos")!.getCell("A1").value,
    ).toBe("keep");
  });

  it("preserves the hidden budget sheet and refuses direct edits to it", async () => {
    const input = Uint8Array.from(
      await readFile(
        resolve(
          "src/components/file_view/components/xlsx_preview_viewer/fixtures/budget.xlsx",
        ),
      ),
    ).buffer;
    const before = await open(input);
    const saved = await writeSpreadsheet(input, [
      {
        kind: "cell",
        sheet: "Condiciones",
        row: 2,
        column: 2,
        input: "45 días",
      },
    ]);
    const result = await open(saved.buffer);
    expect(result.getWorksheet("Oculta")?.state).toBe("hidden");
    expect(result.getWorksheet("Oculta")?.getCell("A1").value).toEqual(
      before.getWorksheet("Oculta")?.getCell("A1").value,
    );
    expect(result.getWorksheet("Condiciones")?.getCell("C3").value).toBe(
      "45 días",
    );
    await expect(
      writeSpreadsheet(input, [
        { kind: "cell", sheet: "Oculta", row: 0, column: 0, input: "change" },
      ]),
    ).rejects.toThrow();
  });
});
