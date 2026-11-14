import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

import { cn } from "@/utilities/class";

export interface ViewerFloatingBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  "data-slot"?: string;
  children: ReactNode;
  ariaLabel?: string;
  label?: string;
  className?: string;
  placement?: "top" | "bottom";
}

export const ViewerFloatingBar = forwardRef<
  HTMLDivElement,
  ViewerFloatingBarProps
>(
  (
    {
      children,
      ariaLabel = "Controles del visor",
      label,
      className,
      placement = "bottom",
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      ref={ref}
      data-slot={props["data-slot"] ?? "viewer-floating-bar"}
      className={cn(
        "pointer-events-none absolute inset-x-0 z-30 flex justify-center px-4",
        placement === "top" ? "top-4" : "bottom-5",
      )}
      role="toolbar"
      aria-label={label ?? ariaLabel}
    >
      <div
        data-slot="viewer-floating-bar-content"
        className={cn(
          "pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    </div>
  ),
);

ViewerFloatingBar.displayName = "ViewerFloatingBar";

export { ViewerFloatingBarValue } from "./components/viewer_floating_bar_value";
