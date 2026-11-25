import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  HEADER_HEIGHT,
  ROW_HEADER_WIDTH,
  MAX_ROWS,
  MAX_COLUMNS,
} from "../../constants/grid";
import {
  definedCount,
  axis,
  visibleGridLayout,
} from "../../utilities/grid_layout";
import type { SpreadsheetSheet } from "../../types";
import { useSpreadsheetEditing } from "../../contexts/editing";
import { SPREADSHEET_EDITOR_LIMITS } from "../../constants/editor";

export const useSpreadsheetViewport = (
  sheet: SpreadsheetSheet,
  scale: number,
) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const editing = useSpreadsheetEditing();
  const maxRows = editing ? SPREADSHEET_EDITOR_LIMITS.rows : MAX_ROWS;
  const maxColumns = editing ? SPREADSHEET_EDITOR_LIMITS.columns : MAX_COLUMNS;
  const [rowExtent, setRowExtent] = useState(100);
  const [columnExtent, setColumnExtent] = useState(26);
  const defined = useMemo(
    () => ({
      rows: definedCount(sheet.rowCount, sheet.rows),
      columns: definedCount(sheet.columnCount, sheet.columns),
    }),
    [sheet],
  );
  const rowCount = Math.min(maxRows, Math.max(rowExtent, defined.rows + 50));
  const columnCount = Math.min(
    maxColumns,
    Math.max(columnExtent, defined.columns + 10),
  );
  const rows = useMemo(
    () => axis(rowCount, sheet.rows, sheet.defaultRowHeight, scale),
    [sheet, scale, rowCount],
  );
  const columns = useMemo(
    () => axis(columnCount, sheet.columns, sheet.defaultColumnWidth, scale),
    [sheet, scale, columnCount],
  );
  const rowVirtualizer = useVirtualizer({
    count: rows.indices.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: (index) => rows.sizes[index],
    overscan: 5,
    scrollMargin: HEADER_HEIGHT,
    scrollPaddingStart: HEADER_HEIGHT,
    initialRect: { width: 900, height: 600 },
    onChange: (instance) => {
      if (
        instance.range &&
        instance.range.endIndex >= instance.options.count - 20
      )
        setRowExtent((current) =>
          current === rowExtent ? Math.min(maxRows, rowCount + 100) : current,
        );
    },
  });
  const columnVirtualizer = useVirtualizer({
    count: columns.indices.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: (index) => columns.sizes[index],
    horizontal: true,
    overscan: 3,
    scrollMargin: ROW_HEADER_WIDTH,
    scrollPaddingStart: ROW_HEADER_WIDTH,
    initialRect: { width: 900, height: 600 },
    onChange: (instance) => {
      if (
        instance.range &&
        instance.range.endIndex >= instance.options.count - 8
      )
        setColumnExtent((current) =>
          current === columnExtent
            ? Math.min(maxColumns, columnCount + 26)
            : current,
        );
    },
  });
  useEffect(() => {
    rowVirtualizer.measure();
    columnVirtualizer.measure();
  }, [scale, sheet, rowVirtualizer, columnVirtualizer]);
  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();
  const layout = {
    rows,
    columns,
    rowCount,
    columnCount,
    virtualRows,
    virtualColumns,
    ...visibleGridLayout(sheet, rows, columns, virtualRows, virtualColumns),
  };
  const scrollToPosition = (rowIndex: number, columnIndex: number) => {
    rowVirtualizer.scrollToIndex(rowIndex, { align: "auto" });
    columnVirtualizer.scrollToIndex(columnIndex, { align: "auto" });
  };
  return { viewportRef, layout, scrollToPosition };
};
