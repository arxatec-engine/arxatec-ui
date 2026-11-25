import type { SpreadsheetEdit } from "../../types/editing";
import { SPREADSHEET_LIMITS } from "../constants";

export async function serializeSpreadsheet(
  buffer: ArrayBuffer,
  edits: SpreadsheetEdit[],
  signal: AbortSignal,
): Promise<Uint8Array<ArrayBuffer>> {
  signal.throwIfAborted();
  const { default: SpreadsheetEditWorker } =
    await import("../edit.worker?worker&inline");
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const worker = new SpreadsheetEditWorker();
    const cleanup = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      worker.terminate();
    };
    const fail = (error: unknown) => {
      cleanup();
      reject(error);
    };
    const abort = () => fail(signal.reason);
    const timeout = setTimeout(
      () => fail(new Error("SPREADSHEET_EXPORT_TIMEOUT")),
      SPREADSHEET_LIMITS.timeoutMs,
    );
    signal.addEventListener("abort", abort, { once: true });
    worker.onmessage = (
      event: MessageEvent<{ buffer?: ArrayBuffer; error?: string }>,
    ) => {
      cleanup();
      if (event.data.buffer instanceof ArrayBuffer)
        resolve(new Uint8Array(event.data.buffer));
      else reject(new Error(event.data.error || "SPREADSHEET_EXPORT_FAILED"));
    };
    worker.onerror = () => fail(new Error("SPREADSHEET_EXPORT_FAILED"));
    worker.onmessageerror = () => fail(new Error("SPREADSHEET_EXPORT_FAILED"));
    try {
      worker.postMessage({ buffer, edits }, [buffer]);
    } catch (error) {
      fail(error);
    }
  });
}
