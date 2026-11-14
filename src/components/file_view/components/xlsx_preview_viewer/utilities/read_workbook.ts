import type { SpreadsheetWorkerResult, SpreadsheetWorkbook } from "../types";
import { SPREADSHEET_LIMITS } from "./constants";

export async function readWorkbook(
  buffer: ArrayBuffer,
  format: "xls" | "xlsx",
  signal: AbortSignal,
): Promise<SpreadsheetWorkbook> {
  if (signal.aborted)
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  const { default: SpreadsheetWorker } =
    await import("./preview.worker?worker&inline");
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  return new Promise((resolve, reject) => {
    const worker = new SpreadsheetWorker();
    const cleanup = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      worker.onmessage = null;
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
    };
    const fail = (error: Error) => {
      cleanup();
      reject(error);
    };
    const abort = () => fail(new DOMException("Aborted", "AbortError"));
    const timeout = setTimeout(
      () =>
        fail(
          new Error(
            "El libro tardó demasiado en abrirse. Descarga el original o vuelve a intentarlo.",
          ),
        ),
      SPREADSHEET_LIMITS.timeoutMs,
    );
    signal.addEventListener("abort", abort, { once: true });
    worker.onmessage = (event: MessageEvent<SpreadsheetWorkerResult>) => {
      cleanup();
      if (event.data.workbook) resolve(event.data.workbook);
      else reject(new Error(event.data.error));
    };
    worker.onerror = () =>
      fail(new Error("No se pudo iniciar la lectura del libro."));
    worker.onmessageerror = () =>
      fail(new Error("No se pudo recibir el contenido del libro."));
    try {
      worker.postMessage({ buffer, format }, [buffer]);
    } catch (cause) {
      fail(
        cause instanceof Error
          ? cause
          : new Error("No se pudo iniciar la lectura del libro."),
      );
    }
  });
}
