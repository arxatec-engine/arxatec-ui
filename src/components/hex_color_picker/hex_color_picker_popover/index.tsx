import { useEditableFields } from "@/components/editable_fields/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utilities/class";
import { normalizeHexColor } from "@/utilities/colors";
import { HexColorPickerContent } from "../hex_color_picker_content";

export type HexColorPickerPopoverProps = {
  value: string;
  onChange: (value: string) => void;
  align?: "start" | "center" | "end";
  disabled?: boolean;
  swatches?: readonly string[];
  clearLabel?: string;
  triggerAriaLabel?: string;
  triggerClassName?: string;
};

export const HexColorPickerPopover: React.FC<HexColorPickerPopoverProps> = ({
  value,
  onChange,
  align = "start",
  disabled = false,
  swatches,
  clearLabel,
  triggerAriaLabel,
  triggerClassName,
}) => {
  const { labels } = useEditableFields();
  const normalizedValue = normalizeHexColor(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={
            triggerAriaLabel ??
            (normalizedValue
              ? `${labels.changeColor} (${labels.currentColor} ${normalizedValue})`
              : labels.selectColor)
          }
          className={cn(
            "size-8 shrink-0 rounded-md border border-border transition-shadow hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
            !normalizedValue && "bg-muted/40",
            triggerClassName,
          )}
          style={
            normalizedValue ? { backgroundColor: normalizedValue } : undefined
          }
        />
      </PopoverTrigger>
      <PopoverContent align={align} className="w-64 overflow-hidden p-0">
        <HexColorPickerContent
          value={value}
          swatches={swatches}
          clearLabel={clearLabel}
          onChange={onChange}
          disabled={disabled}
          onClear={() => onChange("")}
        />
      </PopoverContent>
    </Popover>
  );
};
