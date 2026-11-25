import type { Workbook } from "exceljs";

import { SPREADSHEET_EDITOR_LIMITS } from "../../constants/editor";
import type { SpreadsheetZipEntry } from "../../types/zip";

export function spreadsheetPackageEntries(
  buffer: ArrayBuffer,
): SpreadsheetZipEntry[] {
  const entries: SpreadsheetZipEntry[] = [];
  const names = new Set<string>();
  const view = new DataView(buffer);
  let end = buffer.byteLength - 22;
  while (
    end >= Math.max(0, buffer.byteLength - 65557) &&
    view.getUint32(end, true) !== 0x06054b50
  )
    end--;
  if (end < 0 || end < buffer.byteLength - 65557)
    throw new Error("SPREADSHEET_PACKAGE_INVALID");
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  let expanded = 0;
  if (count > 500 || !count) throw new Error("SPREADSHEET_PACKAGE_LIMIT");
  for (let index = 0; index < count; index++) {
    if (offset + 46 > end || view.getUint32(offset, true) !== 0x02014b50)
      throw new Error("SPREADSHEET_PACKAGE_INVALID");
    const length = view.getUint16(offset + 28, true);
    const size = view.getUint32(offset + 24, true);
    expanded += size;
    if (
      size > 8 * 1024 * 1024 ||
      expanded > 64 * 1024 * 1024 ||
      view.getUint16(offset + 8, true) & 1
    )
      throw new Error("SPREADSHEET_PACKAGE_LIMIT");
    const name = new TextDecoder().decode(
      new Uint8Array(buffer, offset + 46, length),
    );
    const allowed =
      /^(?:\[Content_Types\]\.xml|_rels\/\.rels|docProps\/(?:app|core)\.xml|xl\/(?:workbook\.xml|_rels\/workbook\.xml\.rels|styles\.xml|sharedStrings\.xml|calcChain\.xml|connections\.xml|queryTables\/queryTable\d+\.xml|theme\/theme\d+\.xml|worksheets\/(?:sheet\d+\.xml|_rels\/sheet\d+\.xml\.rels)))$/i;
    if (!name.endsWith("/") && !allowed.test(name))
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    if (names.has(name)) throw new Error("SPREADSHEET_PACKAGE_INVALID");
    names.add(name);
    entries.push({
      name,
      size,
      compressedSize: view.getUint32(offset + 20, true),
      method: view.getUint16(offset + 10, true),
      offset: view.getUint32(offset + 42, true),
      crc: view.getUint32(offset + 16, true),
    });
    offset +=
      46 +
      length +
      view.getUint16(offset + 30, true) +
      view.getUint16(offset + 32, true);
  }
  return entries;
}

export function assertEditableSpreadsheetPackage(buffer: ArrayBuffer): void {
  spreadsheetPackageEntries(buffer);
}

export function assertEditableSpreadsheetWorkbook(workbook: Workbook): void {
  let cells = 0;
  if (
    workbook.worksheets.length > 50 ||
    !workbook.worksheets.some((sheet) => sheet.state === "visible")
  )
    throw new Error("SPREADSHEET_WORKBOOK_LIMIT");
  for (const sheet of workbook.worksheets) {
    if (
      sheet.rowCount > SPREADSHEET_EDITOR_LIMITS.rows ||
      sheet.columnCount > SPREADSHEET_EDITOR_LIMITS.columns
    )
      throw new Error("SPREADSHEET_WORKBOOK_LIMIT");
    const protection: unknown = Reflect.get(sheet.model, "sheetProtection");
    const conditional: unknown = Reflect.get(sheet, "conditionalFormattings");
    if (
      (protection &&
        typeof protection === "object" &&
        Object.keys(protection).length > 0) ||
      (Array.isArray(conditional) && conditional.length > 0)
    )
      throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
    const modelRows: unknown = Reflect.get(sheet.model, "rows");
    if (!Array.isArray(modelRows))
      throw new Error("SPREADSHEET_WORKBOOK_INVALID");
    for (const row of modelRows) {
      if (!row || typeof row !== "object") continue;
      const entries: unknown = Reflect.get(row, "cells");
      if (Array.isArray(entries)) cells += entries.filter(Boolean).length;
      if (cells > SPREADSHEET_EDITOR_LIMITS.cells)
        throw new Error("SPREADSHEET_WORKBOOK_LIMIT");
    }
    sheet.eachRow({ includeEmpty: false }, (row) =>
      row.eachCell({ includeEmpty: false }, (cell) => {
        const value = cell.value;
        if (
          value &&
          typeof value === "object" &&
          "shareType" in value &&
          value.shareType === "array"
        )
          throw new Error("SPREADSHEET_FEATURE_UNSUPPORTED");
      }),
    );
  }
}
