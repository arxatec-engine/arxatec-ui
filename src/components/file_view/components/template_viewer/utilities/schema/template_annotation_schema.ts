import {
  TEMPLATE_ANNOTATION_TYPES,
  type EllipseAnnotation,
  type FileAnnotationsSchema,
  type ImageAnnotation,
  type LineAnnotation,
  type RectAnnotation,
  type TemplateAnnotation,
  type TextAnnotation,
} from "../../../../types/annotations";
import { normalizeFileAnnotation } from "../../constants";
import { normalizeShapeStroke } from "../shapes/shape_defaults";

const DEFAULT_STROKE = "#111827";
const DEFAULT_LINE_STROKE_WIDTH = 0.003;
const DEFAULT_SHAPE_STROKE_WIDTH = 0.002;
const MIN_STROKE_WIDTH = 0.0005;
const MAX_STROKE_WIDTH = 0.05;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(o: Record<string, unknown>, key: string): string | null {
  const v = o[key];
  return typeof v === "string" ? v : null;
}

function readNumber(o: Record<string, unknown>, key: string): number | null {
  const v = o[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function readOptionalNumber(o: Record<string, unknown>, key: string): number | undefined {
  const v = readNumber(o, key);
  return v == null ? undefined : v;
}

function readPage(o: Record<string, unknown>): number | null {
  const page = readNumber(o, "page");
  if (page == null || page < 1 || !Number.isInteger(page)) return null;
  return page;
}

function readZIndex(o: Record<string, unknown>): number | undefined {
  const z = readOptionalNumber(o, "zIndex");
  if (z == null || !Number.isInteger(z)) return undefined;
  return z;
}

function readUuid(o: Record<string, unknown>): string | null {
  const id = readString(o, "id");
  if (!id) return null;
  return id;
}

function normalizeStrokeWidth(value: number | undefined, fallback: number): number {
  const n = value ?? fallback;
  return Math.min(MAX_STROKE_WIDTH, Math.max(MIN_STROKE_WIDTH, n));
}

export function normalizeTextAnnotation(a: TextAnnotation): TextAnnotation {
  return normalizeFileAnnotation(a);
}

export function normalizeLineAnnotation(a: LineAnnotation): LineAnnotation {
  const label = a.label?.trim();
  return {
    ...a,
    type: TEMPLATE_ANNOTATION_TYPES.LINE,
    ...(label ? { label } : {}),
    x1: clamp01(a.x1),
    y1: clamp01(a.y1),
    x2: clamp01(a.x2),
    y2: clamp01(a.y2),
    stroke: normalizeShapeStroke(a.stroke),
    strokeWidth: normalizeStrokeWidth(a.strokeWidth, DEFAULT_LINE_STROKE_WIDTH),
  };
}

export function normalizeRectAnnotation(a: RectAnnotation): RectAnnotation {
  const label = a.label?.trim();
  return {
    ...a,
    type: TEMPLATE_ANNOTATION_TYPES.RECT,
    ...(label ? { label } : {}),
    x: clamp01(a.x),
    y: clamp01(a.y),
    width: Math.min(1, Math.max(0.01, a.width)),
    height: Math.min(1, Math.max(0.01, a.height)),
    stroke: normalizeShapeStroke(a.stroke),
    strokeWidth: normalizeStrokeWidth(a.strokeWidth, DEFAULT_SHAPE_STROKE_WIDTH),
    fill: a.fill ?? null,
  };
}

export function normalizeEllipseAnnotation(a: EllipseAnnotation): EllipseAnnotation {
  const label = a.label?.trim();
  return {
    ...a,
    type: TEMPLATE_ANNOTATION_TYPES.ELLIPSE,
    ...(label ? { label } : {}),
    x: clamp01(a.x),
    y: clamp01(a.y),
    width: Math.min(1, Math.max(0.01, a.width)),
    height: Math.min(1, Math.max(0.01, a.height)),
    stroke: normalizeShapeStroke(a.stroke),
    strokeWidth: normalizeStrokeWidth(a.strokeWidth, DEFAULT_SHAPE_STROKE_WIDTH),
    fill: a.fill ?? null,
  };
}

export function normalizeImageAnnotation(a: ImageAnnotation): ImageAnnotation {
  return {
    ...a,
    type: TEMPLATE_ANNOTATION_TYPES.IMAGE,
    x: clamp01(a.x),
    y: clamp01(a.y),
    width: Math.min(1, Math.max(0.01, a.width)),
    height: Math.min(1, Math.max(0.01, a.height)),
    assetId: a.assetId.trim(),
    label: a.label?.trim(),
  };
}

export function normalizeTemplateAnnotation(a: TemplateAnnotation): TemplateAnnotation {
  switch (a.type) {
    case TEMPLATE_ANNOTATION_TYPES.TEXT:
      return normalizeTextAnnotation(a);
    case TEMPLATE_ANNOTATION_TYPES.LINE:
      return normalizeLineAnnotation(a);
    case TEMPLATE_ANNOTATION_TYPES.RECT:
      return normalizeRectAnnotation(a);
    case TEMPLATE_ANNOTATION_TYPES.ELLIPSE:
      return normalizeEllipseAnnotation(a);
    case TEMPLATE_ANNOTATION_TYPES.IMAGE:
      return normalizeImageAnnotation(a);
    default: {
      const _exhaustive: never = a;
      return _exhaustive;
    }
  }
}

function migrateLegacyTextAnnotation(o: Record<string, unknown>): TextAnnotation | null {
  const id = readUuid(o);
  const page = readPage(o);
  if (!id || page == null) return null;

  const x = readNumber(o, "x");
  const y = readNumber(o, "y");
  const width = readNumber(o, "width");
  const height = readNumber(o, "height");
  const label = readString(o, "label");
  const contentHtml = readString(o, "content_html");
  const fontFamily = readString(o, "font_family");
  const fontSize = readNumber(o, "font_size");

  if (
    x == null ||
    y == null ||
    width == null ||
    height == null ||
    label == null ||
    contentHtml == null ||
    fontFamily == null ||
    fontSize == null
  ) {
    return null;
  }

  const sizeModeRaw = readString(o, "size_mode");
  const size_mode = sizeModeRaw === "manual" ? ("manual" as const) : undefined;

  return {
    id,
    page,
    zIndex: readZIndex(o),
    type: TEMPLATE_ANNOTATION_TYPES.TEXT,
    x,
    y,
    width,
    height,
    label,
    content_html: contentHtml,
    font_family: fontFamily,
    font_size: fontSize,
    ...(size_mode ? { size_mode } : {}),
  };
}

function migrateLineAnnotation(o: Record<string, unknown>): LineAnnotation | null {
  const id = readUuid(o);
  const page = readPage(o);
  const x1 = readNumber(o, "x1");
  const y1 = readNumber(o, "y1");
  const x2 = readNumber(o, "x2");
  const y2 = readNumber(o, "y2");
  const stroke = readString(o, "stroke");
  const strokeWidth = readNumber(o, "strokeWidth");
  if (!id || page == null || x1 == null || y1 == null || x2 == null || y2 == null) {
    return null;
  }
  const label = readString(o, "label");
  return {
    id,
    page,
    zIndex: readZIndex(o),
    type: TEMPLATE_ANNOTATION_TYPES.LINE,
    ...(label ? { label } : {}),
    x1,
    y1,
    x2,
    y2,
    stroke: stroke ?? DEFAULT_STROKE,
    strokeWidth: strokeWidth ?? DEFAULT_LINE_STROKE_WIDTH,
  };
}

function migrateRectAnnotation(o: Record<string, unknown>): RectAnnotation | null {
  const id = readUuid(o);
  const page = readPage(o);
  const x = readNumber(o, "x");
  const y = readNumber(o, "y");
  const width = readNumber(o, "width");
  const height = readNumber(o, "height");
  if (!id || page == null || x == null || y == null || width == null || height == null) {
    return null;
  }
  const fillRaw = o.fill;
  const label = readString(o, "label");
  return {
    id,
    page,
    zIndex: readZIndex(o),
    type: TEMPLATE_ANNOTATION_TYPES.RECT,
    ...(label ? { label } : {}),
    x,
    y,
    width,
    height,
    stroke: readString(o, "stroke") ?? DEFAULT_STROKE,
    strokeWidth: readOptionalNumber(o, "strokeWidth"),
    fill: typeof fillRaw === "string" || fillRaw === null ? fillRaw : null,
  };
}

function migrateEllipseAnnotation(o: Record<string, unknown>): EllipseAnnotation | null {
  const id = readUuid(o);
  const page = readPage(o);
  const x = readNumber(o, "x");
  const y = readNumber(o, "y");
  const width = readNumber(o, "width");
  const height = readNumber(o, "height");
  if (!id || page == null || x == null || y == null || width == null || height == null) {
    return null;
  }
  const fillRaw = o.fill;
  const label = readString(o, "label");
  return {
    id,
    page,
    zIndex: readZIndex(o),
    type: TEMPLATE_ANNOTATION_TYPES.ELLIPSE,
    ...(label ? { label } : {}),
    x,
    y,
    width,
    height,
    stroke: readString(o, "stroke") ?? DEFAULT_STROKE,
    strokeWidth: readOptionalNumber(o, "strokeWidth"),
    fill: typeof fillRaw === "string" || fillRaw === null ? fillRaw : null,
  };
}

function migrateImageAnnotation(o: Record<string, unknown>): ImageAnnotation | null {
  const id = readUuid(o);
  const page = readPage(o);
  const x = readNumber(o, "x");
  const y = readNumber(o, "y");
  const width = readNumber(o, "width");
  const height = readNumber(o, "height");
  const assetId = readString(o, "assetId");
  if (
    !id ||
    page == null ||
    x == null ||
    y == null ||
    width == null ||
    height == null ||
    !assetId
  ) {
    return null;
  }
  return {
    id,
    page,
    zIndex: readZIndex(o),
    type: TEMPLATE_ANNOTATION_TYPES.IMAGE,
    x,
    y,
    width,
    height,
    assetId,
    label: readString(o, "label") ?? undefined,
  };
}

export function migrateTemplateAnnotationFromStorage(raw: unknown): TemplateAnnotation | null {
  const o = asRecord(raw);
  if (!o) return null;

  const type = readString(o, "type");

  if (!type || type === TEMPLATE_ANNOTATION_TYPES.TEXT) {
    return migrateLegacyTextAnnotation(o);
  }

  switch (type) {
    case TEMPLATE_ANNOTATION_TYPES.LINE:
      return migrateLineAnnotation(o);
    case TEMPLATE_ANNOTATION_TYPES.RECT:
      return migrateRectAnnotation(o);
    case TEMPLATE_ANNOTATION_TYPES.ELLIPSE:
      return migrateEllipseAnnotation(o);
    case TEMPLATE_ANNOTATION_TYPES.IMAGE:
      return migrateImageAnnotation(o);
    default:
      return null;
  }
}

export function migrateAnnotationsFromStorage(raw: unknown): TemplateAnnotation[] {
  if (raw == null) return [];

  let candidate: unknown = raw;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate);
    } catch {
      return [];
    }
  }

  const root = asRecord(candidate);
  if (!root) return [];

  let list: unknown[] | null = null;
  if (Array.isArray(root.annotations)) {
    list = root.annotations;
  } else if (asRecord(root.schema)?.annotations && Array.isArray(asRecord(root.schema)!.annotations)) {
    list = asRecord(root.schema)!.annotations as unknown[];
  }

  if (!list) return [];

  const out: TemplateAnnotation[] = [];
  for (const item of list) {
    const migrated = migrateTemplateAnnotationFromStorage(item);
    if (migrated) out.push(normalizeTemplateAnnotation(migrated));
  }
  return out;
}

export function normalizeAnnotationsSchema(s: FileAnnotationsSchema): FileAnnotationsSchema {
  return {
    annotations: s.annotations.map(normalizeTemplateAnnotation),
  };
}

export function parseAndNormalizeAnnotationsSchema(raw: unknown): FileAnnotationsSchema | null {
  const annotations = migrateAnnotationsFromStorage(raw);
  if (raw == null) return { annotations: [] };

  let candidate: unknown = raw;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate);
    } catch {
      return null;
    }
  }

  const root = asRecord(candidate);
  if (!root) return null;

  const hasAnnotationsKey =
    Array.isArray(root.annotations) ||
    (asRecord(root.schema) != null && Array.isArray(asRecord(root.schema)!.annotations));

  if (!hasAnnotationsKey && annotations.length === 0) return null;

  return normalizeAnnotationsSchema({ annotations });
}
