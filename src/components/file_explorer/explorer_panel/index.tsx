import { ScrollArea } from "../../scroll_area";
import type { ReactNode, RefObject } from "react";
import { cn } from "../../../utilities/class";

export interface ExplorerPanelProps {
  selectableRef?: RefObject<HTMLDivElement | null>;
  viewportRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  bare?: boolean;
  overlay?: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}

export const ExplorerPanel = ({
  selectableRef,
  viewportRef,
  className,
  bare = false,
  overlay,
  after,
  children,
}: ExplorerPanelProps) => (
  <div
    ref={selectableRef}
    className={cn(
      "h-[calc(100vh-80px)] relative overflow-hidden flex flex-col",
      !bare && "border bg-card rounded-md",
      className,
    )}
  >
    <ScrollArea
      viewportRef={viewportRef}
      className="flex-1 min-h-0 relative z-20"
    >
      {children}
      {overlay}
    </ScrollArea>

    {after}
  </div>
);
