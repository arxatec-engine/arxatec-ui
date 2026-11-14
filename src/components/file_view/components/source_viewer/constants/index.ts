import type { CSSProperties } from "react";

import type { FileSourceViewerLabels } from "../types";

export const SOURCE_VIEWER_LABELS: FileSourceViewerLabels = {
  toolbar: "Controles del visor de código",
  zoomOut: "Reducir texto",
  zoomIn: "Aumentar texto",
  wrapLines: "Ajustar líneas",
  copy: "Copiar código",
  copied: "Código copiado",
  copyError: "No se pudo copiar el código",
  download: "Descargar archivo",
  downloadError: "No se pudo descargar el archivo",
  lines: "líneas",
  errorTitle: "No se pudo cargar el código",
  errorDescription:
    "Comprueba que el archivo sea accesible e inténtalo de nuevo.",
};

// CSS variables inherit the consumer's theme, including changes while open.
export const SOURCE_SYNTAX_THEME: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: "var(--foreground)",
    fontFamily: "var(--editor-font-mono, ui-monospace, monospace)",
    textShadow: "none",
  },
  'pre[class*="language-"]': {
    color: "var(--foreground)",
    background: "transparent",
  },
  comment: { color: "var(--muted-foreground)", fontStyle: "italic" },
  linenumber: { color: "var(--muted-foreground)", fontStyle: "normal" },
  prolog: { color: "var(--muted-foreground)" },
  doctype: { color: "var(--muted-foreground)" },
  punctuation: { color: "var(--muted-foreground)" },
  keyword: { color: "var(--status-foreground-info)" },
  builtin: { color: "var(--status-foreground-info)" },
  tag: { color: "var(--status-foreground-info)" },
  string: { color: "var(--status-foreground-success)" },
  char: { color: "var(--status-foreground-success)" },
  "attr-value": { color: "var(--status-foreground-success)" },
  number: { color: "var(--status-foreground-warning)" },
  boolean: { color: "var(--status-foreground-warning)" },
  property: { color: "var(--status-foreground-info)" },
  "attr-name": { color: "var(--status-foreground-warning)" },
  function: { color: "var(--status-foreground-error)" },
  "class-name": { color: "var(--status-foreground-warning)" },
  operator: { color: "var(--foreground)" },
  regex: { color: "var(--status-foreground-success)" },
};

// Radix uses display: table on its content wrapper; code wrapping needs block sizing.
export const SOURCE_SCROLL_AREA_CLASS =
  "min-h-0 min-w-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:!block";
