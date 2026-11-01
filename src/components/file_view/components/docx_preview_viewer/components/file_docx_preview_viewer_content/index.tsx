import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { FileX } from "lucide-react";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";
import { useFileViewLoadingChange } from "../../../../hooks";
import { downloadFromUrl } from "../../../../utilities/download_from_url";
import { getFileNameFromUrl } from "../../../../utilities/get_extension_from_url";
import { resolveWordDocumentFormat } from "../../../../utilities/word_document_format";
import { FileViewLoadingState } from "../../../loading_state";
import { Toolbar } from "../toolbar";
import type { FileDocxPreviewViewerProps } from "../../types";

const DOCUMENT_STYLES = `
  :host { display: block; width: max-content; color: #111827; font-family: Arial, sans-serif; line-height: normal; text-align: left; }
  .docx-preview-container-wrapper { background: transparent; padding: 16px; }
  .docx-preview-container-wrapper > section.docx-preview-container { box-shadow: var(--shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05)); }
`;

export const FileDocxPreviewViewerContent = ({
  file,
  url,
  fileName,
  mimeType,
  isPending = false,
  isError = false,
  convertToDocx,
  loadingOverlay,
  onDownload,
  onError,
  onLoadingChange,
}: FileDocxPreviewViewerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
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
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    viewport: 0,
  });
  const settled = result?.request === request;
  const error = isError || (settled && result.error) || (!source && !isPending);
  const loading = !error && (isPending || !settled);
  const fit =
    dimensions.width > 0 && dimensions.viewport > 0
      ? Math.min(1, dimensions.viewport / dimensions.width)
      : 1;
  const scale = fit * zoom;
  useFileViewLoadingChange(loading, onLoadingChange);

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

  useEffect(() => {
    const viewport = viewportRef.current;
    const host = hostRef.current;
    if (!viewport || !host || loading || error) return;
    const measure = () =>
      setDimensions({
        width: host.offsetWidth,
        height: host.offsetHeight,
        viewport: viewport.clientWidth,
      });
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(host);
    measure();
    return () => observer.disconnect();
  }, [loading, error, source, attempt]);

  const download = useCallback(() => {
    if (onDownload) return onDownload();
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      void downloadFromUrl(objectUrl, displayName).finally(() =>
        URL.revokeObjectURL(objectUrl),
      );
    } else if (url) {
      void downloadFromUrl(url, displayName).catch(() =>
        errorHandlerRef.current?.(new Error("Document download failed")),
      );
    }
  }, [onDownload, file, url, displayName]);

  return (
    <div
      className="relative h-full min-h-0 w-full bg-background"
      aria-busy={loading}
    >
      <div
        ref={viewportRef}
        className="h-full w-full overflow-auto pb-16"
        style={{ visibility: loading || error ? "hidden" : undefined }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: dimensions.width ? dimensions.width * scale : "max-content",
            height: dimensions.height ? dimensions.height * scale : undefined,
          }}
        >
          <div
            ref={hostRef}
            data-document-preview="docx"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 bg-background">
          {loadingOverlay ?? <FileViewLoadingState />}
        </div>
      )}
      {error && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background p-6"
          role="alert"
        >
          <StatusMessage
            title="No se pudo abrir el documento"
            description="Vuelve a intentarlo o descarga el archivo original."
            icon={FileX}
            classNameCard="flex-col items-center text-center"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAttempt((value) => value + 1)}
              disabled={isPending || isError || !source}
            >
              Reintentar
            </Button>
            <Button variant="outline" onClick={download} disabled={!source}>
              Descargar original
            </Button>
          </div>
        </div>
      )}
      {!loading && !error && (
        <Toolbar
          scale={zoom}
          onZoomIn={() => setZoom((value) => Math.min(value + 0.2, 3))}
          onZoomOut={() => setZoom((value) => Math.max(value - 0.2, 0.5))}
          onDownload={download}
        />
      )}
    </div>
  );
};
