import type { SpreadsheetEdit } from "../types/editing";
import { writeSpreadsheet } from "./editing/write";

self.onmessage = async (
  event: MessageEvent<{ buffer: ArrayBuffer; edits: SpreadsheetEdit[] }>,
) => {
  try {
    const bytes = await writeSpreadsheet(event.data.buffer, event.data.edits);
    self.postMessage({ buffer: bytes.buffer }, { transfer: [bytes.buffer] });
  } catch (cause) {
    self.postMessage({
      error:
        cause instanceof Error ? cause.message : "SPREADSHEET_EXPORT_FAILED",
    });
  }
};
