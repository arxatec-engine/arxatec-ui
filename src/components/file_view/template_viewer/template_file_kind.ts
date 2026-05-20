export function normalizeMimeBase(mimeType: string): string {
  return mimeType.trim().toLowerCase().split(";")[0].trim();
}

export const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function resolveTemplateFileKind(
  mimeType: string,
  fileName?: string,
): {
  supportsTemplateAnnotations: boolean;
  isPdf: boolean;
  isDocx: boolean;
} {
  const mt = normalizeMimeBase(mimeType);
  const nm = (fileName ?? "").toLowerCase();
  const isDocx = mt === DOCX_MIME || nm.endsWith(".docx");
  const isPdf = (mt === "application/pdf" || nm.endsWith(".pdf")) && !isDocx;
  return {
    supportsTemplateAnnotations: isPdf || isDocx,
    isPdf,
    isDocx,
  };
}
