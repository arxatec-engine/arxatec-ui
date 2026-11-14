import { useEffect, useMemo, useRef, useState } from "react";
import { renderAsync } from "docx-preview";

import { getFileNameFromUrl } from "../../../../utilities/get_extension_from_url";
import { resolveWordDocumentFormat } from "../../../../utilities/word_document_format";
import { DOCUMENT_STYLES } from "../../constants/document_styles";
import type { FileDocxPreviewViewerProps } from "../../types";

export const useWordDocument = ({
  file,
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  convertToDocx,
  onError,
}: FileDocxPreviewViewerProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const errorHandlerRef = useRef(onError);
  const converterRef = useRef(convertToDocx);
  const source = file ?? url;
  const [attempt, setAttempt] = useState(0);
  const displayName =
    fileName ||
    file?.name ||
    (url ? getFileNameFromUrl(url) : "documento.docx");
  const request = useMemo(
    () => ({ source }),
    [source, displayName, mimeType, isPending, isError, attempt],
  );
  const [result, setResult] = useState<{
    request: typeof request;
    error: boolean;
  } | null>(null);
  const settled = result?.request === request;
  const error = isError || (settled && result.error) || (!source && !isPending);
  const loading = !error && (isPending || !settled);

  useEffect(() => {
    errorHandlerRef.current = onError;
    converterRef.current = convertToDocx;
  }, [onError, convertToDocx]);

  useEffect(() => {
    if (!hostRef.current || !source || isPending || isError) return;
    const controller = new AbortController();
    const { signal } = controller;
    const converter = converterRef.current;
    const host = hostRef.current;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const content = document.createElement("div");
    const styles = document.createElement("style");
    styles.textContent = DOCUMENT_STYLES;

    const render = async () => {
      let documentFile = file;
      if (!documentFile) {
        const response = await fetch(url!, { signal });
        if (!response.ok)
          throw new Error(`Document download failed: HTTP ${response.status}`);
        const blob = await response.blob();
        documentFile = new File([blob], displayName, {
          type: mimeType || blob.type,
        });
      }
      if (signal.aborted) return;
      const format = resolveWordDocumentFormat(
        displayName,
        mimeType || documentFile.type,
      );
      let documentBlob: Blob = documentFile;
      if (format === "doc" || format === "odt") {
        if (!converter)
          throw new Error("A DOC/ODT to DOCX converter is required");
        const conversionFile = documentFile.name
          .toLowerCase()
          .endsWith(`.${format}`)
          ? documentFile
          : new File([documentFile], `${displayName}.${format}`, {
              type: documentFile.type,
            });
        documentBlob = await converter(conversionFile, { signal });
      }
      if (signal.aborted) return;
      if (documentBlob.size === 0) throw new Error("The document is empty");
      await renderAsync(documentBlob, content, undefined, {
        className: "docx-preview-container",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false,
        useBase64URL: true,
        renderAltChunks: false,
      });
      if (signal.aborted) return;
      for (const link of content.querySelectorAll("a[href]")) {
        const href = link.getAttribute("href") ?? "";
        if (!/^(https?:|mailto:|tel:|#)/i.test(href))
          link.removeAttribute("href");
        link.setAttribute("rel", "noopener noreferrer");
        if (href.startsWith("#")) {
          link.addEventListener("click", (event) => {
            event.preventDefault();
            let id = href.slice(1);
            try {
              id = decodeURIComponent(id);
            } catch {
              return;
            }
            const target = Array.from(
              content.querySelectorAll<HTMLElement>("[id]"),
            ).find((node) => node.id === id);
            target?.scrollIntoView({ block: "start" });
          });
        }
      }
      shadow.replaceChildren(content, styles);
      await document.fonts?.ready;
      await Promise.all(
        Array.from(content.querySelectorAll("img"), (image) =>
          image.decode?.().catch(() => undefined),
        ),
      );
      if (!signal.aborted) setResult({ request, error: false });
    };

    void render().catch((cause: unknown) => {
      if (signal.aborted) return;
      setResult({ request, error: true });
      errorHandlerRef.current?.(
        cause instanceof Error ? cause : new Error("Document rendering failed"),
      );
    });

    return () => {
      controller.abort();
      if (shadow.contains(content)) shadow.replaceChildren();
    };
  }, [request, file, url, source, displayName, mimeType, isPending, isError]);

  return {
    hostRef,
    source,
    loading,
    error,
    displayName,
    attempt,
    retry: () => setAttempt((value) => value + 1),
  };
};
