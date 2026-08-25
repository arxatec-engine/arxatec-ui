import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { ScrollArea } from "@/components/scroll_area";
import { cn } from "@/utilities";
import { useActiveAnnotationEditor } from "../../../../context/use_active_annotation_editor";
import {
  ANNOTATION_FONT_FAMILY_OPTIONS,
  resolveAnnotationFontOption,
} from "../../../../constants";
import { keepEditorFocusProps } from "../../utilities";

const AnnotationBoxFontFamilyToolbar = () => {
  const { active } = useActiveAnnotationEditor();

  const current = active?.font_family ?? "";

  const activeOption = resolveAnnotationFontOption(current);

  const focusProps = keepEditorFocusProps();

  const applyFamily = (value: string) => {
    if (!active) return;

    active.patchAnnotation({ font_family: value });
  };

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
                <span className="truncate text-xs">{activeOption.name}</span>

                <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent>Fuente de la caja</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          className="w-56 p-1"
          {...focusProps}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ScrollArea className="max-h-72 pr-2">
            <div className="mb-2 mt-2 px-2 text-xs text-muted-foreground">
              Fuente de la caja
            </div>

            {ANNOTATION_FONT_FAMILY_OPTIONS.map(({ name, value }) => {
              const isActive = activeOption.value === value;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => applyFamily(value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent",

                    isActive && "bg-accent",
                  )}
                >
                  <span style={{ fontFamily: value }}>{name}</span>

                  {isActive ? <CheckIcon className="h-4 w-4 shrink-0" /> : null}
                </button>
              );
            })}
          </ScrollArea>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export { AnnotationBoxFontFamilyToolbar };
