import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { TooltipProvider } from "@/components/tooltip";
import { Separator } from "@/components/separator";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { ToolbarProvider } from "../toolbar_provider";
import { Editor } from "@tiptap/core";
import { Maximize2, Minimize2 } from "lucide-react";
import {
  CodeToolbar,
  BoldToolbar,
  UndoToolbar,
  RedoToolbar,
  HeadingsToolbar,
  BlockquoteToolbar,
  ItalicToolbar,
  UnderlineToolbar,
  StrikeThroughToolbar,
  LinkToolbar,
  BulletListToolbar,
  OrderedListToolbar,
  HorizontalRuleToolbar,
  AlignmentToolbar,
  ImagePlaceholderToolbar,
  ColorHighlightToolbar,
  SearchAndReplaceToolbar,
  CodeBlockToolbar,
} from "../";

export const EditorToolbar = ({
  editor,
  isExpanded,
  onToggleExpand,
  rightContent,
}: {
  editor: Editor;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  rightContent?: React.ReactNode;
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

                {/* Text Structure Group */}
                <div className="flex items-center gap-1">
                  <HeadingsToolbar />
                  <BlockquoteToolbar />
                  <CodeToolbar />
                  <CodeBlockToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Basic Formatting Group */}
                <div className="flex items-center gap-1">
                  <BoldToolbar />
                  <ItalicToolbar />
                  <UnderlineToolbar />
                  <StrikeThroughToolbar />
                  <LinkToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Lists & Structure Group */}
                <div className="flex items-center gap-1">
                  <BulletListToolbar />
                  <OrderedListToolbar />
                  <HorizontalRuleToolbar />
                </div>
                <Separator orientation="vertical" className="mx-1 h-7" />

                {/* Alignment Group */}
                <AlignmentToolbar />
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
                      className="h-9 w-9"
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
