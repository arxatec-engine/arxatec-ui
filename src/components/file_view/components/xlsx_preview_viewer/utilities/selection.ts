import type {
  SpreadsheetAxis,
  SpreadsheetMerge,
  SpreadsheetSelection,
  SpreadsheetSheet,
} from "../types";
import { columnLabel } from "./column_label";
import { SPREADSHEET_LIMITS } from "./constants";

export function lowerBound(values: number[], target: number) {
  let start = 0;
  let end = values.length;
  while (start < end) {
    const middle = (start + end) >>> 1;
    if (values[middle] < target) start = middle + 1;
    else end = middle;
  }
  return start;
}

export function selectionRange(
  selection: SpreadsheetSelection,
  merges: SpreadsheetMerge[],
): SpreadsheetMerge {
  const range = {
    startRow: Math.min(selection.anchor.row, selection.focus.row),
    endRow: Math.max(selection.anchor.row, selection.focus.row),
    startColumn: Math.min(selection.anchor.column, selection.focus.column),
    endColumn: Math.max(selection.anchor.column, selection.focus.column),
  };
  let changed = true;
  while (changed) {
    changed = false;
    for (const merge of merges) {
      if (
        merge.startRow > range.endRow ||
        merge.endRow < range.startRow ||
        merge.startColumn > range.endColumn ||
        merge.endColumn < range.startColumn
      )
        continue;
      if (
        merge.startRow < range.startRow ||
        merge.endRow > range.endRow ||
        merge.startColumn < range.startColumn ||
        merge.endColumn > range.endColumn
      ) {
        range.startRow = Math.min(range.startRow, merge.startRow);
        range.endRow = Math.max(range.endRow, merge.endRow);
        range.startColumn = Math.min(range.startColumn, merge.startColumn);
        range.endColumn = Math.max(range.endColumn, merge.endColumn);
        changed = true;
      }
    }
  }
  return range;
}

export function selectionLabel(range: SpreadsheetMerge): string {
  const first = `${columnLabel(range.startColumn)}${range.startRow + 1}`;
  const last = `${columnLabel(range.endColumn)}${range.endRow + 1}`;
  return first === last ? first : `${first}:${last}`;
}

function visibleCount(
  start: number,
  end: number,
  axis: Record<number, SpreadsheetAxis>,
) {
  return Object.keys(axis).reduce(
    (count, key) => {
      const index = Number(key);
      return (
        count - (index >= start && index <= end && axis[index].hidden ? 1 : 0)
      );
    },
    end - start + 1,
  );
}

function visibleIndices(
  start: number,
  end: number,
  axis: Record<number, SpreadsheetAxis>,
) {
  const indices: number[] = [];
  for (let index = start; index <= end; index++)
    if (!axis[index]?.hidden) indices.push(index);
  return indices;
}

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
const tsvField = (text: string) =>
  /[\t\r\n"]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;

export function selectionClipboard(
  sheet: SpreadsheetSheet,
  selection: SpreadsheetSelection,
) {
  const range = selectionRange(selection, sheet.merges);
  const rowCount = visibleCount(range.startRow, range.endRow, sheet.rows);
  const columnCount = visibleCount(
    range.startColumn,
    range.endColumn,
    sheet.columns,
  );
  if (rowCount * columnCount > SPREADSHEET_LIMITS.clipboardCells)
    throw new Error(
      "Selecciona un rango más pequeño para copiar (máximo 500 000 celdas).",
    );
  const rows = visibleIndices(range.startRow, range.endRow, sheet.rows);
  const columns = visibleIndices(
    range.startColumn,
    range.endColumn,
    sheet.columns,
  );
  type Span = SpreadsheetMerge & {
    row: number;
    column: number;
    rowSpan: number;
    columnSpan: number;
  };
  const mergedRows = new Map<number, Span[]>();
  for (const merge of sheet.merges) {
    const firstRow = lowerBound(rows, merge.startRow);
    const lastRow = lowerBound(rows, merge.endRow + 1);
    const firstColumn = lowerBound(columns, merge.startColumn);
    const lastColumn = lowerBound(columns, merge.endColumn + 1);
    if (firstRow === lastRow || firstColumn === lastColumn) continue;
    const span = {
      ...merge,
      row: rows[firstRow],
      column: columns[firstColumn],
      rowSpan: lastRow - firstRow,
      columnSpan: lastColumn - firstColumn,
    };
    for (let index = firstRow; index < lastRow; index++) {
      const spans = mergedRows.get(rows[index]) ?? [];
      spans.push(span);
      mergedRows.set(rows[index], spans);
    }
  }
  const textRows: string[] = [];
  const htmlRows: string[] = [];
  for (const row of rows) {
    const spans = (mergedRows.get(row) ?? []).sort(
      (a, b) => a.startColumn - b.startColumn,
    );
    let spanIndex = 0;
    const fields: string[] = [];
    const cells: string[] = [];
    for (const column of columns) {
      while (spans[spanIndex] && spans[spanIndex].endColumn < column)
        spanIndex++;
      const candidate = spans[spanIndex];
      const span =
        candidate && candidate.startColumn <= column ? candidate : undefined;
      const first = !span || (span.row === row && span.column === column);
      const cell = span
        ? sheet.cells[`${span.startRow}:${span.startColumn}`]
        : sheet.cells[`${row}:${column}`];
      const text = first ? (cell?.text ?? "") : "";
      fields.push(tsvField(text));
      if (first)
        cells.push(
          `<td style="white-space:pre-wrap"${span ? ` rowspan="${span.rowSpan}" colspan="${span.columnSpan}"` : ""}>${escapeHtml(text).replace(/\r\n?|\n/g, "<br>")}</td>`,
        );
    }
    textRows.push(fields.join("\t"));
    htmlRows.push(`<tr>${cells.join("")}</tr>`);
  }
  return {
    text: textRows.join("\r\n"),
    html: `<table><tbody>${htmlRows.join("")}</tbody></table>`,
  };
}

export async function writeSelectionClipboard(data: {
  text: string;
  html: string;
}) {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([data.text], { type: "text/plain" }),
          "text/html": new Blob([data.html], { type: "text/html" }),
        }),
      ]);
      return;
    } catch {
      if (!navigator.clipboard.writeText)
        throw new Error("Usa Ctrl/Cmd+C para copiar la selección.");
    }
  }
  if (!navigator.clipboard?.writeText)
    throw new Error("Usa Ctrl/Cmd+C para copiar la selección.");
  try {
    await navigator.clipboard.writeText(data.text);
  } catch {
    throw new Error(
      "No se pudo copiar. Usa Ctrl/Cmd+C con la cuadrícula seleccionada.",
    );
  }
}
