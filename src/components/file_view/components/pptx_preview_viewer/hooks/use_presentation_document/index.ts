import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getFileNameFromUrl } from "../../../../utilities/get_extension_from_url";
import {
  loadPresentationFonts,
  readPresentation,
  readPresentationBlob,
  type Presentation,
} from "../../utilities/presentation";
import type { FilePptxPreviewViewerProps } from "../../types";

export const usePresentationDocument = ({
  file,
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  onError,
}: FilePptxPreviewViewerProps) => {
  const displayName =
    fileName ||
    file?.name ||
    (url ? getFileNameFromUrl(url) : "presentacion.pptx");
  const [attempt, setAttempt] = useState(0);
  const request = useMemo(
    () => ({ file, url }),
    [file, url, displayName, mimeType, isPending, isError, attempt],
  );
  const [result, setResult] = useState<{
    request: typeof request;
    presentation?: Presentation;
    error?: Error;
  } | null>(null);
  const [painted, setPainted] = useState<Presentation | null>(null);
  const errorCallback = useRef(onError);
  useEffect(() => {
    errorCallback.current = onError;
  }, [onError]);
  const settled = result?.request === request;
  const presentation = settled ? result.presentation : undefined;
  const error =
    isError || (settled && result.error) || (!file && !url && !isPending);
  const loading =
    !error && (isPending || !presentation || painted !== presentation);

  const fail = useCallback(
    (cause: unknown) => {
      const error =
        cause instanceof Error
          ? cause
          : new Error("No se pudo abrir la presentación.");
      setResult({ request, error });
      errorCallback.current?.(error);
    },
    [request],
  );

  useEffect(() => {
    if ((!file && !url) || isPending || isError) return;
    const controller = new AbortController();
    const { signal } = controller;
    let document: Presentation | undefined;
    let disposeFonts: (() => void) | undefined;
    const open = async () => {
      let bytes: ArrayBuffer;
      if (file) bytes = await readPresentationBlob(file, signal);
      else {
        const response = await fetch(url!, { signal });
        if (!response.ok)
          throw new Error(
            `No se pudo descargar la presentación: HTTP ${response.status}.`,
          );
        bytes = await response.arrayBuffer();
      }
      document = await readPresentation(bytes, signal);
      disposeFonts = await loadPresentationFonts(document, signal);
      signal.throwIfAborted();
      setResult({ request, presentation: document });
    };
    void open().catch((cause: unknown) => {
      disposeFonts?.();
      document?.dispose?.();
      if (!signal.aborted) fail(cause);
    });
    return () => {
      controller.abort();
      disposeFonts?.();
      document?.dispose?.();
    };
  }, [request, file, url, isPending, isError, fail]);

  return {
    displayName,
    presentation,
    error,
    loading,
    fail,
    setPainted,
    retry: () => setAttempt((value) => value + 1),
  };
};
