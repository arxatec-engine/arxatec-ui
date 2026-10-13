import { TableCell } from "../../table";
import type { DragEvent, ReactNode } from "react";
import { cn } from "../../../utilities/class";

export interface ExplorerNameCellProps {
  name: string;
  icon: ReactNode;
  path?: string;
  selected?: boolean;
  className?: string;
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLSpanElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLSpanElement>) => void;
}

export const ExplorerNameCell = ({
  name,
  icon,
  path,
  selected = false,
  className,
  draggable = false,
  onDragStart,
  onDragEnd,
}: ExplorerNameCellProps) => (
  <TableCell
    className={cn(
      "max-w-[320px]",
      selected && "text-selector-foreground",
      className,
    )}
  >
    <span
      className={cn(
        "flex items-center gap-2.5 overflow-hidden",
        draggable && "cursor-grab active:cursor-grabbing",
      )}
      data-select-disable={draggable ? "true" : undefined}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <span
        className={cn("shrink-0", path ? "[&_svg]:size-6" : "[&_svg]:size-5")}
      >
        {icon}
      </span>

      <span className="flex min-w-0 flex-col">
        <p className="truncate overflow-hidden whitespace-nowrap leading-4">
          {name}
        </p>
        {path && (
          <p
            className="truncate whitespace-nowrap text-sm leading-4 text-muted-foreground"
            title={path}
          >
            {path}
          </p>
        )}
      </span>
    </span>
  </TableCell>
);
