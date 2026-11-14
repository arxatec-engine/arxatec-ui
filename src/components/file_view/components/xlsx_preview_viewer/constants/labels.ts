import type { FileXlsxPreviewViewerLabels } from "../types";

export const SPREADSHEET_LABELS: FileXlsxPreviewViewerLabels = {
  toolbar: "Controles del visor de Excel",
  errorTitle: "No se pudo abrir el libro",
  errorDescription: "Vuelve a intentarlo o descarga el archivo original.",
  retry: "Reintentar",
  download: "Descargar original",
  basicView:
    "Vista básica del formato XLS. La descarga conserva el formato original.",
  emptyTitle: "No hay hojas visibles",
  emptyDescription: "El libro no contiene hojas visibles para previsualizar.",
  sheets: "Hojas del libro",
  zoomOut: "Reducir zoom",
  zoomIn: "Aumentar zoom",
  copy: "Copiar selección",
  copyShortcut: "Copiar selección (Ctrl/Cmd+C)",
  copied: "Copiado",
  copyError: "No se pudo copiar la selección.",
  missingResult: "Resultado no guardado en el archivo",
  selectionHelp:
    "Selecciona con el ratón o las flechas. Usa Shift para ampliar y Ctrl/Cmd+C para copiar.",
};
