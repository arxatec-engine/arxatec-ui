import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { TooltipProvider } from "@/components/tooltip";
import { Separator } from "@/components/separator";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { ToolbarProvider } from "../toolbar_provider";
import { FormattingStylesPopoverToolbar } from "../formatting_styles_popover";
import { Editor } from "@tiptap/core";
import { Maximize2, Minimize2, FileText, Sparkles } from "lucide-react";
import {
  UndoToolbar,
  RedoToolbar,
  HeadingsToolbar,
  LinkToolbar,
  BulletListToolbar,
  OrderedListToolbar,
  HorizontalRuleToolbar,
  AlignmentToolbar,
  ImagePlaceholderToolbar,
  ColorHighlightToolbar,
  SearchAndReplaceToolbar,
  TableToolbar,
} from "../";

export const EditorToolbar = ({
  editor,
  isExpanded,
  onToggleExpand,
  rightContent,
  documentName,
  onOpenChatbot,
}: {
  editor: Editor;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  rightContent?: React.ReactNode;
  documentName?: string;
  onOpenChatbot?: () => void;
}) => {
  return (
    <div className="sticky top-0 z-100 w-full border-b bg-background hidden sm:block">
      <ToolbarProvider editor={editor}>
        <TooltipProvider>
          <ScrollArea className="h-fit py-0.5">
            <div className="flex min-w-full justify-center">
              <div className="flex items-center gap-1 px-4 py-1">
                {/* History Group */}
                <div className="flex items-center gap-1">
                  <UndoToolbar />
                  <RedoToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Estructura, estilos de texto y enlace */}
                <div className="flex items-center gap-1">
                  <HeadingsToolbar />
                  <FormattingStylesPopoverToolbar />
                  <AlignmentToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Lists & Structure Group */}
                <div className="flex items-center gap-1">
                  <LinkToolbar />
                  <BulletListToolbar />
                  <OrderedListToolbar />
                  <TableToolbar />
                  <HorizontalRuleToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Media & Styling Group */}
                <div className="flex items-center gap-1">
                  <ImagePlaceholderToolbar />
                  <ColorHighlightToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Utility Group */}
                <div className="flex items-center gap-1">
                  <SearchAndReplaceToolbar />
                </div>

                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Expansion Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={onToggleExpand}
                    >
                      {isExpanded ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {isExpanded ? "Contraer editor" : "Expandir editor"}
                    </span>
                  </TooltipContent>
                </Tooltip>
                {documentName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md border max-w-[200px] ml-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium truncate text-muted-foreground">
                      {documentName}
                    </span>
                  </div>
                )}
                {onOpenChatbot && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
                        onClick={onOpenChatbot}
                      >
                        <Sparkles className="h-[18px] w-[18px]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Abrir asistente IA</TooltipContent>
                  </Tooltip>
                )}
                {rightContent}
              </div>
            </div>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  );
};
