import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/utilities/class";
import { DURATION_COLUMN_HEIGHT } from "../../constants";
import { attachWheelScroll, getScrollViewport } from "../../utils";

interface Props {
  values: number[];
  selected: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}

export const DurationColumn = ({
  values,
  selected,
  onChange,
  ariaLabel,
}: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return attachWheelScroll(getScrollViewport(root));
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const option = selectedRef.current;
    if (!root || !option) return;
    const viewport = getScrollViewport(root);
    viewport.scrollTop =
      option.offsetTop - viewport.clientHeight / 2 + option.offsetHeight / 2;
  }, [selected]);

  return (
    <div ref={rootRef} className={cn(DURATION_COLUMN_HEIGHT, "min-w-[92px]")}>
      <ScrollArea type="always" className="h-full overscroll-contain">
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="flex flex-col px-1 py-1"
        >
          {values.map((value) => {
            const isSelected = value === selected;
            return (
              <button
                key={value}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onChange(value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-center text-sm tabular-nums transition-colors",
                  isSelected
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                {String(value).padStart(2, "0")}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
