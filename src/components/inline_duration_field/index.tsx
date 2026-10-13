import { useEditableFields } from "@/components/editable_fields/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { useState } from "react";
import { cn } from "@/utilities/class";
import { INLINE_FIELD_ROW } from "../inline_editable_text/constants";
import { DurationColumn } from "./components/duration_column";
import { DURATION_PRESETS_SECONDS } from "./constants";
import {
  durationToParts,
  formatDurationLabel,
  hourValues,
  minuteValues,
  partsToSeconds,
} from "./utils";

export interface InlineDurationFieldProps {
  value: number;
  onChange: (seconds: number) => void;
  ariaLabel: string;
  emptyText: string;
  testId?: string;
  disabled?: boolean;
}

export const InlineDurationField = ({
  value,
  onChange,
  ariaLabel,
  emptyText,
  testId,
  disabled,
}: InlineDurationFieldProps) => {
  const { labels } = useEditableFields();
  const [open, setOpen] = useState(false);
  const { hours, minutes } = durationToParts(value);
  const label = formatDurationLabel(value);
  const isEmpty = value <= 0;
  const hoursLabel = labels.hours;
  const minutesLabel = labels.minutes;

  const commit = (nextHours: number, nextMinutes: number) => {
    onChange(partsToSeconds(nextHours, nextMinutes));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={ariaLabel}
          aria-label={ariaLabel}
          aria-expanded={open}
          data-testid={testId}
          disabled={disabled}
          className={cn(
            INLINE_FIELD_ROW,
            "w-auto px-2 tabular-nums disabled:pointer-events-none disabled:opacity-50",
            isEmpty && "text-muted-foreground",
          )}
        >
          {isEmpty ? emptyText : label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto overflow-hidden p-0"
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="flex gap-1 border-b border-border px-2 py-2">
          {DURATION_PRESETS_SECONDS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onChange(preset);
                setOpen(false);
              }}
              className={cn(
                "rounded-md px-2 py-1 text-xs tabular-nums text-muted-foreground hover:bg-accent hover:text-foreground",
                value === preset &&
                  "bg-accent font-medium text-accent-foreground",
              )}
            >
              {formatDurationLabel(preset)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-1 px-2 pt-2">
          <p className="text-center text-xs font-medium text-muted-foreground">
            {hoursLabel}
          </p>
          <span />
          <p className="text-center text-xs font-medium text-muted-foreground">
            {minutesLabel}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-1 px-2 pb-2">
          <DurationColumn
            ariaLabel={hoursLabel}
            values={hourValues(hours)}
            selected={hours}
            onChange={(next) => commit(next, minutes)}
          />
          <span
            aria-hidden
            className="text-lg font-medium text-muted-foreground"
          >
            :
          </span>
          <DurationColumn
            ariaLabel={minutesLabel}
            values={minuteValues()}
            selected={minutes}
            onChange={(next) => commit(hours, next)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
