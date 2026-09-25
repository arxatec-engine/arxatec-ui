import { pdfjs } from "react-pdf";

export function setupPdfWorker(): void {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

setupPdfWorker();
