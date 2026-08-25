import type { TemplateAnnotation } from "../../../../../types/annotations";
import type { KonvaShapeAnnotation } from "../types";

import type Konva from "konva";
import {
  isEllipseAnnotation,
  isImageAnnotation,
  isLineAnnotation,
  isRectAnnotation
  } from "../../../../../types/annotations";

export function asKonvaRect(node: Konva.Node): Konva.Rect {
  return node as Konva.Rect;
}

export function asKonvaEllipse(node: Konva.Node): Konva.Ellipse {
  return node as Konva.Ellipse;
}

export function asKonvaImage(node: Konva.Node): Konva.Image {
  return node as Konva.Image;
}

export function isKonvaShape(a: TemplateAnnotation): a is KonvaShapeAnnotation {
  return (
    isLineAnnotation(a) ||
    isRectAnnotation(a) ||
    isEllipseAnnotation(a) ||
    isImageAnnotation(a)
  );
}
