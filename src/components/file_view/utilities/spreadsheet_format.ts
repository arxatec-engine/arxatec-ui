export const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const XLS_MIME = "application/vnd.ms-excel";

export function resolveSpreadsheetFormat(
  fileName?: string,
  mimeType?: string | null,
): "xls" | "xlsx" | null {
  const extension = fileName
    ?.split(/[?#]/, 1)[0]
    .match(/\.([^.]+)$/)?.[1]
    .toLowerCase();
  if (extension === "xls" || extension === "xlsx") return extension;
  switch (mimeType?.split(";", 1)[0].trim().toLowerCase()) {
    case XLSX_MIME:
      return "xlsx";
    case XLS_MIME:
      return "xls";
    default:
      return null;
  }
}
