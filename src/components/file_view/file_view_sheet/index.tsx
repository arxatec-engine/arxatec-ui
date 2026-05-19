import { useState } from "react";
import { FileX } from "lucide-react";
import { cn } from "@/utilities/class";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import {
  FILE_VIEW_SHEET_TAB,
  type FileViewSheetTab,
  type FileViewSheetTabItem,
} from "./types";

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

function renderPanelContent(
  content: FileViewSheetPanelRender | undefined,
  isActive: boolean,
) {
  if (!content) return null;
  return typeof content === "function" ? content(isActive) : content;
}

const FileViewSheetPanelContent: React.FC<FileViewSheetPanelProps> = ({
  title,
  isPending = false,
  isError = false,
  tabs = [],
  defaultTab = FILE_VIEW_SHEET_TAB.ORIGINAL,
  showTabs = false,
  renderOriginal,
  renderTranscription,
  renderSummary,
  renderTemplate,
  renderEdit,
}) => {
  const [activeTab, setActiveTab] = useState<FileViewSheetTab>(defaultTab);
  const showViewer = !isPending && !isError;
  const simpleViewer = !showTabs;

  const panelClass = (
    tab: FileViewSheetTab,
    overflow: "hidden" | "auto" = "hidden",
  ) =>
    cn(
      "absolute inset-0 min-w-0 transition-opacity duration-150",
      overflow === "auto" ? "overflow-auto" : "overflow-hidden",
      activeTab === tab
        ? "opacity-100 z-10"
        : "opacity-0 pointer-events-none z-0",
    );

  return (
    <SheetContent className="sm:max-w-[95vw] w-full p-0 flex flex-col gap-0 overflow-hidden">
      <SheetHeader className="px-6 flex flex-row items-center justify-between space-y-0 border-b bg-background relative z-10">
        <SheetTitle className="line-clamp-1 flex-1 mr-4">{title}</SheetTitle>
        <SheetDescription className="sr-only">
          Aquí podrás ver la vista previa del archivo seleccionado.
        </SheetDescription>
      </SheetHeader>

      {showTabs && tabs.length > 0 && (
        <div className="p-1 flex items-center justify-center border-b bg-background">
          <div className="flex items-center gap-4 mr-8">
            <Tabs value={activeTab}>
              <TabsList className="bg-accent">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    className={cn(activeTab === tab.id && "bg-background")}
                    value={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {isPending && (
        <div className="p-4">
          <Skeleton className="flex-1 h-48 w-full rounded-md" />
        </div>
      )}

      {isError && (
        <div className="p-4">
          <StatusMessage
            title="Sucedio un error inesperado"
            description="Vuelve a intentarlo dentro de unos minutos, si el error persiste, contacta con soporte."
            icon={FileX}
          />
        </div>
      )}

      <div className="flex-1 relative min-h-0 bg-background">
        {showViewer &&
          (simpleViewer ? (
            <div className="absolute inset-0 overflow-hidden min-w-0 z-10">
              {renderOriginal}
            </div>
          ) : (
            <>
              <div className={panelClass(FILE_VIEW_SHEET_TAB.ORIGINAL)}>
                {renderOriginal}
              </div>
              {renderTranscription ? (
                <div className={panelClass(FILE_VIEW_SHEET_TAB.TRANSCRIPTION)}>
                  {renderPanelContent(
                    renderTranscription,
                    activeTab === FILE_VIEW_SHEET_TAB.TRANSCRIPTION,
                  )}
                </div>
              ) : null}
              {renderSummary ? (
                <div
                  className={panelClass(FILE_VIEW_SHEET_TAB.SUMMARY, "auto")}
                >
                  {renderPanelContent(
                    renderSummary,
                    activeTab === FILE_VIEW_SHEET_TAB.SUMMARY,
                  )}
                </div>
              ) : null}
              {renderTemplate ? (
                <div className={panelClass(FILE_VIEW_SHEET_TAB.TEMPLATE)}>
                  {renderPanelContent(
                    renderTemplate,
                    activeTab === FILE_VIEW_SHEET_TAB.TEMPLATE,
                  )}
                </div>
              ) : null}
              {renderEdit ? (
                <div className={panelClass(FILE_VIEW_SHEET_TAB.EDIT, "auto")}>
                  {renderPanelContent(
                    renderEdit,
                    activeTab === FILE_VIEW_SHEET_TAB.EDIT,
                  )}
                </div>
              ) : null}
            </>
          ))}
      </div>
    </SheetContent>
  );
};

export interface FileViewSheetProps extends FileViewSheetPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileKey: string;
}

export const FileViewSheet: React.FC<FileViewSheetProps> = ({
  open,
  onOpenChange,
  fileKey,
  ...panelProps
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <FileViewSheetPanelContent key={fileKey} {...panelProps} />
  </Sheet>
);

export { FILE_VIEW_SHEET_TAB };
export type { FileViewSheetTab, FileViewSheetTabItem };
