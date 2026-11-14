import type { CSSProperties } from "react";
import type { Cell, Color, Worksheet } from "exceljs";
import { format as formatNumber } from "ssf";

import type {
  SpreadsheetCell,
  SpreadsheetMerge,
  SpreadsheetSheet,
  SpreadsheetWorkbook,
} from "../types";
import { SPREADSHEET_LIMITS } from "./constants";

const OFFICE_THEME = [
  "FFFFFF",
  "000000",
  "E7E6E6",
  "44546A",
  "4472C4",
  "ED7D31",
  "A5A5A5",
  "FFC000",
  "5B9BD5",
  "70AD47",
  "0563C1",
  "954F72",
];

function coordinate(address: string): { row: number; column: number } {
  const match = /^\$?([A-Z]+)\$?(\d+)$/i.exec(address);
  if (!match) throw new Error("El libro contiene coordenadas no válidas.");
  let column = 0;
  for (const character of match[1].toUpperCase())
    column = column * 26 + character.charCodeAt(0) - 64;
  const row = Number(match[2]);
  if (row < 1 || row > 1_048_576 || column < 1 || column > 16_384) {
    throw new Error("El libro contiene coordenadas no válidas.");
  }
  return { row: row - 1, column: column - 1 };
}

function mergeRange(address: string): SpreadsheetMerge {
  const [first, last = first] = address.split(":");
  const start = coordinate(first);
  const end = coordinate(last);
  return {
    startRow: start.row,
    endRow: end.row,
    startColumn: start.column,
    endColumn: end.column,
  };
}

function colorValue(
  color: (Partial<Color> & { tint?: number; indexed?: number }) | undefined,
  theme: string[],
): string | undefined {
  if (!color) return undefined;
  const raw =
    color.argb?.slice(-6) ??
    (color.theme !== undefined ? theme[color.theme] : undefined) ??
    (color.indexed === 64
      ? "000000"
      : color.indexed === 65
        ? "FFFFFF"
        : undefined);
  if (!raw || !/^[\da-f]{6}$/i.test(raw)) return undefined;
  const tint = Math.max(-1, Math.min(1, color.tint ?? 0));
  const channels = raw.match(/../g)!.map((hex) => {
    const value = Number.parseInt(hex, 16);
    return Math.round(
      tint < 0 ? value * (1 + tint) : value + (255 - value) * tint,
    );
  });
  return `rgb(${channels.join(", ")})`;
}

function cellStyle(cell: Cell, theme: string[]): CSSProperties {
  const { font, fill, alignment, border } = cell;
  const style: CSSProperties = {};
  if (font) {
    if (font.name)
      style.fontFamily = `"${font.name.replace(/["\\]/g, "")}", Arial, sans-serif`;
    if (font.size) style.fontSize = `${font.size}pt`;
    if (font.bold) style.fontWeight = 700;
    if (font.italic) style.fontStyle = "italic";
    style.color = colorValue(font.color, theme);
    const decorations = [
      font.underline ? "underline" : "",
      font.strike ? "line-through" : "",
    ].filter(Boolean);
    if (decorations.length) style.textDecoration = decorations.join(" ");
  }
  if (fill?.type === "pattern" && fill.pattern !== "none") {
    style.backgroundColor = colorValue(fill.fgColor ?? fill.bgColor, theme);
  }
  if (alignment) {
    const horizontal = alignment.horizontal;
    if (
      horizontal === "left" ||
      horizontal === "center" ||
      horizontal === "right" ||
      horizontal === "justify"
    )
      style.textAlign = horizontal;
    if (alignment.wrapText) style.whiteSpace = "pre-wrap";
    if (alignment.indent) style.paddingLeft = 6 + alignment.indent * 8;
    style.alignItems =
      alignment.vertical === "top"
        ? "flex-start"
        : alignment.vertical === "middle"
          ? "center"
          : "flex-end";
  }
  for (const side of ["top", "bottom", "left", "right"] as const) {
    const edge = border?.[side];
    if (!edge?.style) continue;
    const width =
      edge.style === "thick"
        ? 3
        : edge.style.startsWith("medium") || edge.style === "double"
          ? 2
          : 1;
    const line =
      edge.style === "double"
        ? "double"
        : edge.style === "dotted" || edge.style === "hair"
          ? "dotted"
          : /dash/i.test(edge.style)
            ? "dashed"
            : "solid";
    const value = `${width}px ${line} ${colorValue(edge.color, theme) ?? "#000000"}`;
    if (side === "top") style.borderTop = value;
    if (side === "bottom") style.borderBottom = value;
    if (side === "left") style.borderLeft = value;
    if (side === "right") style.borderRight = value;
  }
  return style;
}

