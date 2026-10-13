import type { ReactNode } from "react";

export const FOLDER_VARIANT = {
  DEFAULT: "default",
  SHARED: "shared",
  DRIVE: "drive",
} as const;
export type FolderVariant =
  (typeof FOLDER_VARIANT)[keyof typeof FOLDER_VARIANT];

export const MARK_COLOR = "var(--primary-foreground)";

export const MARKS: Record<FolderVariant, ReactNode> = {
  [FOLDER_VARIANT.DEFAULT]: null,
  [FOLDER_VARIANT.SHARED]: (
    <>
      <circle cx="12.25" cy="13.4" r="1.75" />
      <path d="M8.6 19.4a3.65 3.65 0 0 1 7.3 0Z" />
    </>
  ),
  [FOLDER_VARIANT.DRIVE]: (
    <>
      <rect x="8.5" y="12.3" width="7.4" height="1.9" rx="0.65" />
      <rect x="8.5" y="14.9" width="7.4" height="1.9" rx="0.65" />
      <rect x="8.5" y="17.5" width="7.4" height="1.9" rx="0.65" />
    </>
  ),
};

export const FOLDER_BODY =
  "M4.5 6.5a2 2 0 0 1 2-2h3.36a2 2 0 0 1 1.42.59l1.23 1.23a2 2 0 0 0 1.41.59H18a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2Z";

export const FOLDER_FRONT = "M4.5 9.6h15.5V18a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2Z";
