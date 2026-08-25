import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities";
import { FONT_SIZE_PRESETS } from "@/components/rich_text_editor/toolbars/font_size/constants";
import { useActiveAnnotationEditor } from "../../../../context/use_active_annotation_editor";
import { keepEditorFocusProps, parsePresetPx } from "../../utilities";

const AnnotationBoxFontSizeToolbar = () => {
  const { active } = useActiveAnnotationEditor();

  const boxPx = active?.font_size ?? 16;

  const current = `${boxPx}px`;

  const focusProps = keepEditorFocusProps();

  const applySize = (size: string) => {
    if (!active) return;

    const px = parsePresetPx(size);

    if (!Number.isFinite(px) || px < 1) return;

    active.patchAnnotation({ font_size: px });
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
                className={cn("h-8 w-14 gap-1 px-2 font-normal")}
              >
                <span className="text-xs tabular-nums">{current}</span>

                <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent>Tamaño de la caja</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          className="w-48 p-0"
          {...focusProps}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="max-h-[min(70vh,22rem)] overflow-y-auto overflow-x-hidden p-1">
            <div className="mb-2 mt-2 px-2 text-xs text-muted-foreground">
              Tamaño de la caja
            </div>

            {FONT_SIZE_PRESETS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => applySize(size)}
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

export { AnnotationBoxFontSizeToolbar };
