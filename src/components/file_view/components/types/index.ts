export interface FilePreviewSource {
  url: string;
  file: File | null;
  fileName: string;
  mimeType: string;
}

export type Mode = "file" | "url";
