import type { FileAnnotation, FileAnnotationsSchema } from "../../types/annotations";

export const ANNOTATION_DEBOUNCE_MS = 800;
export const ANNOTATION_MIN_WIDTH = 0.06;
export const ANNOTATION_MIN_HEIGHT = 0.04;

export const DEFAULT_ANNOTATION = {
  width: 0.2,
  height: 0.065,
  font_family: "Arial, Helvetica, sans-serif",
  font_size: 16,
  content_html: "<p>nuevo texto</p>",
} as const;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function normalizeFileAnnotation(a: FileAnnotation): FileAnnotation {
  const width = Math.min(1, Math.max(ANNOTATION_MIN_WIDTH, a.width));
  const height = Math.min(1, Math.max(ANNOTATION_MIN_HEIGHT, a.height));
  return {
    ...a,
    x: clamp01(a.x),
    y: clamp01(a.y),
    width,
    height,
    font_size: Math.min(144, Math.max(1, a.font_size)),
  };
}

export function normalizeAnnotationsSchema(s: FileAnnotationsSchema): FileAnnotationsSchema {
  return {
    annotations: s.annotations.map(normalizeFileAnnotation),
  };
}

export function shouldAutoFitAnnotationBox(a: FileAnnotation): boolean {
  const isInitialNewText = /^<p>\s*nuevo texto(?:\s+\d+)?\s*<\/p>$/i.test(a.content_html.trim());
  return (
    Math.abs(a.width - DEFAULT_ANNOTATION.width) < 0.08 &&
    Math.abs(a.height - DEFAULT_ANNOTATION.height) < 0.003 &&
    isInitialNewText
  );
}
