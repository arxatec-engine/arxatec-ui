import { parseSpreadsheet } from "./workbook";
import type {
  SpreadsheetWorkerRequest,
  SpreadsheetWorkerResult,
} from "../types";

self.onmessage = async (event: MessageEvent<SpreadsheetWorkerRequest>) => {
  let result: SpreadsheetWorkerResult;
  try {
    result = {
      workbook: await parseSpreadsheet(
        event.data.buffer,
        event.data.format,
        event.data.editable,
      ),
    };
  } catch (cause) {
    result = {
      error:
        cause instanceof Error ? cause.message : "No se pudo leer el libro.",
    };
  }
  self.postMessage(result);
};
