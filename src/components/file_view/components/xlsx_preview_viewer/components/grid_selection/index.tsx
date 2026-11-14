import type { PointerEventHandler } from "react";

import { cn } from "@/utilities/class";

import { selectionGeometry } from "../../utilities/grid_layout";
import type { SpreadsheetGridView } from "../../types";

interface Props {
  grid: SpreadsheetGridView;
  onHandlePointerDown: PointerEventHandler<HTMLDivElement>;
  className?: string;
}

export const SpreadsheetGridSelection = ({
  grid,
  onHandlePointerDown,
  className,
}: Props) => {
  const style = selectionGeometry(grid);
  if (!style) return null;
  return (
    <div
      aria-hidden="true"
      data-slot="spreadsheet-selection"
      data-spreadsheet-selection
      className={cn(
        "pointer-events-none absolute z-[8] border-2 border-primary",
        className,
      )}
      style={style}
    >
      <div
        data-selection-handle
        onPointerDown={onHandlePointerDown}
        className="pointer-events-auto absolute -right-3 -bottom-3 flex size-6 touch-none cursor-crosshair items-center justify-center"
      >
        <span className="size-3 rounded-full border-2 border-background bg-primary" />
      </div>
    </div>
  );
};
