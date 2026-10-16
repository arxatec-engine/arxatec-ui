import { Button } from "../../button";
import { ButtonGroup } from "../../button_group";
import { LayoutGrid, List } from "lucide-react";
import type { ExplorerViewMode } from "./types";
export interface ExplorerViewModeToggleProps {
  value: ExplorerViewMode;
  onValueChange: (value: ExplorerViewMode) => void;
  labels?: Partial<{ list: string; grid: string }>;
}
export function ExplorerViewModeToggle({
  value,
  onValueChange,
  labels,
}: ExplorerViewModeToggleProps) {
  return (
    <ButtonGroup>
      <Button
        size="sm"
        variant={value === "list" ? "default" : "outline"}
        aria-label={labels?.list ?? "List"}
        title={labels?.list ?? "List"}
        aria-pressed={value === "list"}
        onClick={() => onValueChange("list")}
      >
        <List className="size-4" />
      </Button>
      <Button
        size="sm"
        variant={value === "grid" ? "default" : "outline"}
        aria-label={labels?.grid ?? "Grid"}
        title={labels?.grid ?? "Grid"}
        aria-pressed={value === "grid"}
        onClick={() => onValueChange("grid")}
      >
        <LayoutGrid className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
