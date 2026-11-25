import { useId } from "react";

import { HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../constants/grid";
import { SPREADSHEET_LABELS } from "../../constants/labels";
import type { SpreadsheetGridProps, SpreadsheetGridView } from "../../types";
import { activeGridCell } from "../../utilities/grid_layout";
import { useGridEditing } from "../use_grid_editing";
import { useGridSelection } from "../use_grid_selection";
import { useSpreadsheetViewport } from "../use_spreadsheet_viewport";

export const useSpreadsheetGrid = (props: SpreadsheetGridProps) => {
  const { sheet, scale, selection, onSelectionChange, onCopyResult } = props;
  const id = useId();
  const labels = { ...SPREADSHEET_LABELS, ...props.labels };
  const viewport = useSpreadsheetViewport(sheet, scale);
  const { rows, columns } = viewport.layout;
  const events = useGridSelection({
    sheet,
    rows,
    columns,
    selection,
    onSelectionChange,
    onCopyResult,
    viewportRef: viewport.viewportRef,
    headerHeight: HEADER_HEIGHT,
    rowHeaderWidth: ROW_HEADER_WIDTH,
    scrollToPosition: viewport.scrollToPosition,
    labels,
  });
  const active = activeGridCell(selection, sheet, viewport.layout);
  const editor = useGridEditing(sheet, selection, onSelectionChange);
  const grid: SpreadsheetGridView = {
    id,
    sheet,
    scale,
    layout: viewport.layout,
    range: events.range,
    activeRow: active.activeRow,
    activeColumn: active.activeColumn,
    labels,
    editing: editor.editing,
  };
  return { ...viewport, ...events, ...active, grid, editor, labels, id };
};
