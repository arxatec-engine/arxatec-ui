import { createRequire } from "node:module";
import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { assertEditableSpreadsheetXml } from "./validate_xml";
import { spreadsheetPackageEntries } from "./package";
import { writeSpreadsheet } from "./write";

const require = createRequire(import.meta.url);
const JSZip = createRequire(require.resolve("exceljs"))("jszip") as {
  loadAsync: (bytes: Uint8Array) => Promise<{
    file: {
      (name: string): { async: (kind: "string") => Promise<string> };
      (name: string, data: string): void;
    };
    generateAsync: (options: {
      type: "uint8array";
      compression: "DEFLATE";
    }) => Promise<Uint8Array<ArrayBuffer>>;
  }>;
};

async function example() {
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet("Data").getCell("A1").value = "original";
  return new Uint8Array(await workbook.xlsx.writeBuffer());
}

async function alter(part: string, change: (xml: string) => string) {
  const zip = await JSZip.loadAsync(await example());
  zip.file(part, change(await zip.file(part).async("string")));
  return (
    await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" })
  ).buffer;
}

describe("editable workbook XML validation", () => {
  it("accepts a standard workbook, including its default style extensions", async () => {
    await expect(
      assertEditableSpreadsheetXml((await example()).buffer),
    ).resolves.toBeUndefined();
  });

  it("blocks workbook protection that ExcelJS would otherwise silently remove", async () => {
    const input = await alter("xl/workbook.xml", (xml) =>
      xml.replace(
        "</workbook>",
        '<workbookProtection lockStructure="1"/></workbook>',
      ),
    );
    const native = new ExcelJS.Workbook();
    await native.xlsx.load(input);
    const unchecked = await JSZip.loadAsync(
      new Uint8Array(await native.xlsx.writeBuffer()),
    );
    expect(
      await unchecked.file("xl/workbook.xml").async("string"),
    ).not.toContain("workbookProtection");
    await expect(assertEditableSpreadsheetXml(input)).rejects.toThrow(
      "SPREADSHEET_FEATURE_UNSUPPORTED",
    );
    await expect(writeSpreadsheet(input, [])).rejects.toThrow(
      "SPREADSHEET_FEATURE_UNSUPPORTED",
    );
  });

  it.each([
    [
      "xl/worksheets/sheet1.xml",
      "</worksheet>",
      '<extLst><ext uri="urn:fixture"><feature/></ext></extLst>',
    ],
    [
      "xl/styles.xml",
      "</styleSheet>",
      '<extLst><ext uri="urn:fixture"><customStyles/></ext></extLst>',
    ],
  ])(
    "rejects unrecognized inline extensions in %s",
    async (part, end, extension) => {
      const input = await alter(part, (xml) =>
        xml.replace(end, extension + end),
      );
      await expect(assertEditableSpreadsheetXml(input)).rejects.toThrow(
        "SPREADSHEET_FEATURE_UNSUPPORTED",
      );
    },
  );

  it("rejects manual calculation mode instead of changing workbook behavior", async () => {
    const input = await alter("xl/workbook.xml", (xml) =>
      xml.replace("<calcPr ", '<calcPr calcMode="manual" '),
    );
    await expect(assertEditableSpreadsheetXml(input)).rejects.toThrow(
      "SPREADSHEET_FEATURE_UNSUPPORTED",
    );
  });

  it("bounds actual decompression when an archive lies about expanded size", async () => {
    const input = await example();
    const corrupt = input.slice().buffer;
    const view = new DataView(corrupt);
    const entry = spreadsheetPackageEntries(corrupt).find(
      (item) => item.name === "xl/workbook.xml",
    )!;
    let cursor = 0;
    while (view.getUint32(cursor, true) !== 0x02014b50) cursor++;
    while (view.getUint32(cursor + 42, true) !== entry.offset)
      cursor +=
        46 +
        view.getUint16(cursor + 28, true) +
        view.getUint16(cursor + 30, true) +
        view.getUint16(cursor + 32, true);
    view.setUint32(cursor + 24, 1, true);
    await expect(assertEditableSpreadsheetXml(corrupt)).rejects.toThrow(
      "SPREADSHEET_PACKAGE_LIMIT",
    );
  });
});
