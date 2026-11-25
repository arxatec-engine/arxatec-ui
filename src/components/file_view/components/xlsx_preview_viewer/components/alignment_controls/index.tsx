import { WrapText } from "lucide-react";

import { Button } from "@/components/button";
import { cn } from "@/utilities/class";

import type { SpreadsheetCellFormat } from "../../types/editing";
import type { SpreadsheetFormatControlsProps } from "../../types/format_controls";
import { SpreadsheetFormatSelect } from "../format_select";

export const SpreadsheetAlignmentControls = ({
  format,
  labels,
  onChange,
  className,
}: SpreadsheetFormatControlsProps) => (
  <div
    data-slot="spreadsheet-alignment-controls"
    className={cn("grid grid-cols-[1fr_1fr_auto] items-end gap-2", className)}
  >
    <SpreadsheetFormatSelect
      label={labels.alignment}
      value={format.horizontal ?? "left"}
      options={(["left", "center", "right"] as const).map((value) => ({
        value,
        label: labels[value],
      }))}
      onChange={(horizontal) =>
        onChange({
          horizontal: horizontal as SpreadsheetCellFormat["horizontal"],
        })
      }
    />
    <SpreadsheetFormatSelect
      label={labels.alignment}
      value={format.vertical ?? "bottom"}
      options={(["top", "middle", "bottom"] as const).map((value) => ({
        value,
        label: labels[value],
      }))}
      onChange={(vertical) =>
        onChange({ vertical: vertical as SpreadsheetCellFormat["vertical"] })
      }
    />
    <Button
      variant={format.wrap ? "secondary" : "ghost"}
      size="icon"
      className="size-8"
      aria-label={labels.wrap}
      aria-pressed={!!format.wrap}
      onClick={() => onChange({ wrap: !format.wrap })}
    >
      <WrapText className="size-4" />
    </Button>
  </div>
);
