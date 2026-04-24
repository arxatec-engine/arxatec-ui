import React from "react";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

export interface MagicAiToolbarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const MagicAiToolbar = React.forwardRef<HTMLButtonElement, MagicAiToolbarProps>(
  ({ className, onClick, isActive, ...props }, ref) => {
    useToolbar();

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 p-0 sm:h-9 sm:w-9 text-primary hover:text-primary hover:bg-primary/10",
              isActive && "bg-primary/20",
              className,
            )}
            onClick={(e) => {
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            <Sparkles className="h-4 w-4 fill-current" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <span className="font-bold">Magic AI</span>
            <span className="text-xs text-muted-foreground">
              Pregúntale a la IA que edite esta selección
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  },
);

MagicAiToolbar.displayName = "MagicAiToolbar";

export { MagicAiToolbar };
