import { extensionFromFileName, extensionFromMime } from "./mime_extensions";

export type FileKind =
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "json"
  | "markup"
  | "font"
  | "database"
  | "binary"
  | "unknown";

export interface FileKindStyle {
  color: string;
  accent: string;
  fallbackLabel: string;
}

export const FILE_KIND_STYLES: Record<FileKind, FileKindStyle> = {
  pdf: {
    color: "text-red-600 dark:text-red-500",
    accent:
      "[--file-kind:var(--color-red-600)] dark:[--file-kind:var(--color-red-500)]",
    fallbackLabel: "PDF",
  },
  document: {
    color: "text-blue-600 dark:text-blue-500",
    accent:
      "[--file-kind:var(--color-blue-600)] dark:[--file-kind:var(--color-blue-500)]",
    fallbackLabel: "DOC",
  },
  spreadsheet: {
    color: "text-emerald-700 dark:text-emerald-600",
    accent:
      "[--file-kind:var(--color-emerald-700)] dark:[--file-kind:var(--color-emerald-600)]",
    fallbackLabel: "XLS",
  },
  presentation: {
    color: "text-orange-600 dark:text-orange-500",
    accent:
      "[--file-kind:var(--color-orange-600)] dark:[--file-kind:var(--color-orange-500)]",
    fallbackLabel: "PPT",
  },
  image: {
    color: "text-violet-600 dark:text-violet-500",
    accent:
      "[--file-kind:var(--color-violet-600)] dark:[--file-kind:var(--color-violet-500)]",
    fallbackLabel: "IMG",
  },
  video: {
    color: "text-pink-600 dark:text-pink-500",
    accent:
      "[--file-kind:var(--color-pink-600)] dark:[--file-kind:var(--color-pink-500)]",
    fallbackLabel: "VID",
  },
  audio: {
    color: "text-cyan-700 dark:text-cyan-600",
    accent:
      "[--file-kind:var(--color-cyan-700)] dark:[--file-kind:var(--color-cyan-600)]",
    fallbackLabel: "AUD",
  },
  archive: {
    color: "text-amber-700 dark:text-amber-600",
    accent:
      "[--file-kind:var(--color-amber-700)] dark:[--file-kind:var(--color-amber-600)]",
    fallbackLabel: "ZIP",
  },
  code: {
    color: "text-sky-600 dark:text-sky-500",
    accent:
      "[--file-kind:var(--color-sky-600)] dark:[--file-kind:var(--color-sky-500)]",
    fallbackLabel: "CODE",
  },
  json: {
    color: "text-lime-700 dark:text-lime-600",
    accent:
      "[--file-kind:var(--color-lime-700)] dark:[--file-kind:var(--color-lime-600)]",
    fallbackLabel: "JSON",
  },
  markup: {
    color: "text-teal-700 dark:text-teal-600",
    accent:
      "[--file-kind:var(--color-teal-700)] dark:[--file-kind:var(--color-teal-600)]",
    fallbackLabel: "XML",
  },
  font: {
    color: "text-fuchsia-600 dark:text-fuchsia-500",
    accent:
      "[--file-kind:var(--color-fuchsia-600)] dark:[--file-kind:var(--color-fuchsia-500)]",
    fallbackLabel: "FONT",
  },
  database: {
    color: "text-indigo-600 dark:text-indigo-500",
    accent:
      "[--file-kind:var(--color-indigo-600)] dark:[--file-kind:var(--color-indigo-500)]",
    fallbackLabel: "DB",
  },
  binary: {
    color: "text-zinc-600 dark:text-zinc-500",
    accent:
      "[--file-kind:var(--color-zinc-600)] dark:[--file-kind:var(--color-zinc-500)]",
    fallbackLabel: "BIN",
  },
  unknown: {
    color: "text-slate-500 dark:text-slate-500",
    accent:
      "[--file-kind:var(--color-slate-500)] dark:[--file-kind:var(--color-slate-500)]",
    fallbackLabel: "FILE",
  },
};

