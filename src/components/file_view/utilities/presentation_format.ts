export const PPTX_MIME =
  "application/vnd.openxmlformats-officedocument.presentationml.presentation";
export const PPT_MIME = "application/vnd.ms-powerpoint";

export type PresentationFormat = "pptx" | "ppt";

export function resolvePresentationFormat(
  fileName?: string,
  mimeType?: string | null,
): PresentationFormat | null {
  const extension = fileName
    ?.split(/[?#]/, 1)[0]
    .match(/\.([^./]+)$/)?.[1]
    .toLowerCase();
  if (extension === "pptx" || extension === "ppt") return extension;
  switch (mimeType?.split(";", 1)[0].trim().toLowerCase()) {
    case PPTX_MIME:
      return "pptx";
    case PPT_MIME:
      return "ppt";
    default:
      return null;
  }
}
