import { Button } from "@/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { ScrollArea } from "@/components/scroll_area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities/class";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { SHAPE_COLOR_PALETTE, type ShapeColorValue } from "../../utilities";

function normalizePickerValue(
  value: string | null | undefined,
): ShapeColorValue {
  if (value == null || value === "" || value === "transparent") {
    return "transparent";
  }
  const hit = SHAPE_COLOR_PALETTE.find(
    (c) => c.value.toLowerCase() === value.toLowerCase(),
  );
  return hit?.value ?? "#000000";
}

function SwatchPreview({
  color,
  className,
}: {
  color: ShapeColorValue;
  className?: string;
}) {
  if (color === "transparent") {
    return (
      <div
        className={cn(
          "size-5 rounded-sm border border-border bg-size-[6px_6px] bg-position-[0_0,3px_3px]",
          className,
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
        }}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn("size-5 rounded-sm border border-border", className)}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  );
}

interface Props {
  label: string;
  tooltip: string;
  value: string | null | undefined;
  onChange: (color: ShapeColorValue) => void;
  disabled?: boolean;
}

export const AnnotationColorPicker: React.FC<Props> = ({
  label,
  tooltip,
  value,
  onChange,
  disabled = false,
}) => {
  const current = normalizePickerValue(value);

  return (
    <Popover>
      <div
        className="relative h-full"
        onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger disabled={disabled} asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 font-normal"
                aria-label={tooltip}
              >
                <SwatchPreview color={current} />
                <span className="text-xs text-muted-foreground">{label}</span>
                <ChevronDownIcon className="size-4 opacity-60" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="start"
          className="w-56 p-0! dark:bg-gray-2"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
        >
          <ScrollArea className="h-72 pb-2">
            <div className="mb-1 mt-2 px-2 text-xs uppercase text-muted-foreground">
              {label}
            </div>
            <div className="px-2">
              {SHAPE_COLOR_PALETTE.map(({ name, value: color }) => (
                <button
                  key={color}
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-muted"
                  onClick={() => onChange(color)}
                >
                  <div className="flex items-center gap-2">
                    <SwatchPreview color={color} />
                    <span>{name}</span>
                  </div>
                  {current === color ? <CheckIcon className="size-4" /> : null}
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </div>
    </Popover>
  );
};
