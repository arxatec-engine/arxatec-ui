import type { FileViewSheetProps } from "./types";
import { Sheet } from "@/components/sheet";
import {
  FILE_VIEW_SHEET_TAB,
  type FileViewSheetTab,
  type FileViewSheetTabItem,
} from "../../types/file_view_sheet";
import { FileViewSheetPanelContent } from "./components/file_view_sheet_panel_content";

export const FileViewSheet = ({
  open,
  onOpenChange,
  fileKey,
  ...panelProps
}: FileViewSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <FileViewSheetPanelContent key={fileKey} {...panelProps} />
  </Sheet>
);

export { FILE_VIEW_SHEET_TAB };
export type { FileViewSheetTab, FileViewSheetTabItem };
