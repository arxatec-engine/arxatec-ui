import type { TextAnnotation } from "../../../types/annotations";
import { TEMPLATE_ANNOTATION_TYPES } from "../../../types/annotations";

export const ANNOTATION_DEBOUNCE_MS = 800;
export const ANNOTATION_MIN_WIDTH = 0.06;
export const ANNOTATION_MIN_HEIGHT = 0.02;
export const ANNOTATION_DEFAULT_FONT_FAMILY = "Arial, Helvetica, sans-serif";
export const ANNOTATION_FONT_FAMILY_OPTIONS = [
  { name: "Arial", value: ANNOTATION_DEFAULT_FONT_FAMILY },
  { name: "Times New Roman", value: "Times New Roman, Times, serif" },
  { name: "Courier New", value: "Courier New, Courier, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
] as const;

export function resolveAnnotationFontOption(stored: string) {
  const trimmed = stored.trim();
  const exact = ANNOTATION_FONT_FAMILY_OPTIONS.find((o) => o.value === trimmed);
  if (exact) return exact;
  const primary = trimmed.split(",")[0]?.trim().toLowerCase() ?? "";
  if (!primary) return ANNOTATION_FONT_FAMILY_OPTIONS[0];
  const byPrimary = ANNOTATION_FONT_FAMILY_OPTIONS.find(
    (o) => o.value.split(",")[0]?.trim().toLowerCase() === primary,
  );
  return byPrimary ?? ANNOTATION_FONT_FAMILY_OPTIONS[0];
}

export function normalizeAnnotationFontFamily(stored: string): string {
  return resolveAnnotationFontOption(stored).value;
}

export const DEFAULT_ANNOTATION = {
  width: 0.08,
  height: 0.024,
  font_family: ANNOTATION_DEFAULT_FONT_FAMILY,
  font_size: 16,
  content_html: "<p>nuevo texto</p>",
} as const;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function normalizeFileAnnotation(a: TextAnnotation): TextAnnotation {
  const width = Math.min(1, Math.max(ANNOTATION_MIN_WIDTH, a.width));
  const height = Math.min(1, Math.max(ANNOTATION_MIN_HEIGHT, a.height));
  const size_mode = a.size_mode === "manual" ? "manual" : undefined;
  return {
    ...a,
    type: TEMPLATE_ANNOTATION_TYPES.TEXT,
    x: clamp01(a.x),
    y: clamp01(a.y),
    width,
    height,
    font_size: Math.min(144, Math.max(1, a.font_size)),
    font_family: normalizeAnnotationFontFamily(a.font_family),
    label: a.label.trim() || "—",
    content_html: a.content_html ?? "",
    ...(size_mode ? { size_mode } : {}),
  };
}

export function isDefaultNewTextHtml(html: string): boolean {
  return /^<p>\s*nuevo\s+texto(?:\s+\d+)?\s*<\/p>$/i.test(html.trim());
}

export function shouldAutoFitAnnotationBox(a: TextAnnotation): boolean {
  return isDefaultNewTextHtml(a.content_html);
}
