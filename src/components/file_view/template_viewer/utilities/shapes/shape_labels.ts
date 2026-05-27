import type { ShapeDrawTool } from "./template_insert_tool";
import {
  isEllipseAnnotation,
  isImageAnnotation,
  isLineAnnotation,
  isRectAnnotation,
  type TemplateAnnotation,
} from "../../../types/annotations";

const SHAPE_LABEL_PREFIX: Record<ShapeDrawTool, string> = {
  line: "Línea",
  rect: "Rectángulo",
  ellipse: "Elipse",
};

export function shapeKindFromAnnotation(
  ann: TemplateAnnotation,
): ShapeDrawTool | null {
  if (isLineAnnotation(ann)) return "line";
  if (isRectAnnotation(ann)) return "rect";
  if (isEllipseAnnotation(ann)) return "ellipse";
  return null;
}

export function parseShapeLabelNumber(
  label: string,
  kind: ShapeDrawTool,
): number | null {
  const prefix = SHAPE_LABEL_PREFIX[kind];
  const m = label.trim().match(new RegExp(`^${prefix}\\s+(\\d+)$`, "i"));
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function buildShapeLabel(kind: ShapeDrawTool, n: number): string {
  return `${SHAPE_LABEL_PREFIX[kind]} ${n}`;
}

export function displayLabelForAnnotation(
  ann: TemplateAnnotation,
  allAnnotations?: TemplateAnnotation[],
): string {
  if (isImageAnnotation(ann)) {
    if (typeof ann.label === "string" && ann.label.trim()) return ann.label.trim();
    if (allAnnotations?.length) {
      const sameKind = allAnnotations.filter((a) => isImageAnnotation(a));
      const idx = sameKind.findIndex((a) => a.id === ann.id);
      if (idx >= 0) return `Imagen ${idx + 1}`;
    }
    return "Imagen";
  }
  const kind = shapeKindFromAnnotation(ann);
  if (!kind) return "—";
  if ("label" in ann && typeof ann.label === "string" && ann.label.trim()) {
    return ann.label.trim();
  }
  if (allAnnotations?.length) {
    const sameKind = allAnnotations.filter(
      (a) => shapeKindFromAnnotation(a) === kind,
    );
    const idx = sameKind.findIndex((a) => a.id === ann.id);
    if (idx >= 0) return buildShapeLabel(kind, idx + 1);
  }
  return SHAPE_LABEL_PREFIX[kind];
}

export function syncShapeLabelCounters(
  annotations: TemplateAnnotation[],
): Record<ShapeDrawTool, number> {
  const next: Record<ShapeDrawTool, number> = {
    line: 1,
    rect: 1,
    ellipse: 1,
  };
  for (const ann of annotations) {
    const kind = shapeKindFromAnnotation(ann);
    if (!kind) continue;
    const label = "label" in ann && typeof ann.label === "string" ? ann.label : "";
    const n = parseShapeLabelNumber(label, kind);
    if (n != null) next[kind] = Math.max(next[kind], n + 1);
  }
  return next;
}