const MIME_TO_KIND: Record<string, FileKind> = {
  "application/pdf": "pdf",

  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "application/vnd.oasis.opendocument.text": "document",
  "text/plain": "document",
  "text/rtf": "document",
  "application/rtf": "document",

  "application/vnd.google-apps.document": "document",
  "application/vnd.google-apps.kix": "document",

  "application/vnd.ms-excel": "spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "spreadsheet",
  "application/vnd.oasis.opendocument.spreadsheet": "spreadsheet",
  "text/csv": "spreadsheet",
  "application/vnd.google-apps.spreadsheet": "spreadsheet",

  "application/vnd.ms-powerpoint": "presentation",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "presentation",
  "application/vnd.oasis.opendocument.presentation": "presentation",
  "application/vnd.google-apps.presentation": "presentation",

  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/bmp": "image",
  "image/webp": "image",
  "image/tiff": "image",
  "image/svg+xml": "image",
  "image/x-icon": "image",
  "image/vnd.microsoft.icon": "image",
  "image/heic": "image",
  "image/heif": "image",
  "application/vnd.google-apps.drawing": "image",
  "application/vnd.google-apps.photo": "image",

  "video/mp4": "video",
  "video/mpeg": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "video/x-ms-wmv": "video",
  "video/webm": "video",
  "video/ogg": "video",
  "video/3gpp": "video",
  "video/x-flv": "video",

  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/webm": "audio",
  "audio/aac": "audio",
  "audio/x-m4a": "audio",
  "audio/flac": "audio",
  "audio/x-ms-wma": "audio",

  "application/zip": "archive",
  "application/vnd.rar": "archive",
  "application/x-rar-compressed": "archive",
  "application/x-7z-compressed": "archive",
  "application/x-tar": "archive",
  "application/gzip": "archive",
  "application/x-bzip2": "archive",

  "text/html": "code",
  "text/css": "code",
  "text/javascript": "code",
  "application/javascript": "code",
  "application/typescript": "code",
  "text/x-python": "code",
  "text/x-java": "code",
  "text/x-c": "code",
  "text/x-c++": "code",
  "text/x-php": "code",
  "text/x-ruby": "code",
  "text/x-go": "code",
  "text/x-rust": "code",
  "application/x-sh": "code",
  "application/vnd.google-apps.script": "code",
  "text/markdown": "code",

  "application/json": "json",
  "application/ld+json": "json",

  "application/xml": "markup",
  "text/xml": "markup",

  "application/sql": "database",
  "application/x-sqlite3": "database",

  "application/octet-stream": "binary",
  "application/x-msdownload": "binary",
  "application/x-executable": "binary",
  "application/vnd.google-apps.form": "binary",
  "application/vnd.google-apps.shortcut": "binary",

  "font/ttf": "font",
  "font/otf": "font",
  "font/woff": "font",
  "font/woff2": "font",
  "application/font-woff": "font",
};

export const SHEET_BODY =
  "M6.5 1.5h7L20 8v12.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2v-17a2 2 0 0 1 2-2Z";
export const SHEET_FOLD = "M13.5 1.5 20 8h-4.5a2 2 0 0 1-2-2Z";
export const SHEET_BAND = "M4.5 14H20v6.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2Z";

export const LABEL_FONT_SIZE: Record<number, number> = {
  1: 7.4,
  2: 7.4,
  3: 6.4,
  4: 5.2,
};

export const getFileKindStyle = (mimeType: string): FileKindStyle =>
  FILE_KIND_STYLES[MIME_TO_KIND[mimeType] ?? "unknown"];

export const getFileTypeLabel = (
  mimeType: string,
  fileName?: string,
): string => {
  const fromName = fileName ? extensionFromFileName(fileName) : null;
  const ext = fromName ?? extensionFromMime(mimeType);
  const label = ext ?? getFileKindStyle(mimeType).fallbackLabel;
  return label.toUpperCase().slice(0, 4);
};
