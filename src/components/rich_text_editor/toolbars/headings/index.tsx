import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";
import { useMediaQuery } from "@/hooks";
import { MobileToolbarGroup, MobileToolbarItem } from "../";

const levels = [1, 2, 3, 4] as const;

export const HeadingsToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const activeLevel = levels.find((level) =>
    editor?.isActive("heading", { level }),
  );

  if (isMobile) {
    return (
      <MobileToolbarGroup label={activeLevel ? `T${activeLevel}` : "Normal"}>
        <MobileToolbarItem
          onClick={() => editor?.chain().focus().setParagraph().run()}
          active={!editor?.isActive("heading")}
        >
          Normal
        </MobileToolbarItem>
        {levels.map((level) => (
          <MobileToolbarItem
            key={level}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level }).run()
            }
            active={editor?.isActive("heading", { level })}
          >
            Título {level}
          </MobileToolbarItem>
        ))}
      </MobileToolbarGroup>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          title="Encabezados"
          className={cn(
            "h-8 w-max gap-1 px-3 font-normal",
            editor?.isActive("heading") && "bg-accent",
            className,
          )}
          ref={ref}
          {...props}
        >
          {activeLevel ? `Título ${activeLevel}` : "Normal"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => editor?.chain().focus().setParagraph().run()}
          className={cn(
            "flex items-center gap-2 h-fit",
            !editor?.isActive("heading") && "bg-accent",
          )}
        >
          Normal
        </DropdownMenuItem>
        {levels.map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level }).run()
            }
            className={cn(
              "flex items-center gap-2",
              editor?.isActive("heading", { level }) && "bg-accent",
            )}
          >
            Título {level}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

HeadingsToolbar.displayName = "HeadingsToolbar";
