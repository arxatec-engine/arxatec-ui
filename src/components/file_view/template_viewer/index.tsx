import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { StatusMessage } from "@/components/status_message";
import { FileQuestion } from "lucide-react";
import { toast } from "sonner";
import type {
  FileAnnotation,
  FileAnnotationsSchema,
  FileAnnotationsRow,
  FileTemplateViewerApi,
} from "../types/annotations";
import {
  ANNOTATION_DEBOUNCE_MS,
  DEFAULT_ANNOTATION,
  normalizeAnnotationsSchema,
  normalizeFileAnnotation,
} from "./constants";
import { ActiveAnnotationEditorProvider } from "./context/active_annotation_editor_provider";
import { AnnotationDockedToolbar } from "./components/annotation_docked_toolbar";
import { AnnotationToolbar } from "./components/annotation_toolbar";
import { PdfTemplateViewer } from "./components/pdf_template_viewer";
import { TemplateFloatingBar } from "./components/template_floating_bar";
import { AnnotationsSidePanel } from "./components/annotations_side_panel";
import { resolveTemplateFileKind } from "./template_file_kind";
import { downloadFileFromUrl } from "@/utilities/download";

export type FileTemplateViewerHandle = {
  flushSave: () => Promise<void>;
};

export type TemplateViewerHandle = FileTemplateViewerHandle;

interface ContentProps {
  fileId: string;
  mimeType: string;
  fileName?: string;
  api: FileTemplateViewerApi;
}

function emptySchema(): FileAnnotationsSchema {
  return { annotations: [] };
}

function annotationPlainPreview(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 500) || "—";
}

function parseSchema(raw: unknown): FileAnnotationsSchema | null {
  if (raw == null) return emptySchema();
  let candidate: unknown = raw;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate);
    } catch {
      return null;
    }
  }
  if (
    candidate &&
    typeof candidate === "object" &&
    "annotations" in candidate &&
    Array.isArray((candidate as FileAnnotationsSchema).annotations)
  ) {
    return candidate as FileAnnotationsSchema;
  }
  return null;
}

const NEW_TEXT_LABEL_PREFIX = "Nuevo texto ";

