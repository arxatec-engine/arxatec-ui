import { Textarea } from "@/components/text_area";
import { cn } from "@/utilities/class";

import { useCellInput } from "../../hooks/use_cell_input";
import type { SpreadsheetCellEditing } from "../../types/interaction";

interface Props {
  className?: string;
  editing: SpreadsheetCellEditing;
  sheet: string;
}

export const SpreadsheetCellInput = ({ editing, sheet, className }: Props) => {
  const { inputRef, value, change, commit, onKeyDown } = useCellInput(
    editing,
    sheet,
  );
  return (
    <Textarea
      ref={inputRef}
      data-slot="spreadsheet-cell-input"
      aria-label={editing.controller.labels.editCell}
      value={value}
      maxLength={32767}
      style={{ font: "inherit", textAlign: "inherit" }}
      className={cn(
        "absolute inset-0 z-20 h-full min-h-0 resize-none rounded-none border-2 border-primary bg-background px-1 py-0 text-inherit focus-visible:ring-0",
        className,
      )}
      onChange={(event) => change(event.target.value)}
      onBlur={commit}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    />
  );
};
