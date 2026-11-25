import { describe, expect, it } from "vitest";

import { assertSpreadsheetRange, parseSpreadsheetClipboard } from "./range";

describe("spreadsheet ranges", () => {
  it("accepts the last row and column and a range of exactly 100,000 cells", () => {
    expect(() => assertSpreadsheetRange({
      startRow: 19999, endRow: 19999, startColumn: 511, endColumn: 511,
    })).not.toThrow();
    expect(() => assertSpreadsheetRange({
      startRow: 0, endRow: 199, startColumn: 0, endColumn: 499,
    })).not.toThrow();
  });

  it.each([
    { startRow: -1, endRow: 0, startColumn: 0, endColumn: 0 },
    { startRow: 1, endRow: 0, startColumn: 0, endColumn: 0 },
    { startRow: 0, endRow: 20000, startColumn: 0, endColumn: 0 },
    { startRow: 0, endRow: 0, startColumn: 0, endColumn: 512 },
    { startRow: 0, endRow: 200, startColumn: 0, endColumn: 499 },
    { startRow: 0.5, endRow: 1, startColumn: 0, endColumn: 0 },
  ])("rejects an invalid or oversized range %o", (range) => {
    expect(() => assertSpreadsheetRange(range)).toThrow();
  });
});

describe("spreadsheet clipboard", () => {
  it("decodes quoted tabs, newlines, escaped quotes and empty cells", () => {
    const clipboard = '"uno\tdos"\t"línea 1\nlínea 2"\t"una ""cita"""\r\n\tfin\t\r\n';
    expect(parseSpreadsheetClipboard(clipboard)).toEqual([
      ["uno\tdos", "línea 1\nlínea 2", 'una "cita"'],
      ["", "fin", ""],
    ]);
  });

  it("retains empty trailing fields and accepts a single empty cell", () => {
    expect(parseSpreadsheetClipboard("a\t\t")).toEqual([["a", "", ""]]);
    expect(parseSpreadsheetClipboard("")).toEqual([[""]]);
  });

  it("enforces the column limit including the final field", () => {
    expect(parseSpreadsheetClipboard(Array(512).fill("x").join("\t"))[0]).toHaveLength(512);
    expect(() => parseSpreadsheetClipboard(Array(513).fill("x").join("\t"))).toThrow();
  });
});
