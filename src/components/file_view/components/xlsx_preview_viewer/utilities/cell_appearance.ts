import type { CSSProperties } from "react";

import type { SpreadsheetCell } from "../types";

function themeColor(value: string): string {
  return value
    .replace(
      /#000(?:000)?\b|\brgb\(0,\s*0,\s*0\)|\bblack\b/gi,
      "var(--foreground)",
    )
    .replace(
      /#fff(?:fff)?\b|\brgb\(255,\s*255,\s*255\)|\bwhite\b/gi,
      "var(--background)",
    );
}

export function cellAppearance(
  cell: SpreadsheetCell | undefined,
  scale: number,
): CSSProperties {
  const style = { ...cell?.style };
  const paper =
    !style.backgroundColor ||
    themeColor(style.backgroundColor) === "var(--background)";
  if (paper) {
    for (const side of [
      "borderTop",
      "borderBottom",
      "borderLeft",
      "borderRight",
    ] as const) {
      const edge = style[side];
      if (typeof edge === "string") style[side] = themeColor(edge);
    }
  }
  const fontSize =
    typeof style.fontSize === "string"
      ? `${Number.parseFloat(style.fontSize) * scale}pt`
      : 12 * scale;
  return {
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
    whiteSpace: "pre",
    padding: `${2 * scale}px ${6 * scale}px`,
    lineHeight: 1.25,
    ...style,
    color: paper
      ? themeColor(style.color ?? "var(--foreground)")
      : (style.color ?? "#111827"),
    backgroundColor: paper ? "var(--background)" : style.backgroundColor,
    fontSize,
  };
}
