export const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type WordDocumentFormat = "docx" | "doc" | "odt";

export function resolveWordDocumentFormat(
  fileName?: string,
  mimeType?: string | null,
): WordDocumentFormat | null {
  const extension = fileName
    ?.split(/[?#]/, 1)[0]
    .match(/\.([^.]+)$/)?.[1]
    .toLowerCase();
  if (extension === "docx" || extension === "doc" || extension === "odt") {
    return extension;
  }

  switch (mimeType?.split(";", 1)[0].trim().toLowerCase()) {
    case DOCX_MIME:
      return "docx";
    case "application/msword":
      return "doc";
    case "application/vnd.oasis.opendocument.text":
      return "odt";
    default:
      return null;
  }
}
