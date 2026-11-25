import type { CSSProperties } from "react";

import { cn } from "@/utilities/class";

import { columnLabel } from "../../utilities/column_label";
import { cellAppearance } from "../../utilities/cell_appearance";
import type { SpreadsheetGridView } from "../../types";

interface Props {
  grid: SpreadsheetGridView;
  row: number;
  column: number;
  style: CSSProperties;
  rowSpan?: number;
  columnSpan?: number;
  className?: string;
}

export const SpreadsheetGridCell = ({
  grid,
  row,
  column,
  style,
  rowSpan,
  columnSpan,
  className,
}: Props) => {
  const { sheet, scale, range, id, activeRow, activeColumn, labels } = grid;
  const cell = sheet.cells[`${row}:${column}`];
  const note = cell?.missingResult ? labels.missingResult : "";
  return (
    <div
      id={`${id}-cell-${row}-${column}`}
      role="gridcell"
      aria-selected={Boolean(
        range &&
        row >= range.startRow &&
        row <= range.endRow &&
        column >= range.startColumn &&
        column <= range.endColumn,
      )}
      aria-colindex={column + 2}
      aria-rowspan={rowSpan}
      aria-colspan={columnSpan}
      data-cell={`${columnLabel(column)}${row + 1}`}
      data-active={(row === activeRow && column === activeColumn) || undefined}
      data-slot="spreadsheet-cell"
      className={cn(
        "absolute top-0 border-b border-r border-border",
        className,
      )}
      title={[cell?.text, note].filter(Boolean).join("\n")}
      style={{
        ...cellAppearance(cell, scale),
        ...style,
        outline:
          row === activeRow && column === activeColumn
            ? "2px solid var(--primary)"
            : undefined,
        outlineOffset: -2,
      }}
    >
      <span className="min-w-0 w-full">{cell?.text}</span>
      {cell?.missingResult && <span className="sr-only">{note}</span>}
    </div>
  );
};