function cellText(
  value: Cell["value"],
  numberFormat: string | undefined,
  date1904: boolean,
): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) {
    const serial =
      value.getTime() / 86_400_000 + 25_569 - (date1904 ? 1462 : 0);
    return formatNumber(numberFormat || "yyyy-mm-dd", serial, { date1904 });
  }
  if (typeof value === "number") {
    try {
      return formatNumber(numberFormat || "General", value, { date1904 });
    } catch {
      return String(value);
    }
  }
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "string") return value;
  if ("richText" in value)
    return value.richText.map((run) => run.text).join("");
  if ("text" in value) return value.text;
  if ("error" in value) return value.error;
  if ("result" in value) return cellText(value.result, numberFormat, date1904);
  return "";
}

function normalizeSheet(
  worksheet: Worksheet,
  theme: string[],
  date1904: boolean,
  consume: () => void,
): SpreadsheetSheet {
  const model = worksheet.model;
  const sheet: SpreadsheetSheet = {
    name: worksheet.name,
    rowCount: 0,
    columnCount: 0,
    defaultRowHeight: ((worksheet.properties.defaultRowHeight || 15) * 4) / 3,
    defaultColumnWidth: (worksheet.properties.defaultColWidth || 8.43) * 7 + 5,
    rows: {},
    columns: {},
    cells: {},
    merges: (model.merges ?? []).map(mergeRange),
  };
  (worksheet.columns ?? []).forEach((column, index) => {
    if (column.width !== undefined || column.hidden)
      sheet.columns[index] = {
        size: column.width !== undefined ? column.width * 7 + 5 : undefined,
        hidden: column.hidden,
      };
  });
  const modelRows: unknown = Reflect.get(model, "rows");
  if (!Array.isArray(modelRows))
    throw new Error("No se pudieron leer las filas del libro.");
  for (const candidate of modelRows) {
    const modelRow: unknown = candidate;
    if (
      !modelRow ||
      typeof modelRow !== "object" ||
      !("number" in modelRow) ||
      typeof modelRow.number !== "number"
    )
      continue;
    const row = worksheet.getRow(modelRow.number);
    if (row.height !== undefined || row.hidden)
      sheet.rows[row.number - 1] = {
        size: row.height ? (row.height * 4) / 3 : undefined,
        hidden: row.hidden,
      };
    for (const modelCell of row.model?.cells ?? []) {
      const address: unknown = modelCell.address;
      if (typeof address !== "string") continue;
      const cell = worksheet.getCell(address);
      if (cell.isMerged && cell.master.address !== cell.address) continue;
      if (cell.value === null && Object.keys(cell.style).length === 0) continue;
      consume();
      const { row: r, column: c } = coordinate(address);
      const formula = cell.formula;
      const missingResult = Boolean(
        formula && (cell.result === undefined || cell.result === null),
      );
      const data: SpreadsheetCell = {
        text: missingResult
          ? `=${formula}`
          : cellText(formula ? cell.result : cell.value, cell.numFmt, date1904),
        style: cellStyle(cell, theme),
        formula,
        missingResult,
      };
      if (
        !data.style.textAlign &&
        (typeof cell.value === "number" || typeof cell.result === "number")
      )
        data.style.textAlign = "right";
      sheet.cells[`${r}:${c}`] = data;
      sheet.rowCount = Math.max(sheet.rowCount, r + 1);
      sheet.columnCount = Math.max(sheet.columnCount, c + 1);
    }
  }
  for (const merge of sheet.merges) {
    sheet.rowCount = Math.max(sheet.rowCount, merge.endRow + 1);
    sheet.columnCount = Math.max(sheet.columnCount, merge.endColumn + 1);
  }
  return sheet;
}

