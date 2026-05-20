import { inferMimeFromFileName } from "./infer_mime_from_file_name";

export function effectiveMimeFromFile(file: File): string {
  const type = file.type.trim().toLowerCase();
  if (type && type !== "application/octet-stream" && type !== "binary/octet-stream") {
    return type;
  }
  return inferMimeFromFileName(file.name) ?? type;
}
