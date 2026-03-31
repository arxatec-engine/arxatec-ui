import React from "react";
import { Strikethrough } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const StrikeThroughToolbar = React.forwardRef<
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
            editor?.isActive("strike") && "bg-accent",
            className
          )}
          onClick={(e) => {
            editor?.chain().focus().toggleStrike().run();
            onClick?.(e);
          }}
          disabled={!editor?.can().toggleStrike()}
          ref={ref}
          {...props}
        >
          {children ?? <Strikethrough className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Tachado</span>
      </TooltipContent>
    </Tooltip>
  );
});

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };
