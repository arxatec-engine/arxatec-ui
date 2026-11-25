import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { cn } from "@/utilities/class";

interface Props {
  className?: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const SpreadsheetFormatSelect = ({
  label,
  value,
  options,
  onChange,
  className,
}: Props) => (
  <label
    data-slot="spreadsheet-format-select"
    className={cn("grid gap-1 text-xs", className)}
  >
    <span>{label}</span>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label={label} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </label>
);
