import type { ReactNode } from "react";
import { cn } from "@/utilities/class";

interface ViewerFloatingBarValueProps {
  children: ReactNode;
  className?: string;
}

const ViewerFloatingBarValue = ({
  children,
  className,
}: ViewerFloatingBarValueProps) => (
  <div
    className={cn(
      "min-w-11 select-none rounded-md bg-muted px-2 py-0.5 text-center text-xs font-medium tabular-nums text-foreground",
      className,
    )}
  >
    {children}
  </div>
);

export { ViewerFloatingBarValue };
