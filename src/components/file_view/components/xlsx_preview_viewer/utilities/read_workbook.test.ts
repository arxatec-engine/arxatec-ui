import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SpreadsheetWorkerResult, SpreadsheetWorkbook } from "../types";
import { readWorkbook } from "./read_workbook";
import { SPREADSHEET_LIMITS } from "./constants";

const workerMock = vi.hoisted(() => {
  class SpreadsheetWorker {
    onmessage: ((event: { data: SpreadsheetWorkerResult }) => void) | null =
      null;
    onerror: (() => void) | null = null;
    onmessageerror: (() => void) | null = null;
    postMessage = vi.fn();
    terminate = vi.fn();
    constructor() {
      instances.push(this);
    }
  }
  const instances: SpreadsheetWorker[] = [];
  return { SpreadsheetWorker, instances };
});

vi.mock("./preview.worker?worker&inline", () => ({
  default: workerMock.SpreadsheetWorker,
}));

const workbook: SpreadsheetWorkbook = { sheets: [], basic: false };
const startedWorker = async () => {
  await vi.waitFor(() => expect(workerMock.instances).toHaveLength(1));
  return workerMock.instances[0];
};

describe("spreadsheet worker lifecycle", () => {
  beforeEach(() => {
    workerMock.instances.length = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("transfers the original buffer and terminates after receiving the workbook", async () => {
    const buffer = new ArrayBuffer(4);
    const pending = readWorkbook(buffer, "xlsx", new AbortController().signal);
    const worker = await startedWorker();
    expect(worker.postMessage).toHaveBeenCalledWith(
      { buffer, format: "xlsx" },
      [buffer],
    );
    worker.onmessage?.({ data: { workbook } });
    await expect(pending).resolves.toBe(workbook);
    expect(worker.terminate).toHaveBeenCalledOnce();
    expect(worker.onmessage).toBeNull();
  });

  it("does not start a worker for an already cancelled request", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      readWorkbook(new ArrayBuffer(4), "xlsx", controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(workerMock.instances).toHaveLength(0);
  });

  it("terminates when the preview is cancelled", async () => {
    const controller = new AbortController();
    const pending = readWorkbook(new ArrayBuffer(4), "xls", controller.signal);
    const rejection = expect(pending).rejects.toMatchObject({
      name: "AbortError",
    });
    const worker = await startedWorker();
    controller.abort();
    await rejection;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it("reports parser errors and releases the worker", async () => {
    const pending = readWorkbook(
      new ArrayBuffer(4),
      "xlsx",
      new AbortController().signal,
    );
    const rejection = expect(pending).rejects.toThrow("Archivo inválido");
    const worker = await startedWorker();
    worker.onmessage?.({ data: { error: "Archivo inválido" } });
    await rejection;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it.each(["onerror", "onmessageerror"] as const)(
    "releases the worker after %s",
    async (handler) => {
      const pending = readWorkbook(
        new ArrayBuffer(4),
        "xlsx",
        new AbortController().signal,
      );
      const rejection = expect(pending).rejects.toThrow();
      const worker = await startedWorker();
      worker[handler]?.();
      await rejection;
      expect(worker.terminate).toHaveBeenCalledOnce();
    },
  );

  it("terminates work that exceeds the preview time limit", async () => {
    vi.useFakeTimers();
    const pending = readWorkbook(
      new ArrayBuffer(4),
      "xlsx",
      new AbortController().signal,
    );
    const rejection = expect(pending).rejects.toThrow("tardó demasiado");
    const worker = await startedWorker();
    await vi.advanceTimersByTimeAsync(SPREADSHEET_LIMITS.timeoutMs);
    await rejection;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
});
