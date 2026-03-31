import { ListOrdered } from "lucide-react";
import React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const OrderedListToolbar = React.forwardRef<
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
            editor?.isActive("orderedList") && "bg-accent",
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleOrderedList().run();
            onClick?.(e);
          }}
          ref={ref}
          {...props}
        >
          {children ?? <ListOrdered className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Lista numerada</span>
      </TooltipContent>
    </Tooltip>
  );
});

OrderedListToolbar.displayName = "OrderedListToolbar";

export { OrderedListToolbar };
