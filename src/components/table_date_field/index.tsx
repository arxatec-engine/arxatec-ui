import { useEditableFields } from "@/components/editable_fields/hooks";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { format, isSameDay } from "date-fns";
import { useLayoutEffect, useRef, useState } from "react";

export interface TableDateFieldProps {
  value: string | null;
  onChange: (next: string | null) => void;
  ariaLabel: string;
  disabled?: boolean;
  clearLabel?: string;
}

export const TableDateField = ({
  value,
  onChange,
  ariaLabel,
  disabled,
  clearLabel,
}: TableDateFieldProps) => {
  const { locale, tableDateFormat } = useEditableFields();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);

  useLayoutEffect(() => {
    openRef.current = open;
  }, [open]);
  const date = value ? new Date(value) : undefined;

  const choose = (next: Date | null) => {
    setOpen(false);
    if (next && date && isSameDay(next, date)) return;
    if (!next && !date) return;
    onChange(next?.toISOString() ?? null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          title={ariaLabel}
          disabled={disabled}
          onClick={(event) => event.stopPropagation()}
          className="flex w-full cursor-pointer items-center rounded-md p-2 text-left text-sm text-muted-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {date ? format(date, tableDateFormat, { locale }) : "—"}
        </button>
      </PopoverTrigger>
      <PopoverContent
        ref={contentRef}
        align="start"
        aria-label={ariaLabel}
        className="w-auto rounded-md p-0"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        onCloseAutoFocus={(event) => {
          if (openRef.current) {
            event.preventDefault();
            return;
          }
          const focused = document.activeElement;
          if (
            focused !== document.body &&
            focused !== triggerRef.current &&
            !contentRef.current?.contains(focused)
          )
            event.preventDefault();
        }}
      >
        <Calendar
          locale={locale}
          mode="single"
          required
          selected={date}
          defaultMonth={date ?? new Date()}
          onSelect={(next) => {
            if (next) choose(next);
          }}
        />
        {clearLabel ? (
          <button
            type="button"
            className="w-full border-t border-border rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent"
            onClick={() => choose(null)}
          >
            {clearLabel}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};
