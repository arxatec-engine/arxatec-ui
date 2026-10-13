import { ContextMenu, ContextMenuTrigger } from "../../context_menu";
import { TableCell, TableRow } from "../../table";
import type { DragEvent, MouseEvent, ReactNode } from "react";
import type { ExplorerItemType } from "../types";
import { cn } from "../../../utilities/class";
import {
  ItemActionsContextContent,
  ItemActionsDropdown,
  type ExplorerAction,
} from "../item_actions";
import { stopEvent } from "../shared/utils";

export interface ExplorerRowProps {
  id: string;
  type: ExplorerItemType;
  selected: boolean;
  actions: ExplorerAction[];
  actionsLabel?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  onDoubleClick?: () => void;
  onDragOver?: (event: DragEvent<HTMLTableRowElement>) => void;
  onDragLeave?: (event: DragEvent<HTMLTableRowElement>) => void;
  onDrop?: (event: DragEvent<HTMLTableRowElement>) => void;
  children: ReactNode;
}

export const ExplorerRow = ({
  id,
  type,
  selected,
  actions,
  actionsLabel,
  className,
  onClick,
  onDoubleClick,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: ExplorerRowProps) => {
  const hasActions = actions.length > 0;

  const row = (
    <TableRow
      className={cn(
        "hover:transparent border-b!",
        selected &&
          "bg-selector-background text-selector-foreground hover:bg-selector-background",
        className,
      )}
      data-selectable-id={id}
      data-selectable-type={type}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}

      <TableCell
        className="w-[50px]"
        onClick={stopEvent}
        onDoubleClick={stopEvent}
      >
        {hasActions && (
          <ItemActionsDropdown
            actions={actions}
            label={actionsLabel}
            iconClassName={selected ? "text-selector-foreground" : undefined}
          />
        )}
      </TableCell>
    </TableRow>
  );

  if (!hasActions) return row;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
      <ItemActionsContextContent actions={actions} />
    </ContextMenu>
  );
};
