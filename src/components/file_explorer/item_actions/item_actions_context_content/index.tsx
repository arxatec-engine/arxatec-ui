import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../../../context_menu";
import { Fragment } from "react";
import { stopEvent } from "../../shared/utils";
import type { ExplorerAction } from "../types";
import { visibleActions } from "../utils";

export interface ItemActionsContextContentProps {
  actions: ExplorerAction[];
}

export const ItemActionsContextContent = ({
  actions,
}: ItemActionsContextContentProps) => (
  <ContextMenuContent onClick={stopEvent} onDoubleClick={stopEvent}>
    {visibleActions(actions).map((action) => (
      <Fragment key={action.key}>
        {action.separatorBefore && <ContextMenuSeparator />}

        <ContextMenuItem className="gap-2" onClick={action.onSelect}>
          <action.icon className="size-4" />
          {action.label}
        </ContextMenuItem>
      </Fragment>
    ))}
  </ContextMenuContent>
);
