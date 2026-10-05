import { pdfjs } from "react-pdf";
import {
  getFileViewPdfWorker,
  onFileViewPdfWorkerConfigured,
} from "../pdf_worker_configuration";

export function setupPdfWorker(): void {
  pdfjs.GlobalWorkerOptions.workerSrc =
    getFileViewPdfWorker() ??
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

onFileViewPdfWorkerConfigured((source) => {
  pdfjs.GlobalWorkerOptions.workerSrc = source;
});
setupPdfWorker();
