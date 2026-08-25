export const CODE_MIME_PREFIXES = [
  "text/",
  "application/javascript",
  "application/json",
  "application/xml",
  "application/typescript",
] as const;

export const CODE_FILE_EXTENSIONS =
  /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|rb|go|rs|php|sql|sh|bash|md|json|yml|yaml|html|css)$/i;

export const OFFICE_MIME_TYPES = [
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const;

export const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const XLS_MIME = "application/vnd.ms-excel";
