export function spreadsheetXmlAttribute(
  tag: string,
  name: string,
): string | undefined {
  return new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, "s").exec(
    tag,
  )?.[2];
}

export function spreadsheetXmlTags(xml: string, name: string): string[] {
  return xml.match(new RegExp(`<(?:[\\w-]+:)?${name}\\b[^>]*>`, "g")) ?? [];
}

export function appendSpreadsheetXml(
  xml: string,
  parent: string,
  child: string,
): string {
  const closing = new RegExp(`</(?:[\\w-]+:)?${parent}\\s*>`);
  if (!closing.test(xml)) throw new Error("SPREADSHEET_PACKAGE_INVALID");
  return xml.replace(closing, (end) => child + end);
}

export function spreadsheetRelationshipPart(
  base: string,
  target: string,
): string {
  const url = new URL(target, `https://spreadsheet.invalid/${base}`);
  if (url.origin !== "https://spreadsheet.invalid" || url.search || url.hash)
    throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
  return url.pathname.slice(1);
}

export function spreadsheetRelationships(
  xml: string,
): { id: string; type: string; target: string }[] {
  const ids = new Set<string>();
  return spreadsheetXmlTags(xml, "Relationship").map((tag) => {
    const id = spreadsheetXmlAttribute(tag, "Id");
    const type = spreadsheetXmlAttribute(tag, "Type");
    const target = spreadsheetXmlAttribute(tag, "Target");
    if (
      !id ||
      !type ||
      !target ||
      ids.has(id) ||
      spreadsheetXmlAttribute(tag, "TargetMode") === "External"
    )
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    ids.add(id);
    return { id, type, target };
  });
}

export function isPreservedWorkbookExtension(block: string): boolean {
  const remaining = block
    .replace(
      /<ext\b[^>]*>\s*<(?:[\w-]+:)?workbookPr\b([^>]*)\/>\s*<\/ext>/gi,
      (tag, attributes: string) => {
        const names = [...attributes.matchAll(/([\w:-]+)\s*=/g)].map(
          (match) => match[1],
        );
        return names.every(
          (name) =>
            name === "chartTrackingRefBase" || name.startsWith("xmlns:"),
        )
          ? ""
          : tag;
      },
    )
    .replace(/<\/?(?:[\w-]+:)?extLst\b[^>]*>/gi, "");
  return remaining.trim().length === 0;
}

export function removePreservedWorkbookLocation(xml: string): string {
  return xml.replace(
    /<(?:[\w-]+:)?AlternateContent\b[^>]*>[\s\S]*?<\/(?:[\w-]+:)?AlternateContent>/gi,
    (block) => {
      if (spreadsheetXmlTags(block, "absPath").length !== 1) return block;
      const remaining = block
        .replace(/<(?:[\w-]+:)?absPath\b[^>]*\/>/gi, "")
        .replace(/<\/?(?:[\w-]+:)?(?:AlternateContent|Choice)\b[^>]*>/gi, "");
      return remaining.trim().length === 0 ? "" : block;
    },
  );
}

export function spreadsheetSheetParts(
  workbook: string,
  relationships: string,
): Map<string, { id: string; part: string }> {
  const links = new Map(
    spreadsheetRelationships(relationships).map((link) => [link.id, link]),
  );
  const sheets = new Map<string, { id: string; part: string }>();
  for (const tag of spreadsheetXmlTags(workbook, "sheet")) {
    const sheet = spreadsheetXmlAttribute(tag, "sheetId");
    const id = spreadsheetXmlAttribute(tag, "r:id");
    const link = id ? links.get(id) : undefined;
    const part =
      link && spreadsheetRelationshipPart("xl/workbook.xml", link.target);
    if (
      !sheet ||
      sheets.has(sheet) ||
      !id ||
      !part ||
      !link?.type.endsWith("/worksheet") ||
      !/^xl\/worksheets\/sheet\d+\.xml$/.test(part)
    )
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    sheets.set(sheet, { id, part });
  }
  return sheets;
}
