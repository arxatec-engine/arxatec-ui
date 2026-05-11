import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { ScrollArea } from "@/components/scroll_area";
import { cn } from "@/utilities";
import { useToolbar } from "../toolbar_provider";
import { useMediaQuery } from "@/hooks";
import { MobileToolbarGroup, MobileToolbarItem } from "../mobile_toolbar_group";
import { FONT_FAMILY_OPTIONS } from "./constants";

export const FontFamilyToolbar = () => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const current =
    (editor?.getAttributes("textStyle").fontFamily as string | undefined) ?? "";

  const activeLabel =
    FONT_FAMILY_OPTIONS.find((o) => o.value === current)?.name ?? "Fuente";

  if (isMobile) {
    return (
      <MobileToolbarGroup label={activeLabel}>
        {FONT_FAMILY_OPTIONS.map(({ name, value }) => (
          <MobileToolbarItem
            key={name}
            onClick={() => {
              if (!value) {
                editor?.chain().focus().unsetFontFamily().run();
              } else {
                editor?.chain().focus().setFontFamily(value).run();
              }
            }}
            active={current === value}
          >
            <span style={value ? { fontFamily: value } : undefined}>
              {name}
            </span>
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
                className={cn("h-8 max-w-36 gap-1 px-2 font-normal")}
              >
                <span className="truncate text-xs">{activeLabel}</span>
                <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Fuente</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          className="w-56 p-1"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ScrollArea className="max-h-72 pr-2">
            <div className="mb-2 mt-2 px-2 text-xs text-muted-foreground">
              Fuente
            </div>
            {FONT_FAMILY_OPTIONS.map(({ name, value }) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (!value) {
                    editor?.chain().focus().unsetFontFamily().run();
                  } else {
                    editor?.chain().focus().setFontFamily(value).run();
                  }
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                  current === value && "bg-accent",
                )}
              >
                <span style={value ? { fontFamily: value } : undefined}>
                  {name}
                </span>
                {current === value ? (
                  <CheckIcon className="h-4 w-4 shrink-0" />
                ) : null}
              </button>
            ))}
          </ScrollArea>
        </PopoverContent>
      </div>
    </Popover>
  );
};
