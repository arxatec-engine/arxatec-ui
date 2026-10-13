import { ContextMenu, ContextMenuTrigger } from "../../context_menu";
import type { DragEvent, MouseEvent, ReactNode } from "react";
import type { ExplorerItemType } from "../types";
import { cn } from "../../../utilities/class";
import {
  ItemActionsContextContent,
  ItemActionsDropdown,
  type ExplorerAction,
} from "../item_actions";
import { stopEvent } from "../shared/utils";

export interface ExplorerGridCardProps {
  id: string;
  type: ExplorerItemType;
  name: string;
  icon: ReactNode;
  preview: ReactNode;
  meta?: ReactNode;
  path?: string;
  selected: boolean;
  actions: ExplorerAction[];
  actionsLabel?: string;
  className?: string;
  draggable?: boolean;
  onClick?: (event: MouseEvent) => void;
  onDoubleClick?: () => void;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
}

export const ExplorerGridCard = ({
  id,
  type,
  name,
  icon,
  preview,
  meta,
  path,
  selected,
  actions,
  actionsLabel,
  className,
  draggable = false,
  onClick,
  onDoubleClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: ExplorerGridCardProps) => {
  const hasActions = actions.length > 0;

  const card = (
    <div
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-md border bg-card transition-colors hover:bg-accent/40",
        selected &&
          "border-selector-background bg-selector-background text-selector-foreground hover:bg-selector-background",
        draggable && "cursor-grab active:cursor-grabbing",
        className,
      )}
      data-selectable-id={id}
      data-selectable-type={type}
      data-select-disable={draggable ? "true" : undefined}
      draggable={draggable}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.key === " ") event.preventDefault();
        onClick?.(event as unknown as MouseEvent);
      }}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="flex shrink-0 [&_svg]:size-5">{icon}</span>

        <span className="flex min-w-0 flex-1 flex-col">
          <p
            className="truncate whitespace-nowrap text-sm leading-4"
            title={name}
          >
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

        {hasActions && (
          <span
            className="shrink-0"
            role="presentation"
            onClick={stopEvent}
            onDoubleClick={stopEvent}
          >
            <ItemActionsDropdown
              actions={actions}
              label={actionsLabel}
              iconClassName={selected ? "text-selector-foreground" : undefined}
            />
          </span>
        )}
      </div>

      <div className="flex h-28 items-center justify-center border-t">
        {preview}
      </div>

      {meta && (
        <div className="truncate border-t px-2.5 py-1.5 text-sm text-muted-foreground">
          {meta}
        </div>
      )}
    </div>
  );

  if (!hasActions) return card;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{card}</ContextMenuTrigger>
      <ItemActionsContextContent actions={actions} />
    </ContextMenu>
  );
};
