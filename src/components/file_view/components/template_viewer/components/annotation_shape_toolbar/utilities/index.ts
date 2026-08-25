import {
  isEllipseAnnotation,
  isRectAnnotation,
} from "../../../../../types/annotations";
import {
  type KonvaShapeAnnotation,
  SHAPE_COLOR_PALETTE,
  type ShapeColorValue
      } from "../../../utilities";

export function strokePickerValue(ann: KonvaShapeAnnotation): ShapeColorValue {
  const s = ann.stroke?.trim();
  if (!s || s.toLowerCase() === "transparent") return "transparent";
  const hit = SHAPE_COLOR_PALETTE.find(
    (c) => c.value.toLowerCase() === s.toLowerCase(),
  );
  return hit?.value ?? "#000000";
}

export function fillPickerValue(ann: KonvaShapeAnnotation): string | null {
  if (!isRectAnnotation(ann) && !isEllipseAnnotation(ann)) return null;
  const f = ann.fill;
  if (!f || f === "transparent") return "transparent";
  return f;
}

export function applyStrokeColor(
  ann: KonvaShapeAnnotation,
  color: ShapeColorValue,
): KonvaShapeAnnotation {
  return {
    ...ann,
    stroke: color === "transparent" ? "transparent" : color,
  };
}

export function applyFillColor(
  ann: KonvaShapeAnnotation,
  color: ShapeColorValue,
): KonvaShapeAnnotation {
  if (!isRectAnnotation(ann) && !isEllipseAnnotation(ann)) return ann;
  const fill = color === "transparent" ? null : color;
  return { ...ann, fill };
}
