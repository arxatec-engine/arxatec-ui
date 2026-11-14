import { useId } from "react";

import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import { HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../constants/grid";
import { SPREADSHEET_LABELS } from "../../constants/labels";
import { useGridSelection } from "../../hooks/use_grid_selection";
import { useSpreadsheetViewport } from "../../hooks/use_spreadsheet_viewport";
import { activeGridCell } from "../../utilities/grid_layout";
import type { SpreadsheetGridProps } from "../../types";
import { SpreadsheetGridHeader } from "../grid_header";
import { SpreadsheetGridRow } from "../grid_row";
import { SpreadsheetGridSelection } from "../grid_selection";

export const SpreadsheetGrid = ({
  sheet,
  scale,
  selection,
  onSelectionChange,
  onCopyResult,
  className,
  labels: customLabels,
}: SpreadsheetGridProps) => {
  const id = useId();
  const labels = { ...SPREADSHEET_LABELS, ...customLabels };
  const { viewportRef, layout, scrollToPosition } = useSpreadsheetViewport(
    sheet,
    scale,
  );
  const { rows, columns, rowCount, columnCount } = layout;
  const {
    gridRef,
    range,
    onFocus,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onHandlePointerDown,
  } = useGridSelection({
    sheet,
    rows,
    columns,
    selection,
    onSelectionChange,
    onCopyResult,
    viewportRef,
    headerHeight: HEADER_HEIGHT,
    rowHeaderWidth: ROW_HEADER_WIDTH,
    scrollToPosition,
    labels,
  });
  const { activeRow, activeColumn, activeMounted } = activeGridCell(
    selection,
    sheet,
    layout,
  );
  const grid = {
    id,
    sheet,
    scale,
    layout,
    range: range,
    activeRow,
    activeColumn,
    labels,
  };
  return (
    <ScrollArea
      viewportRef={viewportRef}
      data-slot="spreadsheet-grid"
      className={cn(
        "h-full w-full overflow-hidden rounded-md border border-border bg-background text-foreground",
        className,
      )}
    >
      <span id={`${id}-help`} className="sr-only">
        {labels.selectionHelp}
      </span>
      <div
        ref={gridRef}
        data-slot="spreadsheet-grid-content"
        role="grid"
        aria-label={sheet.name}
        aria-readonly="true"
        aria-multiselectable="true"
        aria-describedby={`${id}-help`}
        aria-activedescendant={
          activeMounted ? `${id}-cell-${activeRow}-${activeColumn}` : undefined
        }
        tabIndex={0}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={onLostPointerCapture}
        aria-rowcount={rowCount + 1}
        aria-colcount={columnCount + 1}
        className="relative select-none font-sans outline-none"
        style={{
          width: columns.total + ROW_HEADER_WIDTH,
          minWidth: "100%",
          height: rows.total + HEADER_HEIGHT,
        }}
      >
        <SpreadsheetGridHeader layout={layout} />
        {layout.renderedRows.map((rowIndex) => (
          <SpreadsheetGridRow
            key={rows.indices[rowIndex]}
            rowIndex={rowIndex}
            grid={grid}
          />
        ))}
        <SpreadsheetGridSelection
          grid={grid}
          onHandlePointerDown={onHandlePointerDown}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export type { SpreadsheetGridProps } from "../../types";
