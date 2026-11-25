import type { Cell } from "exceljs";

import type { SpreadsheetCellFormat } from "../../types/editing";

function hexColor(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^#[a-f0-9]{6}$/i.test(value)) return value;
  const rgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(value);
  return rgb
    ? `#${rgb
        .slice(1)
        .map((channel) => Number(channel).toString(16).padStart(2, "0"))
        .join("")}`
    : undefined;
}

export function spreadsheetDocumentFormat(
  cell: Cell,
  colors?: { color?: string; backgroundColor?: string },
): SpreadsheetCellFormat {
  const horizontal = cell.alignment?.horizontal;
  const vertical = cell.alignment?.vertical;
  return {
    fontName: cell.font?.name,
    fontSize: cell.font?.size,
    bold: Boolean(cell.font?.bold),
    italic: Boolean(cell.font?.italic),
    underline: Boolean(cell.font?.underline),
    strike: Boolean(cell.font?.strike),
    horizontal:
      horizontal === "left" ||
      horizontal === "center" ||
      horizontal === "right" ||
      horizontal === "justify"
        ? horizontal
        : undefined,
    vertical:
      vertical === "top" || vertical === "middle" || vertical === "bottom"
        ? vertical
        : undefined,
    wrap: Boolean(cell.alignment?.wrapText),
    indent: cell.alignment?.indent,
    numberFormat: cell.numFmt,
    color:
      hexColor(colors?.color) ??
      (cell.font?.color?.argb
        ? `#${cell.font.color.argb.slice(-6)}`
        : undefined),
    fill:
      hexColor(colors?.backgroundColor) ??
      (cell.fill?.type === "pattern" && cell.fill.fgColor?.argb
        ? `#${cell.fill.fgColor.argb.slice(-6)}`
        : undefined),
  };
}
