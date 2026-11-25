import { useState } from "react";
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from "react";

import { useSpreadsheetEditing } from "../../contexts/editing";
import { SPREADSHEET_EDITOR_LIMITS } from "../../constants/editor";
import type {
  SpreadsheetPosition,
  SpreadsheetSelection,
  SpreadsheetSheet,
} from "../../types";
import { spreadsheetInput } from "../../utilities/editing/value";
import { parseSpreadsheetClipboard } from "../../utilities/editing/range";
import { selectionRange } from "../../utilities/selection";

export const useGridEditing = (
  sheet: SpreadsheetSheet,
  selection: SpreadsheetSelection | null,
  select: (value: SpreadsheetSelection | null) => void,
) => {
  const controller = useSpreadsheetEditing();
  const [active, setActive] = useState<
    SpreadsheetPosition & { input: string; original: string }
  >();
  const start = (row: number, column: number, input?: string) => {
    if (!controller) return;
    const merge = sheet.merges.find(
      (range) =>
        row >= range.startRow &&
        row <= range.endRow &&
        column >= range.startColumn &&
        column <= range.endColumn,
    );
    const position = {
      row: merge?.startRow ?? row,
      column: merge?.startColumn ?? column,
    };
    const original = spreadsheetInput(
      sheet.cells[`${position.row}:${position.column}`],
    );
    setActive({ ...position, input: input ?? original, original });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      !controller ||
      (event.target instanceof Element &&
        event.target.closest("input,textarea,[contenteditable=true]"))
    )
      return false;
    const point = selection?.focus;
    if (!point) return false;
    if (
      event.key === "F2" ||
      event.key === "Enter" ||
      (!event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.key.length === 1)
    ) {
      event.preventDefault();
      start(
        point.row,
        point.column,
        event.key.length === 1 ? event.key : undefined,
      );
      return true;
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      controller.apply({
        kind: "clear",
        sheet: sheet.name,
        range: selectionRange(selection, sheet.merges),
      });
      return true;
    }
    return false;
  };
  const onDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const cell =
      event.target instanceof Element
        ? (event.target.closest<HTMLElement>("[data-cell]") ??
          document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest<HTMLElement>("[data-cell]"))
        : null;
    if (cell) start(Number(cell.dataset.row), Number(cell.dataset.column));
  };
  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (
      !controller ||
      !selection ||
      (event.target instanceof Element &&
        event.target.closest("input,textarea"))
    )
      return;
    event.preventDefault();
    try {
      controller.apply({
        kind: "paste",
        sheet: sheet.name,
        row: selection.focus.row,
        column: selection.focus.column,
        values: parseSpreadsheetClipboard(
          event.clipboardData.getData("text/plain"),
        ),
      });
    } catch {
      controller.apply({
        kind: "paste",
        sheet: sheet.name,
        row: -1,
        column: -1,
        values: [],
      });
    }
  };
  const editing =
    active && controller
      ? {
          row: active.row,
          column: active.column,
          initialValue: active.input,
          originalValue: active.original,
          controller,
          close: (movement?: "next" | "down") => {
            setActive(undefined);
            const focus = {
              row: Math.min(
                SPREADSHEET_EDITOR_LIMITS.rows - 1,
                active.row + (movement === "down" ? 1 : 0),
              ),
              column: Math.min(
                SPREADSHEET_EDITOR_LIMITS.columns - 1,
                active.column + (movement === "next" ? 1 : 0),
              ),
            };
            select({ anchor: focus, focus });
          },
        }
      : undefined;
  return { editing, enabled: !!controller, onKeyDown, onDoubleClick, onPaste };
};