function parseNewTextLabelNumber(label: string): number | null {
  const m = label.trim().match(/^nuevo texto\s+(\d+)$/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function buildNewTextLabel(n: number): string {
  return `${NEW_TEXT_LABEL_PREFIX}${n}`;
}

export const FileTemplateViewerContent = forwardRef<
  FileTemplateViewerHandle,
  ContentProps
>(function FileTemplateViewerContent({ fileId, mimeType, fileName, api }, ref) {
  const { supportsTemplateAnnotations, isPdf, isDocx } =
    resolveTemplateFileKind(mimeType, fileName);
  const [schema, setSchema] = useState<FileAnnotationsSchema>(emptySchema);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [fitWidthNextReturnsTo100, setFitWidthNextReturnsTo100] =
    useState(false);
  const [activePage, setActivePage] = useState(1);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [isSaveAsDialogOpen, setIsSaveAsDialogOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
  const [pdfBlobFallbackToRemote, setPdfBlobFallbackToRemote] = useState(false);
  const pdfBlobReadyForFileIdRef = useRef<string | null>(null);
  const pdfBlobFetchGenRef = useRef(0);
  const pdfScrollRef = useRef<HTMLDivElement>(null);
  const pageWidthAtScale1Ref = useRef<number | null>(null);
  const nextNewTextNumberRef = useRef(1);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const {
    data: url,
    isPending: urlPending,
    isError: urlError,
  } = useQuery({
    queryKey: ["file-preview-template", fileId],
    queryFn: async () => api.getFileUrl(fileId),
    enabled: !!fileId && supportsTemplateAnnotations && isPdf,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 45,
  });

  const {
    data: docxPreviewBlob,
    isPending: docxPreviewPending,
    isError: docxPreviewError,
  } = useQuery({
    queryKey: ["file-docx-template-preview-pdf", fileId],
    queryFn: async () => api.getDocxPreviewPdfBlob(fileId),
    enabled: !!fileId && supportsTemplateAnnotations && isDocx,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: row, isPending: rowPending } = useQuery({
    queryKey: ["file-annotations", fileId],
    queryFn: async () => api.getAnnotations(fileId),
    enabled: !!fileId && supportsTemplateAnnotations,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (pdfPageCount <= 0) return;
    setActivePage((p) => Math.min(p, pdfPageCount));
  }, [pdfPageCount]);

  const goRelativePdfPage = useCallback(
    (delta: number) => {
      setActivePage((cur) => {
        const max = pdfPageCount > 0 ? pdfPageCount : 1;
        return Math.min(Math.max(1, cur + delta), max);
      });
    },
    [pdfPageCount],
  );

  useEffect(() => {
    if (!isPdf || !url || !fileId) return;
    if (pdfBlobReadyForFileIdRef.current === fileId) return;

    const gen = ++pdfBlobFetchGenRef.current;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`PDF HTTP ${res.status}`);
        const blob = await res.blob();
        if (cancelled || gen !== pdfBlobFetchGenRef.current) return;
        const next = URL.createObjectURL(blob);
        pdfBlobReadyForFileIdRef.current = fileId;
        setPdfObjectUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return next;
        });
      } catch (e) {
        console.error(e);
        if (!cancelled && gen === pdfBlobFetchGenRef.current) {
          toast.error("No se pudo cargar el PDF para la plantilla");
          setPdfBlobFallbackToRemote(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fileId, isPdf, url]);

  useEffect(() => {
    if (!isDocx || !docxPreviewBlob || !fileId) return;

    pdfBlobReadyForFileIdRef.current = fileId;
    const next = URL.createObjectURL(docxPreviewBlob);
    setPdfBlobFallbackToRemote(false);
    setPdfObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return next;
    });
  }, [fileId, isDocx, docxPreviewBlob]);

  useEffect(() => {
    if (row === undefined) return;
    if (row === null) {
      setSchema(emptySchema());
      return;
    }

    const parsed = parseSchema(row.schema);
    if (parsed === null) return;
    setSchema(normalizeAnnotationsSchema(parsed));
  }, [fileId, row]);

  useEffect(() => {
    const maxExistingNumber = schema.annotations.reduce((acc, ann) => {
      const parsed = parseNewTextLabelNumber(ann.label);
      return parsed ? Math.max(acc, parsed) : acc;
    }, 0);
    nextNewTextNumberRef.current = Math.max(
      nextNewTextNumberRef.current,
      maxExistingNumber + 1,
    );
  }, [schema.annotations]);

  const { mutateAsync: persist } = useMutation({
    mutationFn: async (payload: FileAnnotationsSchema) =>
      api.updateAnnotations(fileId, payload),
    onSuccess: (data: FileAnnotationsRow) => {
      api.onAnnotationsSaved?.(fileId, data);
    },
  });

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const payload = normalizeAnnotationsSchema(schemaRef.current);
      void persist(payload).catch((e: unknown) => {
        console.error(e);
        toast.error("No se pudieron guardar las anotaciones");
      });
    }, ANNOTATION_DEBOUNCE_MS);
  }, [persist, fileId]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const upsertAnnotation = useCallback(
    (next: FileAnnotation) => {
      const existing = schemaRef.current.annotations.find(
        (a) => a.id === next.id,
      );
      const normalized = normalizeFileAnnotation({
        ...next,
        label:
          existing?.label ||
          next.label ||
          annotationPlainPreview(next.content_html),
      });
      setSchema((prev) => ({
        annotations: prev.annotations.map((a) =>
          a.id === normalized.id ? normalized : a,
        ),
      }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (!supportsTemplateAnnotations || !fileId) return;
    await persist(normalizeAnnotationsSchema(schemaRef.current));
  }, [persist, supportsTemplateAnnotations, fileId]);

  useImperativeHandle(ref, () => ({ flushSave }), [flushSave]);

  const addAnnotation = useCallback(() => {
    const id = crypto.randomUUID();
    const page = activePage;
    const w = DEFAULT_ANNOTATION.width;
    const h = DEFAULT_ANNOTATION.height;
    const newTextNumber = nextNewTextNumberRef.current;
    nextNewTextNumberRef.current += 1;
    const newLabel = buildNewTextLabel(newTextNumber);
    const ann = normalizeFileAnnotation({
      id,
      page,
      x: clamp01(0.5 - w / 2),
      y: clamp01(0.35 - h / 2),
      width: w,
      height: h,
      label: newLabel,
      content_html: `<p>${newLabel}</p>`,
      font_family: DEFAULT_ANNOTATION.font_family,
      font_size: DEFAULT_ANNOTATION.font_size,
    });
    setSchema((prev) => ({ annotations: [...prev.annotations, ann] }));
    setSelectedId(id);
    scheduleSave();
  }, [activePage, scheduleSave]);

  const removeAnnotation = useCallback(
    (id: string) => {
      setSchema((prev) => ({
        annotations: prev.annotations.filter((a) => a.id !== id),
      }));
      setSelectedId((cur) => (cur === id ? null : cur));
      scheduleSave();
    },
    [scheduleSave],
  );

  const clearAll = useCallback(() => {
    setSchema(emptySchema());
    setSelectedId(null);
    scheduleSave();
  }, [scheduleSave]);

  const focusAnnotation = useCallback((id: string) => {
    const ann = schemaRef.current.annotations.find((a) => a.id === id);
    if (!ann) return;
    setSelectedId(id);
    setActivePage(ann.page);
  }, []);

  const { mutateAsync: runGenerateAnnotatedPdf, isPending: exporting } =
    useMutation({
      mutationFn: async (name?: string) => {
        await flushSave();
        return api.exportAnnotatedPdf(fileId, name);
      },
      onSuccess: () => {
        api.onDocumentsInvalidate?.();
      },
    });

  const { mutateAsync: runDownloadAnnotatedPdf, isPending: downloadingPdf } =
    useMutation({
      mutationFn: async () => {
        await flushSave();
        const base = (fileName || "documento").replace(/\.pdf$/i, "");
        const suggestedName = `${base} (anotado).pdf`;
        const generated = await api.exportAnnotatedPdf(fileId, suggestedName);
        const downloadUrl = await api.getFileUrl(generated.id);
        const downloadName = generated.name || suggestedName;
        await downloadFileFromUrl(downloadUrl, downloadName);
        try {
          await api.deleteFile(generated.id);
        } catch (e) {
          console.warn(e);
        }
      },
      onSuccess: () => {
        toast.success("PDF con anotaciones descargado");
      },
      onError: (e: Error) => {
        console.error(e);
        toast.error("No se pudo descargar el PDF anotado");
      },
    });

  const openSaveAsDialog = useCallback(() => {
    setSaveAsName(fileName || "documento.pdf");
    setIsSaveAsDialogOpen(true);
  }, [fileName]);

  const handleSaveAsPdf = useCallback(async () => {
    try {
      const finalName = saveAsName.trim();
      if (!finalName) {
        toast.error("Debes ingresar un nombre para guardar el archivo");
        return;
      }
      await runGenerateAnnotatedPdf(finalName);
      api.onDocumentsInvalidate?.();
      setIsSaveAsDialogOpen(false);
      toast.success("PDF anotado guardado correctamente");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo guardar el PDF anotado");
    }
  }, [saveAsName, runGenerateAnnotatedPdf, api]);

  const hasAnnotations = schema.annotations.length > 0;
  const isPdfBusy = exporting || downloadingPdf;

  const handlePageViewportAtScaleOne = useCallback((width: number) => {
    pageWidthAtScale1Ref.current = width;
  }, []);

  const adjustZoomStep = useCallback((delta: number) => {
    setFitWidthNextReturnsTo100(false);
    setScale((s) => Math.min(3, Math.max(0.5, s + delta)));
  }, []);

  const handleFitWidth = useCallback(() => {
    if (fitWidthNextReturnsTo100) {
      setScale(1);
      setFitWidthNextReturnsTo100(false);
      return;
    }
    const el = pdfScrollRef.current;
    const pageW = pageWidthAtScale1Ref.current;
    if (!el || !pageW || pageW <= 0) return;
    const horizontalPadding = 48;
    const available = Math.max(0, el.clientWidth - horizontalPadding);
    const next = Math.min(3, Math.max(0.5, available / pageW));
    setScale(next);
    setFitWidthNextReturnsTo100(true);
  }, [fitWidthNextReturnsTo100]);

  const previewSourcePending =
    (isPdf && urlPending && !url) ||
    (isDocx && docxPreviewPending && docxPreviewBlob === undefined);

  const waitingPdfBlob =
    (isPdf && !!url && !pdfObjectUrl) ||
    (isDocx && !!docxPreviewBlob && !pdfObjectUrl);

  const mainPending =
    previewSourcePending || (rowPending && row === undefined) || waitingPdfBlob;

  const previewFailed =
    (isPdf && (urlError || (!urlPending && url == null))) ||
    (isDocx &&
      (docxPreviewError ||
        (!docxPreviewPending && docxPreviewBlob === undefined)));

  if (!supportsTemplateAnnotations) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <StatusMessage
          color="white"
          title="Formato no disponible para plantilla"
          description="Las anotaciones de plantilla están disponibles para PDF y Word (.docx)."
          icon={FileQuestion}
        />
      </div>
    );
  }

  const canShowViewer =
    !previewFailed &&
    (pdfObjectUrl != null || Boolean(isPdf && pdfBlobFallbackToRemote && url));

  const viewerPdfSrc = pdfObjectUrl ?? url;

  return (
    <ActiveAnnotationEditorProvider>
      <div className="flex h-full min-h-0 w-full flex-col bg-background">
        <AnnotationToolbar
          onInsertText={addAnnotation}
          onSaveAsPdf={openSaveAsDialog}
          isExporting={isPdfBusy}
          hasAnnotations={hasAnnotations}
          hasSelection={!!selectedId}
          activePdfPage={activePage}
          pdfPageCount={pdfPageCount}
          formatToolbar={
            <AnnotationDockedToolbar
              selectedId={selectedId}
              canDelete={!!selectedId}
              onDelete={() => {
                if (selectedId) removeAnnotation(selectedId);
              }}
            />
          }
        />
        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {mainPending && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 text-sm text-muted-foreground">
                Cargando…
              </div>
            )}
            {previewFailed ? (
              <div className="flex h-full items-center justify-center p-6">
                <StatusMessage
                  color="white"
                  title={
                    isDocx
                      ? "No se pudo cargar la vista desde Word"
                      : "No se pudo cargar el PDF"
                  }
                  description={
                    isDocx
                      ? "Vuelve a intentarlo. Si el documento es muy complejo, prueba desde la pestaña Documento."
                      : "Vuelve a intentarlo o descarga el archivo desde la pestaña Documento."
                  }
                  icon={FileQuestion}
                />
              </div>
            ) : canShowViewer && viewerPdfSrc ? (
              <>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  <PdfTemplateViewer
                    documentKey={fileId}
                    url={viewerPdfSrc}
                    pageNumber={activePage}
                    scale={scale}
                    annotations={schema.annotations}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onClearSelection={() => setSelectedId(null)}
                    onChangeAnnotation={upsertAnnotation}
                    onDocumentPagesLoaded={setPdfPageCount}
                    scrollContainerRef={pdfScrollRef}
                    onPageViewportAtScaleOne={handlePageViewportAtScaleOne}
                  />
                </div>
                <TemplateFloatingBar
                  scale={scale}
                  onZoomIn={() => adjustZoomStep(0.2)}
                  onZoomOut={() => adjustZoomStep(-0.2)}
                  pdfPageCount={pdfPageCount}
                  activePdfPage={activePage}
                  onPdfPrevPage={() => goRelativePdfPage(-1)}
                  onPdfNextPage={() => goRelativePdfPage(1)}
                  onFitWidth={handleFitWidth}
                  onDownloadAnnotated={() => void runDownloadAnnotatedPdf()}
                  isBusy={isPdfBusy}
                  hasAnnotations={hasAnnotations}
                />
              </>
            ) : null}
          </div>
          <AnnotationsSidePanel
            annotations={schema.annotations}
            selectedId={selectedId}
            onFocusAnnotation={focusAnnotation}
            onUpdateAnnotation={upsertAnnotation}
            onDelete={removeAnnotation}
            onClearAll={clearAll}
          />
        </div>
      </div>
      <Dialog open={isSaveAsDialogOpen} onOpenChange={setIsSaveAsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Guardar como</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-2 block">Nombre del archivo</Label>
            <Input
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              placeholder="Nombre del PDF..."
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && void handleSaveAsPdf()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveAsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => void handleSaveAsPdf()} disabled={isPdfBusy}>
              {exporting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ActiveAnnotationEditorProvider>
  );
});

type FileTemplateViewerProps = ContentProps;

export const FileTemplateViewer = forwardRef<
  FileTemplateViewerHandle,
  FileTemplateViewerProps
>(function FileTemplateViewer(props, ref) {
  return <FileTemplateViewerContent key={props.fileId} ref={ref} {...props} />;
});

export const TemplateViewer = FileTemplateViewer;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}
