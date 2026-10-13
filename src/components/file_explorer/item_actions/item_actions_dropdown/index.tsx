import { Button } from "../../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../dropdown_menu";
import { Ellipsis } from "lucide-react";
import { Fragment } from "react";
import { cn } from "../../../../utilities/class";
import { stopEvent } from "../../shared/utils";
import type { ExplorerAction } from "../types";
import { visibleActions } from "../utils";

export interface ItemActionsDropdownProps {
  actions: ExplorerAction[];
  iconClassName?: string;
  label?: string;
}

export const ItemActionsDropdown = ({
  actions,
  iconClassName,
  label = "Actions",
}: ItemActionsDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        className="mx-auto flex size-7"
        variant="secondary"
        size="icon"
        aria-label={label}
        onClick={stopEvent}
        onDoubleClick={stopEvent}
      >
        <Ellipsis className={cn("size-4", iconClassName)} />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      onClick={stopEvent}
      onDoubleClick={stopEvent}
    >
      {visibleActions(actions).map((action) => (
        <Fragment key={action.key}>
          {action.separatorBefore && <DropdownMenuSeparator />}

          <DropdownMenuItem className="gap-2" onClick={action.onSelect}>
            <action.icon className="size-4" />
            {action.label}
          </DropdownMenuItem>
        </Fragment>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
