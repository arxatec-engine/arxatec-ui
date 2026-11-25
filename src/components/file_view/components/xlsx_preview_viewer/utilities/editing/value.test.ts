import { describe, expect, it } from "vitest";

import { parseSpreadsheetInput, spreadsheetInput, spreadsheetText } from "./value";

describe("spreadsheet cell input", () => {
  it.each([
    ["", null],
    ["0", 0],
    ["-12.5", -12.5],
    ["1e3", 1000],
    ["false", false],
    ["TRUE", true],
    ["00012", "00012"],
    ["'0012", "0012"],
    ["'=A1+1", "=A1+1"],
    ["2026-02-30", "2026-02-30"],
  ])("parses %j without losing its intended type", (input, value) => {
    expect(parseSpreadsheetInput(input)).toMatchObject({ value });
  });

  it("retains a formula as an expression awaiting calculation", () => {
    const parsed = parseSpreadsheetInput("=SUM(A1:B2)");
    expect(parsed).toMatchObject({
      formula: "SUM(A1:B2)",
      missingResult: true,
      value: null,
    });
    const cell = { ...parsed, text: "", style: {} };
    expect(spreadsheetInput(cell)).toBe("=SUM(A1:B2)");
    expect(spreadsheetText(cell)).toBe("=SUM(A1:B2)");
    expect(() => parseSpreadsheetInput("=")).toThrow();
  });

  it("exposes a date as editable ISO input and formats its display", () => {
    const parsed = parseSpreadsheetInput("2026-11-12");
    expect(parsed).toMatchObject({
      value: "2026-11-12T00:00:00.000Z",
      valueKind: "date",
    });
    const cell = { ...parsed, text: "", style: {}, format: { numberFormat: "dd/mm/yyyy" } };
    expect(spreadsheetInput(cell)).toBe("2026-11-12");
    expect(spreadsheetText(cell)).toBe("12/11/2026");
  });

  it("keeps zero and false visible when entering or displaying a cell", () => {
    expect(spreadsheetInput({ value: 0, text: "0", style: {} })).toBe("0");
    expect(spreadsheetInput({ value: false, text: "FALSE", style: {} })).toBe("false");
    expect(spreadsheetText({ value: 0, text: "", style: {} })).toBe("0");
    expect(spreadsheetText({ value: false, text: "", style: {} })).toBe("FALSE");
  });

  it.each([
    ["'=A1+1", "1", "=A1+11"],
    ["'fals", "e", "false"],
    ["'12", "3", "123"],
    ["'2026-11-1", "2", "2026-11-12"],
  ])(
    "keeps explicit text %j as text when the editor appends %j",
    (input, appended, expected) => {
      const parsed = parseSpreadsheetInput(input);
      const reopened = spreadsheetInput({ ...parsed, text: String(parsed.value), style: {} });
      expect(parseSpreadsheetInput(reopened + appended)).toEqual({ value: expected });
    },
  );

  it("rejects values beyond Excel's text and formula limits", () => {
    expect(() => parseSpreadsheetInput("x".repeat(32768))).toThrow();
    expect(() => parseSpreadsheetInput(`=${"A".repeat(8193)}`)).toThrow();
  });
});
