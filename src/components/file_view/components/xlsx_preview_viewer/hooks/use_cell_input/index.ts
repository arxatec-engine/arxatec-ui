import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import type { SpreadsheetCellEditing } from "../../types/interaction";

export const useCellInput = (
  editing: SpreadsheetCellEditing,
  sheet: string,
) => {
  const [value, setValue] = useState(editing.initialValue);
  const valueRef = useRef(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const finished = useRef(false);
  const commit = (movement?: "next" | "down") => {
    if (finished.current) return true;
    if (
      !editing.controller.apply({
        kind: "cell",
        sheet,
        row: editing.row,
        column: editing.column,
        input: valueRef.current,
      })
    )
      return false;
    finished.current = true;
    editing.controller.registerDraft(null, false);
    editing.close(movement);
    return true;
  };
  const change = (next: string) => {
    valueRef.current = next;
    setValue(next);
    editing.controller.registerDraft(
      () => commit(),
      next !== editing.originalValue,
    );
  };
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(
      valueRef.current.length,
      valueRef.current.length,
    );
    editing.controller.registerDraft(
      () => commit(),
      valueRef.current !== editing.originalValue,
    );
    return () => editing.controller.registerDraft(null, false);
  }, []);
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if ((event.key === "Enter" && !event.altKey) || event.key === "Tab") {
      event.preventDefault();
      if (commit(event.key === "Tab" ? "next" : "down"))
        (
          event.currentTarget.closest('[role="grid"]') as HTMLElement | null
        )?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      finished.current = true;
      editing.controller.registerDraft(null, false);
      editing.close();
      (
        event.currentTarget.closest('[role="grid"]') as HTMLElement | null
      )?.focus();
    }
  };
  return { value, inputRef, change, commit: () => commit(), onKeyDown };
};
