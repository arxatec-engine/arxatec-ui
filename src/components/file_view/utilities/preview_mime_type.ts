import { inferMimeFromFileName } from "./infer_mime_from_file_name";

export const getFilePreviewMimeType = (
  fileName: string,
  mimeType?: string | null,
): string => {
  const mime = mimeType?.split(";", 1)[0].trim().toLowerCase();
  if (
    mime &&
    mime !== "application/octet-stream" &&
    mime !== "binary/octet-stream"
  ) {
    return mime;
  }
  return inferMimeFromFileName(fileName) ?? mime ?? "application/octet-stream";
};
