import { Button } from "../../button";
import { ButtonGroup } from "../../button_group";
import { X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useMediaQuery } from "../../../hooks/use_media_query";

export interface ExplorerSelectionAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export interface ExplorerSelectionBarProps {
  count: number;
  countLabel: ReactNode;
  onClear: () => void;
  actions?: ExplorerSelectionAction[];
  trailing?: ReactNode;
  filters?: ReactNode;
  clearLabel?: string;
}

export const ExplorerSelectionBar = ({
  count,
  countLabel,
  onClear,
  actions = [],
  filters,
  trailing,
  clearLabel = "Clear selection",
}: ExplorerSelectionBarProps) => {
  const isLargeScreen = useMediaQuery("(min-width: 640px)");

  if (count === 0) return <>{filters}</>;

  return (
    <div className="bg-accent flex flex-wrap items-center justify-between rounded-md gap-2 text-foreground text-sm mb-2 p-2 sm:p-0.5">
      <div className="flex items-center gap-2">
        <Button
          className="size-7"
          variant="ghost"
          size="icon"
          onClick={onClear}
          aria-label={clearLabel}
        >
          <X className="size-4" />
        </Button>
        {countLabel}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 w-full sm:w-auto">
        {actions.length > 0 ? (
          <ButtonGroup
            orientation={isLargeScreen ? "horizontal" : "vertical"}
            className="flex-col sm:flex-row w-full sm:w-auto"
          >
            {actions.map((action) => (
              <Button
                key={action.key}
                variant="outline"
                className="w-full sm:w-auto"
                size="sm"
                onClick={action.onClick}
              >
                <action.icon className="size-4" />
                {action.label}
              </Button>
            ))}
          </ButtonGroup>
        ) : null}
        {trailing}
      </div>
    </div>
  );
};
