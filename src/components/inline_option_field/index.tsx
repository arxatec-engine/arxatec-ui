import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/utilities/class";
import { INLINE_FIELD_ROW } from "../inline_editable_text/constants";

export interface InlineOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface InlineOptionFieldProps {
  value: string | null;
  options: InlineOption[];
  onChange: (next: string | null) => void;
  ariaLabel: string;
  emptyText: string;
  testId?: string;
  clearLabel?: string;
  disabled?: boolean;
  renderOption?: (option: InlineOption) => ReactNode;
}

export const InlineOptionField = ({
  value,
  options,
  onChange,
  ariaLabel,
  emptyText,
  testId,
  clearLabel,
  disabled,
  renderOption,
}: InlineOptionFieldProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? null;
  const SelectedIcon = selected?.icon;

  const choose = (next: string | null) => {
    setOpen(false);
    if (next === value) return;
    onChange(next);
  };

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
            !selected && "text-muted-foreground",
          )}
        >
          {selected
            ? (renderOption?.(selected) ?? (
                <span className="flex items-center gap-2">
                  {SelectedIcon ? (
                    <SelectedIcon className="size-4 shrink-0" />
                  ) : null}
                  {selected.label}
                </span>
              ))
            : emptyText}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-52 p-1">
        <div className="flex flex-col">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                data-testid={
                  testId ? `${testId}-option-${option.value}` : undefined
                }
                onClick={() => choose(option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent",
                  option.value === value && "bg-accent",
                )}
              >
                {renderOption?.(option) ?? (
                  <>
                    {Icon ? <Icon className="size-4 shrink-0" /> : null}
                    {option.label}
                  </>
                )}
              </button>
            );
          })}
          {clearLabel ? (
            <button
              type="button"
              data-testid={testId ? `${testId}-clear` : undefined}
              onClick={() => choose(null)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent"
            >
              {clearLabel}
            </button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
};
