import { createRequire } from "node:module";
import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { parseSpreadsheet } from "../workbook";
import { spreadsheetPackageEntries } from "./package";
import {
  spreadsheetRelationships,
  spreadsheetSheetParts,
} from "./metadata_xml";
import { assertEditableSpreadsheetXml } from "./validate_xml";
import { writeSpreadsheet } from "./write";
import { spreadsheetCompressedEntry } from "./zip";

interface TestZip {
  file(name: string): { async(type: "string"): Promise<string> };
  file(name: string, data: string): TestZip;
  remove(name: string): TestZip;
  generateAsync(options: {
    type: "uint8array";
    compression: "DEFLATE";
  }): Promise<Uint8Array<ArrayBuffer>>;
}
const require = createRequire(import.meta.url);
const JSZip = createRequire(require.resolve("exceljs"))("jszip") as {
  loadAsync(
    bytes: Uint8Array | ArrayBuffer,
    options?: { checkCRC32: boolean },
  ): Promise<TestZip>;
};

const location =
  '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="x15ac" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"><x15ac:absPath url="C:\\fixture\\"/></mc:Choice></mc:AlternateContent>';
const extension =
  '<extLst><ext uri="urn:fixture" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:workbookPr chartTrackingRefBase="1"/></ext></extLst>';
const sourceParts = [
  "xl/connections.xml",
  "xl/queryTables/queryTable1.xml",
  "xl/worksheets/_rels/sheet1.xml.rels",
];

async function connectedWorkbook(): Promise<ArrayBuffer> {
  const book = new ExcelJS.Workbook();
  const data = book.addWorksheet("Data");
  data.getCell("A1").value = 2;
  data.getCell("A1").numFmt = "0.00";
  book.addWorksheet("Hidden", { state: "hidden" }).getCell("A1").value = {
    formula: "Data!A1*2",
    result: 4,
  };
  const zip = await JSZip.loadAsync(
    new Uint8Array(await book.xlsx.writeBuffer()),
  );
  const workbook = (await zip.file("xl/workbook.xml").async("string"))
    .replace(
      /r:id="rId(\d+)"/g,
      (_, id: string) => `r:id="rId${Number(id) + 10}"`,
    )
    .replace("<workbookPr", location + "<workbookPr")
    .replace("</workbook>", extension + "</workbook>");
  zip.file("xl/workbook.xml", workbook);
  zip.file(
    "xl/_rels/workbook.xml.rels",
    (await zip.file("xl/_rels/workbook.xml.rels").async("string"))
      .replace(
        /Id="rId(\d+)"/g,
        (_, id: string) => `Id="rId${Number(id) + 10}"`,
      )
      .replace(
        "</Relationships>",
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/connections" Target="connections.xml"/></Relationships>',
      ),
  );
  zip.file(
    "xl/connections.xml",
    '<connections xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><connection id="1" name="Imported" type="6" refreshedVersion="5"><textPr sourceFile="fixture.csv"/></connection></connections>',
  );
  zip.file(
    "xl/queryTables/queryTable1.xml",
    '<queryTable xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" name="Imported" connectionId="1"><queryTableRefresh nextId="2"><queryTableFields count="1"><queryTableField id="1" name="Column"/></queryTableFields></queryTableRefresh></queryTable>',
  );
  zip.file(
    "xl/worksheets/_rels/sheet1.xml.rels",
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/queryTable" Target="../queryTables/queryTable1.xml"/></Relationships>',
  );
  zip.file(
    "[Content_Types].xml",
    (await zip.file("[Content_Types].xml").async("string")).replace(
      "</Types>",
      '<Override PartName="/xl/connections.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml"/><Override PartName="/xl/queryTables/queryTable1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml"/></Types>',
    ),
  );
  return (
    await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" })
  ).buffer;
}

