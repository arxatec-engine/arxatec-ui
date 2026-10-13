import { useEditableFields } from "@/components/editable_fields/hooks";
import { Button } from "@/components/button";
import { ColorPickerPanel } from "@/components/color_picker";
import { Separator } from "@/components/separator";
import { normalizeHexColor } from "@/utilities/colors";
import { hexColorOrFallback } from "../utils";

export type HexColorPickerContentProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  swatches?: readonly string[];
  onClear?: () => void;
  onAccept?: () => void;
  acceptDisabled?: boolean;
  acceptLabel?: string;
  clearLabel?: string;
};

export const HexColorPickerContent: React.FC<HexColorPickerContentProps> = ({
  value,
  onChange,
  disabled = false,
  swatches,
  onClear,
  onAccept,
  acceptDisabled = false,
  acceptLabel,
  clearLabel,
}) => {
  const { labels, swatches: defaultSwatches } = useEditableFields();
  const normalizedValue = normalizeHexColor(value);
  const pickerValue = hexColorOrFallback(value);
  const showClear = Boolean(onClear && normalizedValue);
  const showAccept = Boolean(onAccept);

  return (
    <>
      <ColorPickerPanel
        pickerValue={pickerValue}
        normalizedValue={normalizedValue}
        swatches={[...(swatches ?? defaultSwatches)]}
        disabled={disabled}
        onColorChange={(next) => {
          const normalized = normalizeHexColor(next);
          if (normalized) onChange(normalized);
        }}
      />
      {showClear || showAccept ? (
        <>
          <Separator />
          <div className="flex flex-col gap-1 p-2">
            {showAccept ? (
              <Button
                type="button"
                size="sm"
                disabled={disabled || acceptDisabled}
                onClick={onAccept}
              >
                {acceptLabel ?? labels.acceptColor}
              </Button>
            ) : null}
            {showClear ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-center text-muted-foreground"
                disabled={disabled}
                onClick={onClear}
              >
                {clearLabel ?? labels.clearColor}
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
};
