let workerSource: string | undefined;
const listeners = new Set<(source: string) => void>();

export function configureFileViewPdfWorker(workerSrc: string): void {
  if (!workerSrc.trim()) throw new Error("PDF worker source must not be empty");
  workerSource = workerSrc;
  for (const listener of listeners) listener(workerSrc);
}

export const getFileViewPdfWorker = () => workerSource;
export function onFileViewPdfWorkerConfigured(
  listener: (source: string) => void,
): void {
  listeners.add(listener);
  if (workerSource) listener(workerSource);
}
