import { useEffect, useMemo, useRef } from "react";
import type { FocusEvent, KeyboardEvent, PointerEvent } from "react";

import type {
  FileXlsxPreviewViewerLabels,
  SpreadsheetGridAxis,
  SpreadsheetPosition,
  SpreadsheetSelection,
  SpreadsheetSheet,
} from "../types";
import {
  lowerBound,
  selectionClipboard,
  selectionRange,
} from "../utilities/selection";

interface Options {
  labels: FileXlsxPreviewViewerLabels;
  sheet: SpreadsheetSheet;
  rows: SpreadsheetGridAxis;
  columns: SpreadsheetGridAxis;
  selection: SpreadsheetSelection | null;
  onSelectionChange: (selection: SpreadsheetSelection | null) => void;
  onCopyResult: (message: string, success: boolean) => void;
  viewportRef: { readonly current: HTMLDivElement | null };
  scrollToPosition: (rowIndex: number, columnIndex: number) => void;
  headerHeight: number;
  rowHeaderWidth: number;
}

function indexAtOffset(axis: SpreadsheetGridAxis, offset: number) {
  let start = 0;
  let end = axis.indices.length - 1;
  while (start < end) {
    const middle = (start + end) >>> 1;
    if (axis.offsets[middle + 1] <= offset) start = middle + 1;
    else end = middle;
  }
  return axis.indices[start];
}

