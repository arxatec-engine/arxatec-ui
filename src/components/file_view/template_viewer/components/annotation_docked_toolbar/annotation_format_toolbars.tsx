import type { MouseEvent as ReactMouseEvent } from "react";
import { BoldIcon } from "lucide-react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities";
import { useActiveAnnotationEditor } from "../../context/use_active_annotation_editor";

function toolbarMouseDown(e: ReactMouseEvent) {
  e.preventDefault();
}

export function AnnotationBoldToolbar() {
  const { active } = useActiveAnnotationEditor();
  const editor = active?.editor ?? null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-7", editor?.isActive("bold") && "bg-accent")}
          disabled={!editor?.can().toggleBold()}
          onMouseDown={toolbarMouseDown}
          onClick={() => {
            editor?.chain().focus().toggleBold().run();
          }}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Negrita</TooltipContent>
    </Tooltip>
  );
}
