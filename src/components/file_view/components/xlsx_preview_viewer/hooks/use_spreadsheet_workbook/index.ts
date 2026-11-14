import { useEffect, useMemo, useRef, useState } from "react";

import { getFileNameFromUrl } from "../../../../utilities/get_extension_from_url";
import {
  resolveSpreadsheetFormat,
  XLS_MIME,
} from "../../../../utilities/spreadsheet_format";
import { readWorkbook } from "../../utilities/read_workbook";
import { SPREADSHEET_LIMITS } from "../../utilities/constants";
import type {
  FileXlsxPreviewViewerProps,
  SpreadsheetWorkbook,
} from "../../types";

export const useSpreadsheetWorkbook = ({
  file,
  url,
  fileName,
  mimeType,
  convertToXlsx,
  isPending = false,
  isError = false,
  onError,
}: FileXlsxPreviewViewerProps) => {
  const [attempt, setAttempt] = useState(0);
  const displayName =
    fileName || file?.name || (url ? getFileNameFromUrl(url) : "Libro.xlsx");
  const source = file ?? url;
  const callbacksRef = useRef({ convertToXlsx, onError });
  useEffect(() => {
    callbacksRef.current = { convertToXlsx, onError };
  }, [convertToXlsx, onError]);
  const request = useMemo(
    () => ({ source }),
    [source, displayName, mimeType, isPending, isError, attempt],
  );
  const [result, setResult] = useState<{
    request: typeof request;
    workbook?: SpreadsheetWorkbook;
    error?: Error;
  } | null>(null);
  const settled = result?.request === request;
  const error = isError || (settled && result.error) || (!source && !isPending);
  const loading = !error && (isPending || !settled);
  const workbook = settled ? result.workbook : undefined;

  useEffect(() => {
    if (!source || isPending || isError) return;
    const controller = new AbortController();
    const { signal } = controller;
    const converter = callbacksRef.current.convertToXlsx;
    const load = async () => {
      let original = file;
      if (!original) {
        const response = await fetch(url!, { signal });
        if (!response.ok)
          throw new Error(
            `No se pudo descargar el libro (HTTP ${response.status}).`,
          );
        const contentLength = Number(response.headers.get("content-length"));
        if (contentLength > SPREADSHEET_LIMITS.inputBytes)
          throw new Error("El libro supera los 20 MiB de la vista previa.");
        original = new File([await response.blob()], displayName, {
          type: mimeType || response.headers.get("content-type") || "",
        });
      }
      if (signal.aborted) return;
      if (!original.size || original.size > SPREADSHEET_LIMITS.inputBytes)
        throw new Error(
          "El libro está vacío o supera los 20 MiB de la vista previa.",
        );
      let format =
        resolveSpreadsheetFormat(displayName, mimeType || original.type) ??
        "xlsx";
      let document: Blob = original;
      if (format === "xls" && converter) {
        const conversionFile = original.name.toLowerCase().endsWith(".xls")
          ? original
          : new File([original], `${displayName}.xls`, { type: XLS_MIME });
        document = await converter(conversionFile, { signal });
        format = "xlsx";
      }
      if (signal.aborted) return;
      if (!document.size || document.size > SPREADSHEET_LIMITS.convertedBytes)
        throw new Error(
          "El libro convertido está vacío o supera el tamaño permitido.",
        );
      const buffer = await document.arrayBuffer();
      if (signal.aborted) return;
      const parsed = await readWorkbook(buffer, format, signal);
      if (!signal.aborted) {
        setResult({ request, workbook: parsed });
      }
    };
    void load().catch((cause: unknown) => {
      if (signal.aborted) return;
      const failure =
        cause instanceof Error
          ? cause
          : new Error("No se pudo abrir el libro.");
      setResult({ request, error: failure });
      callbacksRef.current.onError?.(failure);
    });
    return () => {
      controller.abort();
    };
  }, [request, source, file, url, displayName, mimeType, isPending, isError]);

  return {
    displayName,
    source,
    error,
    loading,
    workbook,
    retry: () => setAttempt((value) => value + 1),
  };
};
