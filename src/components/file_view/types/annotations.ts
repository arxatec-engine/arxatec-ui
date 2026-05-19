export interface FileAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  content_html: string;
  font_family: string;
  font_size: number;
}

export interface FileAnnotationsSchema {
  annotations: FileAnnotation[];
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
