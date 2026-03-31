import React from "react";
import { Image } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";

const ImagePlaceholderToolbar = React.forwardRef<
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
            editor?.isActive("image-placeholder") && "bg-accent",
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            editor?.chain().focus().insertImagePlaceholder().run();
            onClick?.(e);
          }}
          ref={ref}
          {...props}
        >
          {children ?? <Image className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Imagen</span>
      </TooltipContent>
    </Tooltip>
  );
});

ImagePlaceholderToolbar.displayName = "ImagePlaceholderToolbar";

export { ImagePlaceholderToolbar };
