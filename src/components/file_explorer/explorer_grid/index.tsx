import type { ReactNode, RefObject } from "react";
import { cn } from "../../../utilities/class";
import { EXPLORER_GRID_CLASS } from "../constants";
import { ExplorerPanel } from "../explorer_panel";

export interface ExplorerGridProps {
  selectableRef?: RefObject<HTMLDivElement | null>;
  viewportRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  overlay?: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}

export const ExplorerGrid = ({
  selectableRef,
  viewportRef,
  className,
  overlay,
  after,
  children,
}: ExplorerGridProps) => (
  <ExplorerPanel
    bare
    selectableRef={selectableRef}
    viewportRef={viewportRef}
    className={className}
    overlay={overlay}
    after={after}
  >
    <div className={cn("relative z-30 pb-3", EXPLORER_GRID_CLASS)}>
      {children}
    </div>
  </ExplorerPanel>
);
