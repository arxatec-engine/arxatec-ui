import { cn } from "@/utilities/class";

import { HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../constants/grid";
import type { SpreadsheetGridView } from "../../types";
import { SpreadsheetGridCell } from "../grid_cell";

interface Props {
  rowIndex: number;
  grid: SpreadsheetGridView;
  className?: string;
}

export const SpreadsheetGridRow = ({ rowIndex, grid, className }: Props) => {
  const { rows, columns, visibleMerges, virtualColumns } = grid.layout;
  const row = rows.indices[rowIndex];
  const rowMerges = visibleMerges.filter(
    (merge) => merge.rowIndex === rowIndex,
  );
  return (
    <div
      data-slot="spreadsheet-row"
      role="row"
      aria-rowindex={row + 2}
      className={cn("absolute left-0 w-full", className)}
      style={{
        top: HEADER_HEIGHT + rows.offsets[rowIndex],
        height: rows.sizes[rowIndex],
      }}
    >
      {virtualColumns.map(({ index, size }) => {
        const column = columns.indices[index];
        if (
          visibleMerges.some(
            ({ merge }) =>
              row >= merge.startRow &&
              row <= merge.endRow &&
              column >= merge.startColumn &&
              column <= merge.endColumn,
          )
        )
          return null;
        return (
          <SpreadsheetGridCell
            key={column}
            grid={grid}
            row={row}
            column={column}
            style={{
              left: ROW_HEADER_WIDTH + columns.offsets[index],
              width: size,
              height: rows.sizes[rowIndex],
            }}
          />
        );
      })}
      {rowMerges.map(({ merge, left, width, height }) => (
        <SpreadsheetGridCell
          key={`merge-${merge.startRow}-${merge.startColumn}`}
          grid={grid}
          row={merge.startRow}
          column={merge.startColumn}
          style={{ left, width, height, zIndex: 5 }}
          rowSpan={merge.endRow - merge.startRow + 1}
          columnSpan={merge.endColumn - merge.startColumn + 1}
        />
      ))}

      <div
        role="rowheader"
        aria-colindex={1}
        className="sticky left-0 z-10 flex items-center justify-center border-b border-r border-border bg-muted text-muted-foreground text-xs select-none"
        style={{
          width: ROW_HEADER_WIDTH,
          height: rows.sizes[rowIndex],
        }}
      >
        {row + 1}
      </div>
    </div>
  );
};
