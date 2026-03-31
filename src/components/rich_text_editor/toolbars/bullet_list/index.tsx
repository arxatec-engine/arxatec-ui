import React from "react";
import { List } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const BulletListToolbar = React.forwardRef<
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
            editor?.isActive("bulletList") && "bg-accent",
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleBulletList().run();
            onClick?.(e);
          }}
          ref={ref}
          {...props}
        >
          {children ?? <List className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Lista de viñetas</span>
      </TooltipContent>
    </Tooltip>
  );
});

BulletListToolbar.displayName = "BulletListToolbar";

export { BulletListToolbar };
