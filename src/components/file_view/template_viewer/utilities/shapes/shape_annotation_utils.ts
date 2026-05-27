import type {
  EllipseAnnotation,
  LineAnnotation,
  RectAnnotation,
  TemplateAnnotation,
} from "../../../types/annotations";
import {
  isEllipseAnnotation,
  isLineAnnotation,
  isRectAnnotation,
} from "../../../types/annotations";

export type KonvaShapeAnnotation =
  | LineAnnotation
  | RectAnnotation
  | EllipseAnnotation;

export function isShapeToolbarAnnotation(
  ann: TemplateAnnotation | undefined,
): ann is KonvaShapeAnnotation {
  return (
    ann != null &&
    (isLineAnnotation(ann) ||
      isRectAnnotation(ann) ||
      isEllipseAnnotation(ann))
  );
}
