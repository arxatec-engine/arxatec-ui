import { spreadsheetPackageEntries } from "./package";
import {
  appendSpreadsheetXml,
  spreadsheetRelationships,
  spreadsheetRelationshipPart,
  spreadsheetSheetParts,
  spreadsheetXmlAttribute,
  spreadsheetXmlTags,
} from "./metadata_xml";
import {
  spreadsheetCompressedEntry,
  spreadsheetEntryXml,
  spreadsheetXmlPart,
  writeSpreadsheetZip,
  type SpreadsheetZipPart,
} from "./zip";

function recalculateWorkbook(xml: string): string {
  const calculation = spreadsheetXmlTags(xml, "calcPr")[0];
  if (calculation) {
    const changed = /\bfullCalcOnLoad\s*=/.test(calculation)
      ? calculation.replace(
          /\bfullCalcOnLoad\s*=\s*(["']).*?\1/,
          'fullCalcOnLoad="1"',
        )
      : calculation.replace(/\/?>$/, (end) => ' fullCalcOnLoad="1"' + end);
    return xml.replace(calculation, () => changed);
  }
  const added = '<calcPr fullCalcOnLoad="1"/>';
  const extension = /<(?:[\w-]+:)?extLst\b/;
  return extension.test(xml)
    ? xml.replace(extension, (start) => added + start)
    : appendSpreadsheetXml(xml, "workbook", added);
}

export async function preserveSpreadsheetMetadata(
  original: ArrayBuffer,
  output: Uint8Array<ArrayBuffer>,
): Promise<Uint8Array<ArrayBuffer>> {
  const sourceEntries = spreadsheetPackageEntries(original);
  const sourceParts = new Map(
    sourceEntries.map((entry) => [entry.name, entry]),
  );
  const readSource = async (name: string) => {
    const entry = sourceParts.get(name);
    if (!entry) throw new Error("SPREADSHEET_PACKAGE_INVALID");
    return spreadsheetEntryXml(original, entry);
  };
  const sourceWorkbook = await readSource("xl/workbook.xml");
  const preserved = sourceEntries.filter((entry) =>
    /^xl\/(?:connections\.xml|queryTables\/queryTable\d+\.xml|worksheets\/_rels\/sheet\d+\.xml\.rels)$/.test(
      entry.name,
    ),
  );
  if (
    !preserved.length &&
    !/<(?:[\w-]+:)?(?:AlternateContent|extLst)\b/.test(sourceWorkbook)
  )
    return output;

  const outputEntries = spreadsheetPackageEntries(output.buffer);
  const parts = new Map<string, SpreadsheetZipPart>(
    outputEntries
      .filter((entry) => !entry.name.endsWith("/"))
      .map((entry) => [
        entry.name,
        {
          ...entry,
          data: spreadsheetCompressedEntry(output.buffer, entry),
        },
      ]),
  );
  const outputParts = new Map(
    outputEntries.map((entry) => [entry.name, entry]),
  );
  const readOutput = async (name: string) => {
    const entry = outputParts.get(name);
    if (!entry) throw new Error("SPREADSHEET_PACKAGE_INVALID");
    return spreadsheetEntryXml(output.buffer, entry);
  };
  const sourceLinks = await readSource("xl/_rels/workbook.xml.rels");
  let outputLinks = await readOutput("xl/_rels/workbook.xml.rels");
  const sourceSheets = spreadsheetSheetParts(sourceWorkbook, sourceLinks);
  const outputSheets = spreadsheetSheetParts(
    await readOutput("xl/workbook.xml"),
    outputLinks,
  );
  if (sourceSheets.size !== outputSheets.size)
    throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
  const renamedSheets = new Map<string, string>();
  for (const [id, sheet] of sourceSheets) {
    const target = outputSheets.get(id);
    if (!target) throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    renamedSheets.set(sheet.part, target.part);
  }
  let workbook = sourceWorkbook;
  for (const tag of spreadsheetXmlTags(sourceWorkbook, "sheet")) {
    const id = spreadsheetXmlAttribute(tag, "sheetId");
    const target = id ? outputSheets.get(id) : undefined;
    if (!target) throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    workbook = workbook.replace(tag, () =>
      tag.replace(/\br:id\s*=\s*(["']).*?\1/, `r:id="${target.id}"`),
    );
  }
  parts.set(
    "xl/workbook.xml",
    spreadsheetXmlPart("xl/workbook.xml", recalculateWorkbook(workbook)),
  );

  const ids = new Set(
    spreadsheetRelationships(outputLinks).map((link) => link.id),
  );
  for (const link of spreadsheetRelationships(sourceLinks).filter((item) =>
    item.type.endsWith("/connections"),
  )) {
    if (
      spreadsheetRelationshipPart("xl/workbook.xml", link.target) !==
        "xl/connections.xml" ||
      !sourceParts.has("xl/connections.xml")
    )
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    let id = 1;
    while (ids.has(`rId${id}`)) id++;
    ids.add(`rId${id}`);
    outputLinks = appendSpreadsheetXml(
      outputLinks,
      "Relationships",
      `<Relationship Id="rId${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/connections" Target="connections.xml"/>`,
    );
  }
  parts.set(
    "xl/_rels/workbook.xml.rels",
    spreadsheetXmlPart("xl/_rels/workbook.xml.rels", outputLinks),
  );

  let types = await readOutput("[Content_Types].xml");
  const originalTypes = await readSource("[Content_Types].xml");
  const overrides = spreadsheetXmlTags(originalTypes, "Override");
  for (const entry of preserved) {
    let name = entry.name;
    if (name.includes("/worksheets/_rels/")) {
      const sheet = name.replace("/_rels", "").replace(/\.rels$/, "");
      const target = renamedSheets.get(sheet);
      if (!target) throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
      name = target.replace("/worksheets/", "/worksheets/_rels/") + ".rels";
    } else {
      const override = overrides.find(
        (tag) => spreadsheetXmlAttribute(tag, "PartName") === `/${name}`,
      );
      const type = override && spreadsheetXmlAttribute(override, "ContentType");
      const expected = `application/vnd.openxmlformats-officedocument.spreadsheetml.${name === "xl/connections.xml" ? "connections" : "queryTable"}+xml`;
      if (type !== expected) throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
      types = appendSpreadsheetXml(
        types,
        "Types",
        `<Override PartName="/${name}" ContentType="${expected}"/>`,
      );
    }
    parts.set(name, {
      ...entry,
      name,
      data: spreadsheetCompressedEntry(original, entry),
    });
  }
  parts.set(
    "[Content_Types].xml",
    spreadsheetXmlPart("[Content_Types].xml", types),
  );
  return writeSpreadsheetZip([...parts.values()]);
}
