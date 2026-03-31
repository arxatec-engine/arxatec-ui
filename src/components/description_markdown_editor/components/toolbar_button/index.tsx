import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import type { Editor } from "@tiptap/react";
import { cn } from "@/utilities";

interface Props {
  editor: Editor | null;
  onClick: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
  canDo: (editor: Editor) => boolean;
  icon: React.ElementType;
  label: string;
  className?: string;
}

export const ToolbarButton: React.FC<Props> = ({
  editor,
  onClick,
  isActive,
  canDo,
  icon: Icon,
  label,
  className,
}) => {
  if (!editor) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "size-7 shrink-0",
            isActive(editor) && "bg-accent",
            className
          )}
          size="sm"
          onClick={() => onClick(editor)}
          disabled={!canDo(editor)}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
};
