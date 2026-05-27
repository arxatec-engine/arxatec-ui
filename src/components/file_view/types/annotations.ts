export const TEMPLATE_ANNOTATION_TYPES = {
  TEXT: "text",
  LINE: "line",
  RECT: "rect",
  ELLIPSE: "ellipse",
  IMAGE: "image",
} as const;

export type TemplateAnnotationType =
  (typeof TEMPLATE_ANNOTATION_TYPES)[keyof typeof TEMPLATE_ANNOTATION_TYPES];

export interface TemplateAnnotationBase {
  id: string;
  page: number;
  zIndex?: number;
}

export type TextAnnotationSizeMode = "auto" | "manual";

export interface TextAnnotation extends TemplateAnnotationBase {
  type: typeof TEMPLATE_ANNOTATION_TYPES.TEXT;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  content_html: string;
  font_family: string;
  font_size: number;
  size_mode?: TextAnnotationSizeMode;
}

export interface LineAnnotation extends TemplateAnnotationBase {
  type: typeof TEMPLATE_ANNOTATION_TYPES.LINE;
  label?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
}

export interface RectAnnotation extends TemplateAnnotationBase {
  type: typeof TEMPLATE_ANNOTATION_TYPES.RECT;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
}

export interface EllipseAnnotation extends TemplateAnnotationBase {
  type: typeof TEMPLATE_ANNOTATION_TYPES.ELLIPSE;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
}

export interface ImageAnnotation extends TemplateAnnotationBase {
  type: typeof TEMPLATE_ANNOTATION_TYPES.IMAGE;
  x: number;
  y: number;
  width: number;
  height: number;
  assetId: string;
  label?: string;
}

export type TemplateAnnotation =
  | TextAnnotation
  | LineAnnotation
  | RectAnnotation
  | EllipseAnnotation
  | ImageAnnotation;

export type FileAnnotation = TextAnnotation;

export interface FileAnnotationsSchema {
  annotations: TemplateAnnotation[];
}

export interface FileAnnotationsRow {
  id: string;
  file_id: string;
  schema: FileAnnotationsSchema;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface FileTemplateExportResult {
  id: string;
  name: string;
}

export interface FileTemplateViewerApi {
  getFileUrl: (fileId: string) => Promise<string>;
  getDocxPreviewPdfBlob: (fileId: string) => Promise<Blob>;
  uploadAnnotationImage?: (
    fileId: string,
    file: File,
  ) => Promise<{ assetId: string; url?: string }>;
  getAnnotationAssetUrl?: (fileId: string, assetId: string) => Promise<string>;
  getAnnotations: (fileId: string) => Promise<FileAnnotationsRow | null | undefined>;
  updateAnnotations: (
    fileId: string,
    schema: FileAnnotationsSchema,
  ) => Promise<FileAnnotationsRow>;
  exportAnnotatedPdf: (fileId: string, name?: string) => Promise<FileTemplateExportResult>;
  deleteFile: (fileId: string) => Promise<void>;
  onAnnotationsSaved?: (fileId: string, row: FileAnnotationsRow) => void;
  onDocumentsInvalidate?: () => void;
}

export function isTextAnnotation(a: TemplateAnnotation): a is TextAnnotation {
  return a.type === TEMPLATE_ANNOTATION_TYPES.TEXT;
}

export function isLineAnnotation(a: TemplateAnnotation): a is LineAnnotation {
  return a.type === TEMPLATE_ANNOTATION_TYPES.LINE;
}

export function isRectAnnotation(a: TemplateAnnotation): a is RectAnnotation {
  return a.type === TEMPLATE_ANNOTATION_TYPES.RECT;
}

export function isEllipseAnnotation(a: TemplateAnnotation): a is EllipseAnnotation {
  return a.type === TEMPLATE_ANNOTATION_TYPES.ELLIPSE;
}

export function isImageAnnotation(a: TemplateAnnotation): a is ImageAnnotation {
  return a.type === TEMPLATE_ANNOTATION_TYPES.IMAGE;
}
