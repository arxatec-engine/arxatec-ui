export const FILE_VIEW_KIND = {
  NATIVE_DOCUMENT: "native_document",
  PDF: "pdf",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  OFFICE: "office",
  SOURCE: "source",
  UNKNOWN: "unknown",
} as const;

export type FileViewKind = (typeof FILE_VIEW_KIND)[keyof typeof FILE_VIEW_KIND];

export const OFFICE_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

const CODE_MIME_PREFIXES = [
  "text/",
  "application/javascript",
  "application/json",
  "application/xml",
  "application/typescript",
] as const;

const CODE_FILE_EXTENSIONS =
  /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|rb|go|rs|php|sql|sh|bash|md|json|yml|yaml|html|css)$/i;

export function resolveFileViewKind(
  mimeType: string,
  fileName: string,
  nativeDocumentMimeType?: string,
): FileViewKind {
  const mime = mimeType.toLowerCase();

  if (nativeDocumentMimeType && mime === nativeDocumentMimeType.toLowerCase()) {
    return FILE_VIEW_KIND.NATIVE_DOCUMENT;
  }

  if (mime === "application/pdf") return FILE_VIEW_KIND.PDF;
  if (mime.startsWith("image/")) return FILE_VIEW_KIND.IMAGE;
  if (mime.startsWith("video/")) return FILE_VIEW_KIND.VIDEO;
  if (mime.startsWith("audio/")) return FILE_VIEW_KIND.AUDIO;

  if ((OFFICE_MIME_TYPES as readonly string[]).includes(mime)) {
    return FILE_VIEW_KIND.OFFICE;
  }

  const isCode =
    CODE_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix)) ||
    CODE_FILE_EXTENSIONS.test(fileName);

  if (isCode) return FILE_VIEW_KIND.SOURCE;

  return FILE_VIEW_KIND.UNKNOWN;
}

export function resolveOfficeFileExtension(fileName?: string, mimeType?: string): string {
  if (fileName) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext) return ext;
  }
  if (mimeType) {
    const mimeToExt: Record<string, string> = {
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    };
    return mimeToExt[mimeType.toLowerCase()] || "";
  }
  return "";
}
