import { cn } from "@/utilities/class";

import type { SpreadsheetGridView } from "../../types";
import { selectionGeometry } from "../../utilities/grid_layout";
import { cellAppearance } from "../../utilities/cell_appearance";
import { SpreadsheetCellInput } from "../cell_input";

interface Props {
  grid: SpreadsheetGridView;
  className?: string;
}

export const SpreadsheetEditingCell = ({ grid, className }: Props) => {
  const editing = grid.editing;
  if (!editing) return null;
  const merge = grid.sheet.merges.find(
    (range) =>
      range.startRow === editing.row && range.startColumn === editing.column,
  );
  const range = merge ?? {
    startRow: editing.row,
    endRow: editing.row,
    startColumn: editing.column,
    endColumn: editing.column,
  };
  const geometry = selectionGeometry({ ...grid, range });
  if (!geometry) return null;
  return (
    <div
      data-slot="spreadsheet-editing-cell"
      className={cn("absolute z-[9]", className)}
      style={{
        ...cellAppearance(
          grid.sheet.cells[`${editing.row}:${editing.column}`],
          grid.scale,
        ),
        ...geometry,
      }}
    >
      <SpreadsheetCellInput
        key={`${editing.row}:${editing.column}`}
        editing={editing}
        sheet={grid.sheet.name}
      />
    </div>
  );
};
