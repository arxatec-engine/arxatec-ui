export const FILE_VIEW_SHEET_TAB = {
  ORIGINAL: "original",
  TRANSCRIPTION: "transcription",
  SUMMARY: "summary",
  TEMPLATE: "template",
  EDIT: "edit",
} as const;

export type FileViewSheetTab =
  (typeof FILE_VIEW_SHEET_TAB)[keyof typeof FILE_VIEW_SHEET_TAB];

export interface FileViewSheetTabItem {
  id: FileViewSheetTab;
  label: string;
  icon?: React.ReactNode;
}
