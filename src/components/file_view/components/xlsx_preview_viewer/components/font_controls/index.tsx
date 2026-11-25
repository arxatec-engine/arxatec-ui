import { Bold, Italic, Strikethrough, Underline } from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn } from "@/utilities/class";

import { SPREADSHEET_FONTS } from "../../constants/editor";
import type { SpreadsheetFormatControlsProps } from "../../types/format_controls";
import { SpreadsheetFormatSelect } from "../format_select";

export const SpreadsheetFontControls = ({
  format,
  labels,
  onChange,
  className,
}: SpreadsheetFormatControlsProps) => (
  <div
    data-slot="spreadsheet-font-controls"
    className={cn("grid gap-3", className)}
  >
    <div className="grid grid-cols-[1fr_5rem] gap-2">
      <SpreadsheetFormatSelect
        label={labels.font}
        value={format.fontName ?? "Calibri"}
        options={SPREADSHEET_FONTS.map((name) => ({
          value: name,
          label: name,
        }))}
        onChange={(fontName) => onChange({ fontName })}
      />
      <label className="grid gap-1 text-xs">
        <span>{labels.fontSize}</span>
        <Input
          key={format.fontSize}
          type="number"
          min={6}
          max={96}
          defaultValue={format.fontSize ?? 11}
          aria-label={labels.fontSize}
          className="h-8"
          onBlur={(event) => {
            if (event.target.validity.valid && event.target.value)
              onChange({ fontSize: Number(event.target.value) });
          }}
        />
      </label>
    </div>
    <div className="flex gap-1">
      {(
        [
          { key: "bold", Icon: Bold },
          { key: "italic", Icon: Italic },
          { key: "underline", Icon: Underline },
          { key: "strike", Icon: Strikethrough },
        ] as const
      ).map(({ key, Icon }) => (
        <Button
          key={key}
          variant={format[key] ? "secondary" : "ghost"}
          size="icon"
          className="size-8"
          aria-label={labels[key]}
          aria-pressed={!!format[key]}
          onClick={() => onChange({ [key]: !format[key] })}
        >
          <Icon className="size-4" />
        </Button>
      ))}
      <label className="ml-auto flex items-center gap-1 text-xs">
        {labels.textColor}
        <Input
          type="color"
          value={format.color ?? "#000000"}
          aria-label={labels.textColor}
          className="h-8 w-9 p-1"
          onChange={(event) => onChange({ color: event.target.value })}
        />
      </label>
      <label className="flex items-center gap-1 text-xs">
        {labels.fillColor}
        <Input
          type="color"
          value={format.fill ?? "#ffffff"}
          aria-label={labels.fillColor}
          className="h-8 w-9 p-1"
          onChange={(event) => onChange({ fill: event.target.value })}
        />
      </label>
    </div>
  </div>
);
