import React from "react";
import { BoldIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const BoldToolbar = React.forwardRef<
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
            editor?.isActive("bold") && "bg-accent",
            className
          )}
          onClick={(e) => {
            editor?.chain().focus().toggleBold().run();
            onClick?.(e);
          }}
          disabled={!editor?.can().toggleBold()}
          ref={ref}
          {...props}
        >
          {children ?? <BoldIcon className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Negrita</span>
        <span className="ml-1 text-xs text-gray-11">(cmd + b)</span>
      </TooltipContent>
    </Tooltip>
  );
});

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };
