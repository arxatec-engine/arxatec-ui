import { afterEach, describe, expect, it, vi } from "vitest";

import type { SpreadsheetSelection, SpreadsheetSheet } from "../types";
import {
  selectionClipboard,
  selectionLabel,
  selectionRange,
  writeSelectionClipboard,
} from "./selection";

const sheet = (cells: Record<string, string> = {}): SpreadsheetSheet => ({
  name: "Datos",
  rowCount: 4,
  columnCount: 4,
  defaultRowHeight: 20,
  defaultColumnWidth: 90,
  rows: {},
  columns: {},
  merges: [],
  cells: Object.fromEntries(
    Object.entries(cells).map(([coordinate, text]) => [
      coordinate,
      { text, style: {} },
    ]),
  ),
});
const select = (
  row: number,
  column: number,
  endRow = row,
  endColumn = column,
): SpreadsheetSelection => ({
  anchor: { row, column },
  focus: { row: endRow, column: endColumn },
});
afterEach(() => vi.unstubAllGlobals());

describe("spreadsheet selection clipboard", () => {
  it("copies reversed rectangular ranges with blank cells and formatted values", () => {
    const data = sheet({
      "0:0": "Fecha",
      "0:1": "12/11/2026",
      "1:0": "0",
      "1:1": "S/ 375.00",
      "2:1": "50%",
    });
    const result = selectionClipboard(data, select(2, 1, 0, 0));
    expect(result.text).toBe("Fecha\t12/11/2026\r\n0\tS/ 375.00\r\n\t50%");
    expect(selectionLabel(selectionRange(select(2, 1, 0, 0), []))).toBe(
      "A1:B3",
    );
  });

  it("quotes tabs, line breaks and quotes while escaping HTML as cell text", () => {
    const result = selectionClipboard(
      sheet({
        "0:0": 'Dos\n"líneas"\ty tab',
        "0:1": '<img src=x onerror="alert(1)">',
      }),
      select(0, 0, 0, 1),
    );
    expect(result.text).toBe(
      '"Dos\n""líneas""\ty tab"\t"<img src=x onerror=""alert(1)"">"',
    );
    const doc = new DOMParser().parseFromString(result.html, "text/html");
    expect(doc.querySelectorAll("img,script")).toHaveLength(0);
    expect(doc.querySelectorAll("td")[1].textContent).toBe(
      '<img src=x onerror="alert(1)">',
    );
    expect(doc.querySelectorAll("br")).toHaveLength(1);
  });

  it("expands intersecting merges and emits each merged value once", () => {
    const data = sheet({ "0:0": "Título", "1:2": "Nota" });
    data.merges = [
      { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
      { startRow: 1, endRow: 2, startColumn: 2, endColumn: 3 },
    ];
    const selection = select(1, 1, 1, 2);
    expect(selectionRange(selection, data.merges)).toEqual({
      startRow: 0,
      endRow: 2,
      startColumn: 0,
      endColumn: 3,
    });
    const copied = selectionClipboard(data, selection);
    expect(copied.text).toBe("Título\t\t\t\r\n\t\tNota\t\r\n\t\t\t");
    const doc = new DOMParser().parseFromString(copied.html, "text/html");
    expect(doc.querySelectorAll('[rowspan="2"][colspan="2"]')).toHaveLength(2);
    expect(doc.body.textContent).toBe("TítuloNota");
  });

  it("omits hidden axes and retains a merged value whose anchor is hidden", () => {
    const data = sheet({ "0:0": "Combinada", "2:2": "Visible" });
    data.rows[0] = { hidden: true };
    data.columns[0] = { hidden: true };
    data.merges = [{ startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 }];
    const result = selectionClipboard(data, select(1, 1, 2, 2));
    expect(result.text).toBe("Combinada\t\r\n\tVisible");
    expect(result.html).toContain('rowspan="1" colspan="1"');
  });

  it("copies rows outside the mounted viewport from the model", () => {
    const data = sheet({ "0:0": "Inicio", "2000:1": "Final" });
    const lines = selectionClipboard(data, select(0, 0, 2000, 1)).text.split(
      "\r\n",
    );
    expect(lines).toHaveLength(2001);
    expect(lines[0]).toBe("Inicio\t");
    expect(lines[1000]).toBe("\t");
    expect(lines[2000]).toBe("\tFinal");
  });

  it("keeps empty selected cells and rejects oversized ranges before allocation", () => {
    expect(selectionClipboard(sheet(), select(0, 0, 1, 1)).text).toBe(
      "\t\r\n\t",
    );
    expect(() =>
      selectionClipboard(sheet(), select(0, 0, 1_048_575, 16_383)),
    ).toThrow("rango más pequeño");
    expect(selectionLabel(selectionRange(select(2, 26), []))).toBe("AA3");
  });
  it("enforces the copy budget when sized axes omit the hidden flag", () => {
    const data = sheet();
    data.rows[0] = { size: 40 };
    data.columns[0] = { size: 180 };
    expect(() => selectionClipboard(data, select(0, 0, 500, 999))).toThrow(
      "rango más pequeño",
    );
  });
});

describe("clipboard formats and fallback", () => {
  it("writes plain text and HTML together", async () => {
    class Item {
      constructor(readonly data: Record<string, Blob>) {}
    }
    const write = vi
      .fn<(items: Item[]) => Promise<void>>()
      .mockResolvedValue(undefined);
    vi.stubGlobal("ClipboardItem", Item);
    vi.stubGlobal("navigator", { clipboard: { write } });
    await writeSelectionClipboard({ text: "A\tB", html: "<table></table>" });
    const item = write.mock.calls[0][0][0];
    expect(item.data["text/plain"].type).toBe("text/plain");
    expect(item.data["text/html"].type).toBe("text/html");
  });

  it("falls back to plain text if rich clipboard access fails", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("ClipboardItem", class {});
    vi.stubGlobal("navigator", {
      clipboard: {
        write: vi.fn().mockRejectedValue(new Error("unsupported")),
        writeText,
      },
    });
    await writeSelectionClipboard({ text: "A\tB", html: "<table></table>" });
    expect(writeText).toHaveBeenCalledWith("A\tB");
  });

  it("reports denied writes without claiming success", async () => {
    vi.stubGlobal("ClipboardItem", undefined);
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    await expect(
      writeSelectionClipboard({ text: "A", html: "<table></table>" }),
    ).rejects.toThrow("Ctrl/Cmd+C");
  });
});
