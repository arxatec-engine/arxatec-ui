import { spreadsheetPackageEntries } from "./package";
import {
  isPreservedWorkbookExtension,
  removePreservedWorkbookLocation,
  spreadsheetRelationshipPart,
  spreadsheetRelationships,
  spreadsheetSheetParts,
} from "./metadata_xml";
import { spreadsheetEntryXml } from "./zip";

export async function assertEditableSpreadsheetXml(
  buffer: ArrayBuffer,
): Promise<void> {
  const entries = spreadsheetPackageEntries(buffer);
  const names = new Set(entries.map((entry) => entry.name));
  let workbook = "";
  let relationships = "";
  for (const entry of entries) {
    if (entry.name.endsWith("/")) continue;
    const xml = await spreadsheetEntryXml(buffer, entry);
    if (/<!DOCTYPE|<!ENTITY/i.test(xml))
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    if (entry.name === "xl/workbook.xml") workbook = xml;
    if (entry.name === "xl/_rels/workbook.xml.rels") relationships = xml;
    if (/^xl\/worksheets\/_rels\/sheet\d+\.xml\.rels$/.test(entry.name)) {
      const sheet = entry.name.replace("/_rels", "").replace(/\.rels$/, "");
      if (!names.has(sheet)) throw new Error("SPREADSHEET_PACKAGE_INVALID");
      for (const link of spreadsheetRelationships(xml)) {
        const target = spreadsheetRelationshipPart(sheet, link.target);
        if (
          !link.type.endsWith("/queryTable") ||
          !/^xl\/queryTables\/queryTable\d+\.xml$/.test(target) ||
          !names.has(target)
        )
          throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
      }
    }
    if (
      /^xl\/queryTables\//.test(entry.name) &&
      !names.has("xl/connections.xml")
    )
      throw new Error("SPREADSHEET_PACKAGE_INVALID");
    if (
      !/^xl\/(?:workbook|styles|worksheets\/sheet\d+)\.xml$/i.test(entry.name)
    )
      continue;
    const extensions =
      xml.match(
        /<(?:[\w-]+:)?extLst\b[^>]*>[\s\S]*?<\/(?:[\w-]+:)?extLst>/gi,
      ) ?? [];
    const unsupportedExtension = extensions.some((block) => {
      if (entry.name === "xl/workbook.xml")
        return !isPreservedWorkbookExtension(block);
      if (entry.name.toLowerCase() !== "xl/styles.xml") return true;
      return (
        block
          .replace(
            /<ext\b[^>]*>\s*<(?:[\w-]+:)?slicerStyles\s+defaultSlicerStyle="SlicerStyleLight1"\s*\/>\s*<\/ext>/gi,
            "",
          )
          .replace(
            /<ext\b[^>]*>\s*<(?:[\w-]+:)?timelineStyles\s+defaultTimelineStyle="TimeSlicerStyleLight1"\s*\/>\s*<\/ext>/gi,
            "",
          )
          .replace(/<\/?(?:[\w-]+:)?extLst\b[^>]*>/gi, "")
          .trim().length > 0
      );
    });
    if (
      unsupportedExtension ||
      /<(?:[\w-]+:)?(?:AlternateContent|workbookProtection|sheetProtection|fileSharing|customWorkbookViews|customSheetViews|pivotCaches|externalReferences|oleObjects|controls|scenarios|smartTags|webPublishItems)\b/i.test(
        entry.name === "xl/workbook.xml"
          ? removePreservedWorkbookLocation(xml)
          : xml,
      ) ||
      /<[^>]*\bcalcPr\b[^>]*\bcalcMode\s*=\s*["'](?:manual|autoNoTable)["']/i.test(
        xml,
      )
    )
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
  }
  if (workbook && relationships) spreadsheetSheetParts(workbook, relationships);
}
