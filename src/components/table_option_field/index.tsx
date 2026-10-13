import { Command, CommandItem, CommandList } from "@/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { InlineOption } from "../inline_option_field";
import { cn } from "@/utilities/class";

export interface TableOptionFieldProps {
  value: string | null;
  options: InlineOption[];
  onChange: (value: string | null) => void;
  ariaLabel: string;
  disabled?: boolean;
  clearLabel?: string;
  children: ReactNode;
  renderOption: (option: InlineOption) => ReactNode;
}

export const TableOptionField = ({
  value,
  options,
  onChange,
  ariaLabel,
  disabled,
  clearLabel,
  children,
  renderOption,
}: TableOptionFieldProps) => {
  const [open, setOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);

  useLayoutEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (open) commandRef.current?.focus();
  }, [open]);

  const choose = (next: string | null) => {
    setOpen(false);
    if (next !== value) onChange(next);
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
          className="flex w-full min-w-0 cursor-pointer items-center rounded-md p-2 text-left outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent
        ref={contentRef}
        align="start"
        aria-label={ariaLabel}
        className="w-auto min-w-[200px] max-w-[calc(100vw-2rem)] rounded-md p-0"
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
        <Command
          ref={commandRef}
          tabIndex={0}
          label={ariaLabel}
          defaultValue={
            options.find((option) => option.value === value)?.label ??
            clearLabel
          }
          className="h-auto outline-none [&>[data-slot=scroll-area]]:h-auto [&_[data-slot=scroll-area-viewport]]:h-auto [&_[data-slot=scroll-area-viewport]]:max-h-[min(300px,calc(var(--radix-popover-content-available-height)-2px))]"
        >
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => choose(option.value)}
                className={cn(
                  "rounded-md",
                  option.value === value && "bg-accent",
                )}
              >
                {renderOption(option)}
              </CommandItem>
            ))}
            {clearLabel ? (
              <CommandItem
                value={clearLabel}
                onSelect={() => choose(null)}
                className={cn(
                  "rounded-md text-muted-foreground",
                  value === null && "bg-accent",
                )}
              >
                {clearLabel}
              </CommandItem>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
