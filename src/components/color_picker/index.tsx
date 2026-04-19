import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { ColorPickerPanel } from "./components";
import { DEFAULT_COLOR_SWATCHES } from "./constants";
import { FALLBACK_COLOR, normalizeHexColor } from "./utils";
import { Button } from "@/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utilities/index";

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  swatches?: string[];
}

function ColorPicker({
  value,
  onChange,
  className,
  contentClassName,
  disabled = false,
  placeholder = "Selecciona un color",
  swatches = DEFAULT_COLOR_SWATCHES,
}: ColorPickerProps) {
  const normalizedValue = normalizeHexColor(value);
  const pickerValue = normalizedValue ?? FALLBACK_COLOR;
  const normalizedSwatches = React.useMemo(
    () => [
      ...new Set(
        swatches
          .map((swatch) => normalizeHexColor(swatch))
          .filter((swatch): swatch is string => Boolean(swatch))
      ),
    ],
    [swatches]
  );

  const handleColorChange = React.useCallback(
    (nextColor: string) => {
      const normalizedColor = normalizeHexColor(nextColor);

      if (!normalizedColor) {
        return;
      }

      onChange(normalizedColor);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "pl-1! pr-2!",
            !normalizedValue && "text-muted-foreground",
            className
          )}
          data-slot="color-picker-trigger"
          disabled={disabled}
          type="button"
          variant="outline"
        >
          <span className="flex min-w-0 items-center gap-3 text-left">
            <span
              className="arx-color-picker-trigger-swatch size-6 rounded-md"
              style={{ backgroundColor: pickerValue }}
            />
            <span className="min-w-0 text-sm font-medium">
              {normalizedValue ?? placeholder}
            </span>
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn("w-64 overflow-hidden p-0", contentClassName)}
        data-slot="color-picker-content"
      >
        <ColorPickerPanel
          disabled={disabled}
          normalizedValue={normalizedValue}
          onColorChange={handleColorChange}
          pickerValue={pickerValue}
          swatches={normalizedSwatches}
        />
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker, ColorPickerPanel };
