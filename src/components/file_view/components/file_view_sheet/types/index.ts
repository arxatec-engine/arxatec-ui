import {
    type FileViewSheetTab,
  type FileViewSheetTabItem
} from "../../../types/file_view_sheet";

export type FileViewSheetPanelRender =
  | React.ReactNode
  | ((isActive: boolean) => React.ReactNode);

export interface FileViewSheetPanelProps {
  title: string;
  isPending?: boolean;
  isError?: boolean;
  tabs?: FileViewSheetTabItem[];
  defaultTab?: FileViewSheetTab;
  showTabs?: boolean;
  renderOriginal: React.ReactNode;
  renderTranscription?: FileViewSheetPanelRender;
  renderSummary?: FileViewSheetPanelRender;
  renderTemplate?: FileViewSheetPanelRender;
  renderEdit?: FileViewSheetPanelRender;
}

export interface FileViewSheetProps extends FileViewSheetPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileKey: string;
}
