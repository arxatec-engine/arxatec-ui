import { format as formatNumber } from "ssf";

import type { SpreadsheetCell } from "../../types";

export function spreadsheetInput(cell?: SpreadsheetCell): string {
  if (cell?.formula) return `=${cell.formula}`;
  if (cell?.valueKind === "date") return String(cell.value ?? "").slice(0, 10);
  const value = cell?.value == null ? (cell?.text ?? "") : String(cell.value);
  if (typeof cell?.value === "string" && value) return `'${value}`;
  return value;
}

export function parseSpreadsheetInput(
  input: string,
): Pick<SpreadsheetCell, "value" | "valueKind" | "formula" | "missingResult"> {
  if (input.length > 32767) throw new Error("SPREADSHEET_CELL_TOO_LONG");
  if (input.startsWith("=")) {
    if (input.length === 1 || input.length > 8193)
      throw new Error("SPREADSHEET_FORMULA_INVALID");
    return { value: null, formula: input.slice(1), missingResult: true };
  }
  if (input.startsWith("'")) return { value: input.slice(1) };
  if (!input) return { value: null };
  if (/^(true|false)$/i.test(input))
    return { value: input.toLowerCase() === "true" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const date = new Date(`${input}T00:00:00Z`);
    if (Number.isFinite(date.getTime()) && date.toISOString().startsWith(input))
      return { value: date.toISOString(), valueKind: "date" };
  }
  if (
    /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(input) &&
    Number.isFinite(Number(input))
  )
    return { value: Number(input) };
  if (input.length > 32767) throw new Error("SPREADSHEET_CELL_TOO_LONG");
  return { value: input };
}

export function spreadsheetText(cell: SpreadsheetCell): string {
  if (cell.formula) return cell.missingResult ? `=${cell.formula}` : cell.text;
  const value = cell.value;
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  try {
    if (cell.valueKind === "date") {
      const serial = new Date(String(value)).getTime() / 86_400_000 + 25569;
      return formatNumber(cell.format?.numberFormat || "yyyy-mm-dd", serial);
    }
    return typeof value === "number"
      ? formatNumber(cell.format?.numberFormat || "General", value)
      : String(value);
  } catch {
    return String(value);
  }
}
