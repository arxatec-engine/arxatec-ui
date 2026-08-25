import { inferMimeFromFileName } from "../../utilities/infer_mime_from_file_name";

export const resolveMime = (fileName: string, fallback?: string) =>
  fallback && fallback.length > 0
    ? fallback
    : (inferMimeFromFileName(fileName) ?? "application/octet-stream");

export const fileNameFromUrl = (url: string) => {
  try {
    const { pathname } = new URL(url, window.location.href);
    const last = pathname.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : "archivo";
  } catch {
    return "archivo";
  }
};
