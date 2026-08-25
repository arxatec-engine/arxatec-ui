import type {
  EllipseAnnotation,
  ImageAnnotation,
  LineAnnotation,
  RectAnnotation,
} from "../../../../../types/annotations";

export type KonvaShapeAnnotation =
  | LineAnnotation
  | RectAnnotation
  | EllipseAnnotation
  | ImageAnnotation;

export type DraftShape =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "ellipse"; x: number; y: number; width: number; height: number };
