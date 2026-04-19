import { CheckIcon } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/label";
import { Separator } from "@/components/separator";
import { cn } from "@/utilities/index";

import { getColorContrastForeground } from "../../utils";

export interface ColorPickerPanelProps {
  pickerValue: string;
  normalizedValue: string | null;
  swatches: string[];
  disabled?: boolean;
  onColorChange: (value: string) => void;
}

function ColorPickerPanel({
  pickerValue,
  normalizedValue,
  swatches,
  disabled = false,
  onColorChange,
}: ColorPickerPanelProps) {
  return (
    <div
      className="arx-color-picker flex flex-col"
      data-slot="color-picker-panel"
    >
      <div>
        <div className="flex flex-col gap-2 p-2">
          <HexColorPicker
            style={{ width: "100%" }}
            aria-label="Selector visual de color"
            color={pickerValue}
            onChange={onColorChange}
          />
        </div>

        {swatches.length > 0 ? (
          <>
            <Separator />

            <div className="space-y-2 p-2">
              <div className="flex items-center justify-between gap-3">
                <Label>Colores predefinidos</Label>
              </div>
              <div
                className="flex gap-px flex-wrap justify-start items-center"
                data-slot="color-picker-swatches"
              >
                {swatches.map((swatch) => {
                  const isActive = swatch === normalizedValue;

                  return (
                    <button
                      aria-label={`Seleccionar color ${swatch}`}
                      className={cn(
                        "focus-visible:border-ring focus-visible:ring-ring/50 relative aspect-square rounded-md border outline-none transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-[3px] size-6 m-0 p-0"
                      )}
                      disabled={disabled}
                      key={swatch}
                      onClick={() => onColorChange(swatch)}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="arx-color-picker-swatch block size-full rounded-md"
                        style={{ backgroundColor: swatch }}
                      />
                      {isActive ? (
                        <CheckIcon
                          className="absolute inset-0 m-auto size-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                          style={{ color: getColorContrastForeground(swatch) }}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export { ColorPickerPanel };
