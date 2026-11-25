import type { SpreadsheetCell } from "../../types";
import type { SpreadsheetCellFormat } from "../../types/editing";

export function spreadsheetFormatStyle(
  format: SpreadsheetCellFormat,
): SpreadsheetCell["style"] {
  const style: SpreadsheetCell["style"] = {};
  if (format.fontName)
    style.fontFamily = `"${format.fontName.replace(/["\\]/g, "")}", Arial, sans-serif`;
  if (format.fontSize) style.fontSize = `${format.fontSize}pt`;
  if (format.bold !== undefined) style.fontWeight = format.bold ? 700 : 400;
  if (format.italic !== undefined)
    style.fontStyle = format.italic ? "italic" : "normal";
  if (format.underline !== undefined || format.strike !== undefined)
    style.textDecoration =
      [format.underline && "underline", format.strike && "line-through"]
        .filter(Boolean)
        .join(" ") || "none";
  if (format.color) style.color = format.color;
  if (format.fill) style.backgroundColor = format.fill;
  if (format.horizontal) style.textAlign = format.horizontal;
  if (format.vertical)
    style.alignItems = {
      top: "flex-start",
      middle: "center",
      bottom: "flex-end",
    }[format.vertical];
  if (format.wrap !== undefined)
    style.whiteSpace = format.wrap ? "pre-wrap" : "pre";
  if (format.indent !== undefined) style.paddingLeft = 6 + format.indent * 8;
  if (format.border) {
    const width =
      format.border === "thick"
        ? 3
        : ["medium", "double"].includes(format.border)
          ? 2
          : 1;
    const line = ["double", "dotted", "dashed"].includes(format.border)
      ? format.border
      : "solid";
    const border =
      format.border === "none"
        ? "none"
        : `${width}px ${line} ${format.borderColor || "#000000"}`;
    for (const side of [
      "borderTop",
      "borderBottom",
      "borderLeft",
      "borderRight",
    ] as const)
      style[side] = border;
  }
  return style;
}
