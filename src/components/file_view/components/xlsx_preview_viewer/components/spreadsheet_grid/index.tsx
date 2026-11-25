import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import { HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../constants/grid";
import { useSpreadsheetGrid } from "../../hooks/use_spreadsheet_grid";
import type { SpreadsheetGridProps } from "../../types";
import { SpreadsheetGridHeader } from "../grid_header";
import { SpreadsheetGridRow } from "../grid_row";
import { SpreadsheetGridSelection } from "../grid_selection";
import { SpreadsheetEditingCell } from "../editing_cell";

export const SpreadsheetGrid = ({
  sheet,
  scale,
  selection,
  onSelectionChange,
  onCopyResult,
  className,
  labels: customLabels,
}: SpreadsheetGridProps) => {
  const {
    id,
    labels,
    viewportRef,
    layout,
    grid,
    editor,
    activeRow,
    activeColumn,
    activeMounted,
    gridRef,
    onFocus,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onHandlePointerDown,
  } = useSpreadsheetGrid({
    sheet,
    scale,
    selection,
    onSelectionChange,
    onCopyResult,
    labels: customLabels,
  });
  const { rows, columns, rowCount, columnCount } = layout;
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
        aria-readonly={!editor.enabled}
        aria-multiselectable="true"
        aria-describedby={`${id}-help`}
        aria-activedescendant={
          activeMounted ? `${id}-cell-${activeRow}-${activeColumn}` : undefined
        }
        tabIndex={0}
        onFocus={onFocus}
        onKeyDown={(event) => {
          if (!editor.onKeyDown(event)) onKeyDown(event);
        }}
        onDoubleClick={editor.onDoubleClick}
        onPaste={editor.onPaste}
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
        <SpreadsheetEditingCell grid={grid} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export type { SpreadsheetGridProps } from "../../types";
