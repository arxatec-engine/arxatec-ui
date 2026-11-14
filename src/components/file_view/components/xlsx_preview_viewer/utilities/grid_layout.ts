import type {
  SpreadsheetAxis,
  SpreadsheetGridLayout,
  SpreadsheetGridView,
  SpreadsheetSelection,
  SpreadsheetSheet,
} from "../types";
import { HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../constants/grid";
import { lowerBound } from "./selection";

export function definedCount(
  count: number,
  definitions: Record<number, SpreadsheetAxis>,
) {
  return Object.keys(definitions).reduce(
    (end, index) => Math.max(end, Number(index) + 1),
    count,
  );
}

export function axis(
  count: number,
  definitions: Record<number, SpreadsheetAxis>,
  defaultSize: number,
  scale: number,
) {
  const indices: number[] = [];
  const sizes: number[] = [];
  const offsets: number[] = [0];
  for (let index = 0; index < count; index++) {
    const definition = definitions[index];
    if (definition?.hidden) continue;
    const requested = definition?.size ?? defaultSize;
    const size =
      Math.max(4, Number.isFinite(requested) ? requested : defaultSize) * scale;
    indices.push(index);
    sizes.push(size);
    offsets.push(offsets[offsets.length - 1] + size);
  }
  return { indices, sizes, offsets, total: offsets[offsets.length - 1] };
}

export function visibleGridLayout(
  sheet: SpreadsheetSheet,
  rows: SpreadsheetGridLayout["rows"],
  columns: SpreadsheetGridLayout["columns"],
  virtualRows: SpreadsheetGridLayout["virtualRows"],
  virtualColumns: SpreadsheetGridLayout["virtualColumns"],
) {
  const firstRow = virtualRows[0]?.index ?? 0;
  const lastRow = virtualRows.at(-1)?.index ?? -1;
  const firstColumn = virtualColumns[0]?.index ?? 0;
  const lastColumn = virtualColumns.at(-1)?.index ?? -1;
  const visibleMerges = sheet.merges.flatMap((merge) => {
    const startRow = lowerBound(rows.indices, merge.startRow);
    const endRow = lowerBound(rows.indices, merge.endRow + 1);
    const startColumn = lowerBound(columns.indices, merge.startColumn);
    const endColumn = lowerBound(columns.indices, merge.endColumn + 1);
    if (
      startRow === endRow ||
      startColumn === endColumn ||
      endRow <= firstRow ||
      startRow > lastRow ||
      endColumn <= firstColumn ||
      startColumn > lastColumn
    )
      return [];
    return [
      {
        merge,
        rowIndex: startRow,
        left: ROW_HEADER_WIDTH + columns.offsets[startColumn],
        width: columns.offsets[endColumn] - columns.offsets[startColumn],
        height: rows.offsets[endRow] - rows.offsets[startRow],
      },
    ];
  });
  const renderedRows = [
    ...new Set([
      ...virtualRows.map((row) => row.index),
      ...visibleMerges.map((merge) => merge.rowIndex),
    ]),
  ].sort((a, b) => a - b);
  return { visibleMerges, renderedRows };
}

export function activeGridCell(
  selection: SpreadsheetSelection | null,
  sheet: SpreadsheetSheet,
  layout: SpreadsheetGridLayout,
) {
  const { rows, columns, visibleMerges, renderedRows, virtualColumns } = layout;
  const activeMerge =
    selection &&
    sheet.merges.find(
      (merge) =>
        selection.focus.row >= merge.startRow &&
        selection.focus.row <= merge.endRow &&
        selection.focus.column >= merge.startColumn &&
        selection.focus.column <= merge.endColumn,
    );
  const activeRow = activeMerge ? activeMerge.startRow : selection?.focus.row;
  const activeColumn = activeMerge
    ? activeMerge.startColumn
    : selection?.focus.column;
  const activeMounted = activeMerge
    ? visibleMerges.some(({ merge }) => merge === activeMerge)
    : renderedRows.some((index) => rows.indices[index] === activeRow) &&
      virtualColumns.some(
        (item) => columns.indices[item.index] === activeColumn,
      );
  return { activeRow, activeColumn, activeMounted };
}

export function selectionGeometry({
  range,
  layout: { rows, columns },
}: SpreadsheetGridView) {
  const startRow = range ? lowerBound(rows.indices, range.startRow) : 0;
  const endRow = range ? lowerBound(rows.indices, range.endRow + 1) : 0;
  const startColumn = range
    ? lowerBound(columns.indices, range.startColumn)
    : 0;
  const endColumn = range
    ? lowerBound(columns.indices, range.endColumn + 1)
    : 0;
  if (!range || startRow >= endRow || startColumn >= endColumn) return null;
  return {
    left: ROW_HEADER_WIDTH + columns.offsets[startColumn],
    top: HEADER_HEIGHT + rows.offsets[startRow],
    width: columns.offsets[endColumn] - columns.offsets[startColumn],
    height: rows.offsets[endRow] - rows.offsets[startRow],
    backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
  };
}
