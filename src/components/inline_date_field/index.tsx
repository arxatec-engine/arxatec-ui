import { useEditableFields } from "@/components/editable_fields/hooks";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/utilities/class";
import { INLINE_FIELD_ROW } from "../inline_editable_text/constants";

export interface InlineDateFieldProps {
  value: Date | undefined;
  onChange: (next: Date) => void;
  ariaLabel: string;
  emptyText: string;
  testId?: string;
  disabled?: boolean;
  clearLabel?: string;
  onClear?: () => void;
}

export const InlineDateField = ({
  value,
  onChange,
  ariaLabel,
  emptyText,
  testId,
  disabled,
  clearLabel,
  onClear,
}: InlineDateFieldProps) => {
  const { locale, dateFormat } = useEditableFields();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={ariaLabel}
          aria-label={ariaLabel}
          data-testid={testId}
          disabled={disabled}
          className={cn(
            INLINE_FIELD_ROW,
            "w-auto px-2 disabled:pointer-events-none disabled:opacity-50",
            !value && "text-muted-foreground",
          )}
        >
          {value ? format(value, dateFormat, { locale }) : emptyText}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          locale={locale}
          mode="single"
          selected={value}
          defaultMonth={value ?? new Date()}
          onSelect={(next) => {
            if (!next) return;
            setOpen(false);
            onChange(next);
          }}
        />
        {onClear && clearLabel ? (
          <button
            type="button"
            data-testid={testId ? `${testId}-clear` : undefined}
            className="w-full border-t border-border px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent"
            onClick={() => {
              setOpen(false);
              onClear();
            }}
          >
            {clearLabel}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};