describe("preserving spreadsheet metadata during editing", () => {
  it("opens connected workbooks without trying to refresh their external data", async () => {
    const input = await connectedWorkbook();
    await expect(assertEditableSpreadsheetXml(input)).resolves.toBeUndefined();
    const view = await parseSpreadsheet(input, "xlsx", true);
    expect(view.sheets).toHaveLength(1);
    expect(view.sheets[0].cells["0:0"].text).toBe("2.00");
  });

  it("preserves opaque connection parts, workbook metadata, sheet links and formula behavior", async () => {
    const input = await connectedWorkbook();
    const output = await writeSpreadsheet(input, [
      { kind: "cell", sheet: "Data", row: 0, column: 0, input: "42" },
    ]);
    const original = await JSZip.loadAsync(input);
    const saved = await JSZip.loadAsync(output, { checkCRC32: true });
    for (const name of sourceParts) {
      expect(await saved.file(name).async("string")).toBe(
        await original.file(name).async("string"),
      );
      const before = spreadsheetPackageEntries(input).find(
        (entry) => entry.name === name,
      )!;
      const after = spreadsheetPackageEntries(output.buffer).find(
        (entry) => entry.name === name,
      )!;
      expect(spreadsheetCompressedEntry(output.buffer, after)).toEqual(
        spreadsheetCompressedEntry(input, before),
      );
    }
    const workbookXml = await saved.file("xl/workbook.xml").async("string");
    const links = await saved
      .file("xl/_rels/workbook.xml.rels")
      .async("string");
    expect(workbookXml).toContain(location);
    expect(workbookXml).toContain(extension);
    expect(workbookXml).toMatch(/<calcPr\b[^>]*fullCalcOnLoad="1"/);
    expect(
      spreadsheetRelationships(links).filter((link) =>
        link.type.endsWith("/connections"),
      ),
    ).toHaveLength(1);
    expect(spreadsheetSheetParts(workbookXml, links).size).toBe(2);
    const native = new ExcelJS.Workbook();
    await native.xlsx.load(output.buffer);
    expect(native.getWorksheet("Data")!.getCell("A1").value).toBe(42);
    expect(native.getWorksheet("Data")!.getCell("A1").numFmt).toBe("0.00");
    expect(native.getWorksheet("Hidden")!.state).toBe("hidden");
    expect(native.getWorksheet("Hidden")!.getCell("A1").formula).toBe(
      "Data!A1*2",
    );
    expect(native.getWorksheet("Hidden")!.getCell("A1").result).toBeUndefined();
    await expect(
      assertEditableSpreadsheetXml(output.buffer),
    ).resolves.toBeUndefined();
  });

  it("returns the exact original bytes when nothing changed", async () => {
    const input = await connectedWorkbook();
    expect(await writeSpreadsheet(input, [])).toEqual(new Uint8Array(input));
  });

  it("remaps query relationships when sheet filenames differ from their workbook IDs", async () => {
    const zip = await JSZip.loadAsync(await connectedWorkbook());
    zip.file(
      "xl/worksheets/sheet9.xml",
      await zip.file("xl/worksheets/sheet1.xml").async("string"),
    );
    zip.remove("xl/worksheets/sheet1.xml");
    zip.file(
      "xl/worksheets/_rels/sheet9.xml.rels",
      await zip.file("xl/worksheets/_rels/sheet1.xml.rels").async("string"),
    );
    zip.remove("xl/worksheets/_rels/sheet1.xml.rels");
    zip.file(
      "xl/_rels/workbook.xml.rels",
      (await zip.file("xl/_rels/workbook.xml.rels").async("string")).replace(
        'Target="worksheets/sheet1.xml"',
        'Target="worksheets/sheet9.xml"',
      ),
    );
    zip.file(
      "[Content_Types].xml",
      (await zip.file("[Content_Types].xml").async("string")).replace(
        "/xl/worksheets/sheet1.xml",
        "/xl/worksheets/sheet9.xml",
      ),
    );
    const input = (
      await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" })
    ).buffer;
    const output = await writeSpreadsheet(input, [
      { kind: "cell", sheet: "Data", row: 0, column: 0, input: "7" },
    ]);
    const saved = await JSZip.loadAsync(output, { checkCRC32: true });
    expect(
      await saved.file("xl/worksheets/_rels/sheet1.xml.rels").async("string"),
    ).toContain("queryTable1.xml");
    const native = new ExcelJS.Workbook();
    await native.xlsx.load(output.buffer);
    expect(native.getWorksheet("Data")!.getCell("A1").value).toBe(7);
  });

  it("rejects external query relationship targets instead of copying arbitrary links", async () => {
    const zip = await JSZip.loadAsync(await connectedWorkbook());
    zip.file(
      "xl/worksheets/_rels/sheet1.xml.rels",
      (
        await zip.file("xl/worksheets/_rels/sheet1.xml.rels").async("string")
      ).replace(
        'Target="../queryTables/queryTable1.xml"',
        'Target="https://example.invalid/query.xml" TargetMode="External"',
      ),
    );
    const input = (
      await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" })
    ).buffer;
    await expect(assertEditableSpreadsheetXml(input)).rejects.toThrow(
      "SPREADSHEET_FEATURE_UNSUPPORTED",
    );
  });

  it("keeps rejecting unknown workbook properties and active alternate content", async () => {
    for (const replacement of [
      '<x15:workbookPr unknown="1"/>',
      "<x15:otherFeature/>",
    ]) {
      const zip = await JSZip.loadAsync(await connectedWorkbook());
      zip.file(
        "xl/workbook.xml",
        (await zip.file("xl/workbook.xml").async("string")).replace(
          '<x15:workbookPr chartTrackingRefBase="1"/>',
          replacement,
        ),
      );
      const input = (
        await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" })
      ).buffer;
      await expect(assertEditableSpreadsheetXml(input)).rejects.toThrow(
        "SPREADSHEET_FEATURE_UNSUPPORTED",
      );
    }
  });
});