export async function parseSpreadsheet(
  buffer: ArrayBuffer,
  format: "xls" | "xlsx",
): Promise<SpreadsheetWorkbook> {
  if (
    !buffer.byteLength ||
    buffer.byteLength > SPREADSHEET_LIMITS.convertedBytes
  )
    throw new Error(
      "El archivo está vacío o supera el tamaño permitido para la vista previa.",
    );
  let count = 0;
  const consume = () => {
    if (++count > SPREADSHEET_LIMITS.cells)
      throw new Error(
        "El libro supera las 500 000 celdas de la vista previa. Descarga el original para abrirlo completo.",
      );
  };
  if (format === "xls") {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, {
      type: "array",
      cellNF: true,
      cellStyles: true,
    });
    const sheets = workbook.SheetNames.flatMap((name, index) => {
      if (workbook.Workbook?.Sheets?.[index]?.Hidden) return [];
      const source = workbook.Sheets[name];
      const sheet: SpreadsheetSheet = {
        name,
        rowCount: 0,
        columnCount: 0,
        defaultRowHeight: 20,
        defaultColumnWidth: 96,
        rows: {},
        columns: {},
        cells: {},
        merges: (source["!merges"] ?? []).map((range) => ({
          startRow: range.s.r,
          endRow: range.e.r,
          startColumn: range.s.c,
          endColumn: range.e.c,
        })),
      };
      for (const [address, cell] of Object.entries(source)) {
        if (address.startsWith("!")) continue;
        consume();
        const { row, column } = coordinate(address);
        const value = cell as import("xlsx").CellObject;
        const missingResult = Boolean(value.f && value.v === undefined);
        sheet.cells[`${row}:${column}`] = {
          text: missingResult
            ? `=${value.f}`
            : (value.w ?? String(value.v ?? "")),
          formula: value.f,
          missingResult,
          style: {},
        };
        sheet.rowCount = Math.max(sheet.rowCount, row + 1);
        sheet.columnCount = Math.max(sheet.columnCount, column + 1);
      }
      for (const merge of sheet.merges) {
        sheet.rowCount = Math.max(sheet.rowCount, merge.endRow + 1);
        sheet.columnCount = Math.max(sheet.columnCount, merge.endColumn + 1);
      }
      (source["!rows"] ?? []).forEach((row, i) => {
        if (row)
          sheet.rows[i] = {
            hidden: row.hidden,
            size: row.hpx ?? (row.hpt ? (row.hpt * 4) / 3 : undefined),
          };
      });
      (source["!cols"] ?? []).forEach((column, i) => {
        if (column)
          sheet.columns[i] = {
            hidden: column.hidden,
            size: column.wpx ?? (column.wch ? column.wch * 7 + 5 : undefined),
          };
      });
      return [sheet];
    });
    return { sheets, basic: true };
  }
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const theme = [...OFFICE_THEME];
  const themes: unknown = workbook.model.themes;
  const themeXml =
    themes && typeof themes === "object" && "theme1" in themes
      ? themes.theme1
      : undefined;
  if (typeof themeXml === "string") {
    const scheme =
      /<(?:\w+:)?clrScheme\b[^>]*>([\s\S]*?)<\/(?:\w+:)?clrScheme>/.exec(
        themeXml,
      )?.[1];
    if (scheme) {
      const order = [
        "lt1",
        "dk1",
        "lt2",
        "dk2",
        "accent1",
        "accent2",
        "accent3",
        "accent4",
        "accent5",
        "accent6",
        "hlink",
        "folHlink",
      ];
      order.forEach((name, index) => {
        const part = new RegExp(
          `<(?:\\w+:)?${name}\\b[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?${name}>`,
        ).exec(scheme)?.[1];
        const value = part && /(?:lastClr|val)="([\da-f]{6})"/i.exec(part)?.[1];
        if (value) theme[index] = value;
      });
    }
  }
  return {
    basic: false,
    sheets: workbook.worksheets
      .filter((sheet) => sheet.state === "visible")
      .map((sheet) =>
        normalizeSheet(
          sheet,
          theme,
          Boolean(workbook.properties.date1904),
          consume,
        ),
      ),
  };
}
