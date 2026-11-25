import { Input } from "@/components/input";
import { cn } from "@/utilities/class";

import type { SpreadsheetEditorLabels } from "../../types/editing";

interface Props {
  className?: string;
  labels: SpreadsheetEditorLabels;
  rowHeight: number;
  columnWidth: number;
  onChange: (axis: "row" | "column", size: number) => void;
}

export const SpreadsheetDimensionControls = ({
  labels,
  rowHeight,
  columnWidth,
  onChange,
  className,
}: Props) => (
  <div
    data-slot="spreadsheet-dimension-controls"
    className={cn("grid grid-cols-2 gap-2", className)}
  >
    {(
      [
        { axis: "row", label: labels.rowHeight, value: rowHeight },
        { axis: "column", label: labels.columnWidth, value: columnWidth },
      ] as const
    ).map(({ axis, label, value }) => (
      <label key={`${axis}-${value}`} className="grid gap-1 text-xs">
        <span>{label} (px)</span>
        <Input
          type="number"
          min={12}
          max={1200}
          defaultValue={Math.round(value)}
          aria-label={label}
          className="h-8"
          onBlur={(event) => {
            if (event.target.validity.valid && event.target.value)
              onChange(axis, Number(event.target.value));
          }}
        />
      </label>
    ))}
  </div>
);
