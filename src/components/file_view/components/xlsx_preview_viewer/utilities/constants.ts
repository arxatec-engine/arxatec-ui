export const SPREADSHEET_LIMITS = {
  inputBytes: 20 * 1024 * 1024,
  convertedBytes: 40 * 1024 * 1024,
  cells: 500_000,
  clipboardCells: 500_000,
  timeoutMs: 30_000,
} as const;
