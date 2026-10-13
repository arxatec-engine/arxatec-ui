import "./styles.css";
import type { ReactNode } from "react";
import { cn } from "@/utilities/class";

export interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  textClassName?: string;
}

const stackGrid =
  "isolate inline-grid [grid-template-areas:'stack'] place-items-start";

const defaultBase =
  "text-secondary-foreground transition-colors group-hover/button:text-popover-foreground";

export function ShinyText({
  children,
  className,
  textClassName,
}: ShinyTextProps) {
  return (
    <span className={cn(stackGrid, className)}>
      <span
        className={cn(
          "[grid-area:stack] text-sm leading-4",
          defaultBase,
          textClassName,
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="[grid-area:stack] text-sm shiny-text-overlay leading-4"
      >
        {children}
      </span>
    </span>
  );
}
