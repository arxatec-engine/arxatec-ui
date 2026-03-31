import React from "react";
import { UnderlineIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities/index";
import { useToolbar } from "../toolbar_provider";

const UnderlineToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useToolbar();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 p-0 sm:h-9 sm:w-9",
            editor?.isActive("underline") && "bg-accent",
            className
          )}
          onClick={(e) => {
            editor?.chain().focus().toggleUnderline().run();
            onClick?.(e);
          }}
          disabled={!editor?.can().toggleUnderline()}
          ref={ref}
          {...props}
        >
          {children ?? <UnderlineIcon className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Subrayado</span>
      </TooltipContent>
    </Tooltip>
  );
});

UnderlineToolbar.displayName = "UnderlineToolbar";

export { UnderlineToolbar };
