import { SPREADSHEET_NUMBER_FORMATS } from "../../constants/editor";
import { cn } from "@/utilities/class";
import type { SpreadsheetCellFormat } from "../../types/editing";
import type { SpreadsheetFormatControlsProps } from "../../types/format_controls";
import { SpreadsheetFormatSelect } from "../format_select";

export const SpreadsheetNumberControls = ({
  format,
  labels,
  onChange,
  currencyFormat,
  className,
}: SpreadsheetFormatControlsProps) => (
  <div
    data-slot="spreadsheet-number-controls"
    className={cn("grid grid-cols-2 gap-2", className)}
  >
    <SpreadsheetFormatSelect
      label={labels.numberFormat}
      value={format.numberFormat ?? "General"}
      options={[
        ...SPREADSHEET_NUMBER_FORMATS.map(({ key, value }) => ({
          value: key === "currency" ? (currencyFormat ?? value) : value,
          label: labels[key],
        })),
        ...(!SPREADSHEET_NUMBER_FORMATS.some(
          ({ value }) => value === format.numberFormat,
        ) && format.numberFormat
          ? [{ value: format.numberFormat, label: format.numberFormat }]
          : []),
      ]}
      onChange={(numberFormat) => onChange({ numberFormat })}
    />
    <SpreadsheetFormatSelect
      label={labels.borders}
      value={format.border ?? "none"}
      options={(
        [
          "none",
          "thin",
          "medium",
          "thick",
          "dotted",
          "dashed",
          "double",
        ] as const
      ).map((value) => ({ value, label: labels[value] }))}
      onChange={(border) =>
        onChange({ border: border as SpreadsheetCellFormat["border"] })
      }
    />
  </div>
);
