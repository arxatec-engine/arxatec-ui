import React from "react";
import { WrapText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const HardBreakToolbar = React.forwardRef<
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
          className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", className)}
          onClick={(e) => {
            editor?.chain().focus().setHardBreak().run();
            onClick?.(e);
          }}
          ref={ref}
          {...props}
        >
          {children ?? <WrapText className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Hard break</span>
      </TooltipContent>
    </Tooltip>
  );
});

HardBreakToolbar.displayName = "HardBreakToolbar";

export { HardBreakToolbar };
