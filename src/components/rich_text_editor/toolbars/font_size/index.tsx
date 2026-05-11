import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";
import { useMediaQuery } from "@/hooks";
import { MobileToolbarGroup, MobileToolbarItem } from "../mobile_toolbar_group";
import { FONT_SIZE_PRESETS } from "./constants";

export const FontSizeToolbar = () => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const current =
    (editor?.getAttributes("textStyle").fontSize as string | undefined) ?? "";

  const activeLabel = current || "Tamaño";

  if (isMobile) {
    return (
      <MobileToolbarGroup label={activeLabel}>
        <MobileToolbarItem
          onClick={() => editor?.chain().focus().unsetFontSize().run()}
          active={!current}
        >
          Predeterminado
        </MobileToolbarItem>
        {FONT_SIZE_PRESETS.map((size) => (
          <MobileToolbarItem
            key={size}
            onClick={() => editor?.chain().focus().setFontSize(size).run()}
            active={current === size}
          >
            {size.replace("px", " pt")}
          </MobileToolbarItem>
        ))}
      </MobileToolbarGroup>
    );
  }

  return (
    <Popover>
      <div className="relative h-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("h-8 w-14 gap-1 px-2 font-normal")}
              >
                <span className="text-xs">{current || "—"}</span>
                <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Tamaño de fuente</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          className="w-48 p-0"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="max-h-[min(70vh,22rem)] overflow-y-auto overflow-x-hidden p-1">
            <div className="mb-2 mt-2 px-2 text-xs text-muted-foreground">
              Tamaño
            </div>
            <button
              type="button"
              onClick={() => editor?.chain().focus().unsetFontSize().run()}
              className={cn(
                "flex w-full min-h-9 items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                !current && "bg-accent",
              )}
            >
              Predeterminado
              {!current ? <CheckIcon className="h-4 w-4 shrink-0" /> : null}
            </button>
            {FONT_SIZE_PRESETS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => editor?.chain().focus().setFontSize(size).run()}
                className={cn(
                  "flex w-full min-h-9 items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                  current === size && "bg-accent",
                )}
              >
                <span className="tabular-nums">{size}</span>
                {current === size ? (
                  <CheckIcon className="h-4 w-4 shrink-0" />
                ) : null}
              </button>
            ))}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
};
