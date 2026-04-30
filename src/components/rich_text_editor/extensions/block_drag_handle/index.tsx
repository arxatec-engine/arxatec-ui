import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { Editor } from "@tiptap/core";
import { GripVertical } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities";

const NESTED_DRAG = {
  edgeDetection: { threshold: -16 },
} as const;

export function BlockDragHandle({
  editor,
  className,
}: {
  editor: Editor;
  className?: string;
}) {
  const blockPosRef = useRef<number | null>(null);

  return (
    <DragHandle
      editor={editor}
      nested={NESTED_DRAG}
      computePositionConfig={{
        strategy: "fixed",
        placement: "left-start",
      }}
      onNodeChange={({ pos }) => {
        blockPosRef.current = pos;
      }}
      className={cn(
        "tiptap-block-drag-handle z-50 flex! items-center! justify-center!",
        className
      )}
    >
      <div className="flex items-center gap-px rounded-md border border-border/70 bg-background/95 p-px shadow-sm backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-4 shrink-0 cursor-grab rounded-[5px] border border-transparent text-muted-foreground hover:border-border/50 hover:bg-muted hover:text-foreground active:cursor-grabbing"
              aria-label="Arrastrar bloque para reordenar"
            >
              <GripVertical className="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="start"
            className="max-w-56 space-y-1.5 text-xs"
          >
            Arrastrar para mover el bloque
          </TooltipContent>
        </Tooltip>
      </div>
    </DragHandle>
  );
}
