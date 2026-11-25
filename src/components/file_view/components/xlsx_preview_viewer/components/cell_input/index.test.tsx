import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SPREADSHEET_EDITOR_LABELS } from "../../constants/editor";
import type { SpreadsheetCellEditing } from "../../types/interaction";
import { SpreadsheetCellInput } from ".";

function setup(initialValue: string, valid = true) {
  const apply = vi.fn(() => valid);
  const registerDraft = vi.fn();
  const close = vi.fn();
  const editing: SpreadsheetCellEditing = {
    row: 0,
    column: 0,
    initialValue,
    originalValue: "",
    close,
    controller: { apply, registerDraft, labels: SPREADSHEET_EDITOR_LABELS },
  };
  render(
    <div role="grid" tabIndex={0}>
      <SpreadsheetCellInput editing={editing} sheet="Data" />
    </div>,
  );
  const input = screen.getByRole("textbox", { name: "Edit cell" });
  return { apply, registerDraft, close, input };
}

describe("spreadsheet cell input", () => {
  it("keeps invalid input focused until the value is corrected", () => {
    const { apply, close, input } = setup("=", false);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(close).not.toHaveBeenCalled();
    expect(input).toHaveFocus();
    expect(input).toHaveValue("=");
    apply.mockReturnValue(true);
    fireEvent.change(input, { target: { value: "=1+1" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(close).toHaveBeenCalledWith("down");
    expect(screen.getByRole("grid")).toHaveFocus();
  });

  it("marks the first typed character dirty and commits it only once", () => {
    const { apply, registerDraft, input } = setup("7");
    expect(registerDraft).toHaveBeenCalledWith(expect.any(Function), true);
    fireEvent.keyDown(input, { key: "Tab" });
    fireEvent.blur(input);
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith({
      kind: "cell",
      sheet: "Data",
      row: 0,
      column: 0,
      input: "7",
    });
    expect(registerDraft).toHaveBeenLastCalledWith(null, false);
  });

  it("discards the pending cell value on Escape without applying it", () => {
    const { apply, registerDraft, close, input } = setup("draft");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(apply).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalledWith();
    expect(registerDraft).toHaveBeenLastCalledWith(null, false);
    expect(screen.getByRole("grid")).toHaveFocus();
  });
});
