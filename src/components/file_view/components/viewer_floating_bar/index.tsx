import type { ReactNode } from "react";
import { cn } from "@/utilities/class";

interface ViewerFloatingBarProps {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export const ViewerFloatingBar = ({
  children,
  ariaLabel = "Controles del visor",
  className,
}: ViewerFloatingBarProps) => (
  <div
    className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4"
    role="toolbar"
    aria-label={ariaLabel}
  >
    <div
      className={cn(
        "pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-md border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  </div>
);

export { ViewerFloatingBarValue } from "./components/viewer_floating_bar_value";