export function useGridSelection(options: Options) {
  const gridRef = useRef<HTMLDivElement>(null);
  const latest = useRef(options);
  const drag = useRef<{
    id: number;
    anchor: SpreadsheetPosition;
    x: number;
    y: number;
  } | null>(null);
  const frame = useRef<number | null>(null);
  const range = useMemo(
    () =>
      options.selection
        ? selectionRange(options.selection, options.sheet.merges)
        : null,
    [options.selection, options.sheet.merges],
  );
  useEffect(() => {
    latest.current = options;
  }, [options]);
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      const current = latest.current;
      if (
        !current.selection ||
        !event.clipboardData ||
        !gridRef.current?.contains(document.activeElement)
      )
        return;
      event.preventDefault();
      try {
        const data = selectionClipboard(current.sheet, current.selection);
        event.clipboardData.setData("text/plain", data.text);
        event.clipboardData.setData("text/html", data.html);
        current.onCopyResult(current.labels.copied, true);
      } catch (error) {
        current.onCopyResult(
          error instanceof Error ? error.message : current.labels.copyError,
          false,
        );
      }
    };
    document.addEventListener("copy", copy);
    return () => {
      document.removeEventListener("copy", copy);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      drag.current = null;
    };
  }, []);

  const pointAt = (x: number, y: number): SpreadsheetPosition | null => {
    const current = latest.current;
    const viewport = current.viewportRef.current;
    if (
      !viewport ||
      !current.rows.indices.length ||
      !current.columns.indices.length
    )
      return null;
    const rect = viewport.getBoundingClientRect();
    const left = Math.min(
      rect.right - 1,
      Math.max(rect.left + current.rowHeaderWidth, x),
    );
    const top = Math.min(
      rect.bottom - 1,
      Math.max(rect.top + current.headerHeight, y),
    );
    return {
      row: indexAtOffset(
        current.rows,
        top - rect.top + viewport.scrollTop - current.headerHeight,
      ),
      column: indexAtOffset(
        current.columns,
        left - rect.left + viewport.scrollLeft - current.rowHeaderWidth,
      ),
    };
  };
  const selectAtPointer = () => {
    const pointer = drag.current;
    if (!pointer) return;
    const point = pointAt(pointer.x, pointer.y);
    if (point)
      latest.current.onSelectionChange({
        anchor: pointer.anchor,
        focus: point,
      });
  };
  const scrollDrag = () => {
    const pointer = drag.current;
    const current = latest.current;
    const viewport = current.viewportRef.current;
    if (!pointer || !viewport) return;
    const rect = viewport.getBoundingClientRect();
    const velocity = (value: number, start: number, end: number) =>
      value < start + 24
        ? -Math.min(32, start + 24 - value)
        : value > end - 24
          ? Math.min(32, value - end + 24)
          : 0;
    const left = viewport.scrollLeft;
    const top = viewport.scrollTop;
    viewport.scrollBy({
      left: velocity(pointer.x, rect.left + current.rowHeaderWidth, rect.right),
      top: velocity(pointer.y, rect.top + current.headerHeight, rect.bottom),
    });
    if (left !== viewport.scrollLeft || top !== viewport.scrollTop)
      selectAtPointer();
    frame.current = requestAnimationFrame(scrollDrag);
  };
  const stopDrag = () => {
    drag.current = null;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.button !== 0 ||
      !event.isPrimary ||
      !(event.target instanceof Element) ||
      !event.target.closest("[data-cell]")
    )
      return;
    const point = pointAt(event.clientX, event.clientY);
    if (!point) return;
    const anchor =
      event.shiftKey && options.selection ? options.selection.anchor : point;
    gridRef.current?.focus({ preventScroll: true });
    options.onSelectionChange({ anchor, focus: point });
    if (event.pointerType === "touch") return;
    event.preventDefault();
    stopDrag();
    drag.current = {
      id: event.pointerId,
      anchor,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    frame.current = requestAnimationFrame(scrollDrag);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    selectAtPointer();
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    stopDrag();
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onHandlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary || !range) return;
    event.preventDefault();
    event.stopPropagation();
    gridRef.current?.focus({ preventScroll: true });
    stopDrag();
    drag.current = {
      id: event.pointerId,
      anchor: { row: range.startRow, column: range.startColumn },
      x: event.clientX,
      y: event.clientY,
    };
    gridRef.current?.setPointerCapture(event.pointerId);
    frame.current = requestAnimationFrame(scrollDrag);
  };
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      options.selection ||
      !options.rows.indices.length ||
      !options.columns.indices.length
    )
      return;
    const point = pointAt(
      options.viewportRef.current?.getBoundingClientRect().left ?? 0,
      options.viewportRef.current?.getBoundingClientRect().top ?? 0,
    );
    if (point) options.onSelectionChange({ anchor: point, focus: point });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { rows, columns, sheet, selection, onSelectionChange } = options;
    if (event.altKey || !rows.indices.length || !columns.indices.length) return;
    const modifier = event.ctrlKey || event.metaKey;
    const first = { row: rows.indices[0], column: columns.indices[0] };
    const lastRow = Math.max(
      0,
      lowerBound(rows.indices, Math.max(1, sheet.rowCount)) - 1,
    );
    const lastColumn = Math.max(
      0,
      lowerBound(columns.indices, Math.max(1, sheet.columnCount)) - 1,
    );
    if (modifier && event.key.toLowerCase() === "a") {
      event.preventDefault();
      onSelectionChange({
        anchor: first,
        focus: {
          row: rows.indices[lastRow],
          column: columns.indices[lastColumn],
        },
      });
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      stopDrag();
      onSelectionChange(null);
      return;
    }
    const point = selection?.focus ?? first;
    const merge = sheet.merges.find(
      (item) =>
        point.row >= item.startRow &&
        point.row <= item.endRow &&
        point.column >= item.startColumn &&
        point.column <= item.endColumn,
    );
    let row = Math.min(
      rows.indices.length - 1,
      lowerBound(rows.indices, point.row),
    );
    let column = Math.min(
      columns.indices.length - 1,
      lowerBound(columns.indices, point.column),
    );
    switch (event.key) {
      case "ArrowDown":
        row = modifier
          ? Math.max(row, lastRow)
          : lowerBound(rows.indices, (merge?.endRow ?? point.row) + 1);
        break;
      case "ArrowUp":
        row = modifier
          ? 0
          : lowerBound(rows.indices, merge?.startRow ?? point.row) - 1;
        break;
      case "ArrowRight":
        column = modifier
          ? Math.max(column, lastColumn)
          : lowerBound(columns.indices, (merge?.endColumn ?? point.column) + 1);
        break;
      case "ArrowLeft":
        column = modifier
          ? 0
          : lowerBound(columns.indices, merge?.startColumn ?? point.column) - 1;
        break;
      case "Home":
        column = 0;
        if (modifier) row = 0;
        break;
      case "End":
        column = lastColumn;
        if (modifier) row = lastRow;
        break;
      default:
        return;
    }
    event.preventDefault();
    row = Math.max(0, Math.min(rows.indices.length - 1, row));
    column = Math.max(0, Math.min(columns.indices.length - 1, column));
    const focus = { row: rows.indices[row], column: columns.indices[column] };
    onSelectionChange({
      anchor: event.shiftKey && selection ? selection.anchor : focus,
      focus,
    });
    options.scrollToPosition(row, column);
  };
  return {
    gridRef,
    range,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onHandlePointerDown,
    onPointerCancel: stopDrag,
    onLostPointerCapture: stopDrag,
    onFocus,
    onKeyDown,
  };
}
