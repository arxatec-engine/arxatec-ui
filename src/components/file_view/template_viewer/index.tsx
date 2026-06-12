import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ChangeEvent } from "react";
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
import { FileQuestion, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type {
  FileAnnotation,
  FileAnnotationsSchema,
  FileAnnotationsRow,
  FileTemplateViewerApi,
  ImageAnnotation,
  TemplateAnnotation,
} from "../types/annotations";
import {
  TEMPLATE_ANNOTATION_TYPES,
  isImageAnnotation,
  isTextAnnotation,
} from "../types/annotations";
import {
  ANNOTATION_DEBOUNCE_MS,
  ANNOTATION_MIN_HEIGHT,
  ANNOTATION_MIN_WIDTH,
  DEFAULT_ANNOTATION,
  normalizeFileAnnotation,
} from "./constants";
import {
  normalizeAnnotationsSchema,
  parseAndNormalizeAnnotationsSchema,
  normalizeTemplateAnnotation,
  estimateAnnotationTextBoxNorm,
  type ShapeDrawTool,
  isShapeToolbarAnnotation,
  buildShapeLabel,
  syncShapeLabelCounters,
  resolveTemplateFileKind,
} from "./utilities";
import { ActiveAnnotationEditorProvider } from "./context/active_annotation_editor_provider";
import { useActiveAnnotationEditor } from "./context/use_active_annotation_editor";
import { AnnotationDockedToolbar } from "./components/annotation_docked_toolbar";
import { AnnotationShapeToolbar } from "./components/annotation_shape_toolbar";
import { AnnotationToolbar } from "./components/annotation_toolbar";
import { PdfTemplateViewer } from "./components/pdf_template_viewer";
import { TemplateFloatingBar } from "./components/template_floating_bar";
import { AnnotationsSidePanel } from "./components/annotations_side_panel";
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
  enabled?: boolean;
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
  return parseAndNormalizeAnnotationsSchema(raw);
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
>(function FileTemplateViewerContent(props, ref) {
  return (
    <ActiveAnnotationEditorProvider>
      <FileTemplateViewerInner ref={ref} {...props} />
    </ActiveAnnotationEditorProvider>
  );
});

const FileTemplateViewerInner = forwardRef<
  FileTemplateViewerHandle,
  ContentProps
>(function FileTemplateViewerInner(
  { fileId, mimeType, fileName, api, enabled = true },
  ref,
) {
  const { prepareSchemaForPersist } = useActiveAnnotationEditor();
  const { supportsTemplateAnnotations, isPdf, isDocx } =
    resolveTemplateFileKind(mimeType, fileName);
  const [schema, setSchema] = useState<FileAnnotationsSchema>(emptySchema);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shapeDrawTool, setShapeDrawTool] = useState<ShapeDrawTool | null>(
    null,
  );
  const [annotationAssetUrls, setAnnotationAssetUrls] = useState<
    Record<string, string>
  >({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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
  const pageHeightAtScale1Ref = useRef<number | null>(null);
  const [pageViewportAtScaleOne, setPageViewportAtScaleOne] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const nextNewTextNumberRef = useRef(1);
  const nextShapeNumbersRef = useRef<Record<ShapeDrawTool, number>>({
    line: 1,
    rect: 1,
    ellipse: 1,
  });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const {
    data: url,
    isPending: urlPending,
    isError: urlError,
  } = useQuery({
    queryKey: ["file-preview-template", fileId],
    queryFn: async () => api.getFileUrl(fileId),
    enabled: !!fileId && supportsTemplateAnnotations && isPdf && enabled,
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
    enabled: !!fileId && supportsTemplateAnnotations && isDocx && enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: row, isPending: rowPending } = useQuery({
    queryKey: ["file-annotations", fileId],
    queryFn: async () => api.getAnnotations(fileId),
    enabled: !!fileId && supportsTemplateAnnotations && enabled,
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
      if (!isTextAnnotation(ann)) return acc;
      const parsed = parseNewTextLabelNumber(ann.label);
      return parsed ? Math.max(acc, parsed) : acc;
    }, 0);
    nextNewTextNumberRef.current = Math.max(
      nextNewTextNumberRef.current,
      maxExistingNumber + 1,
    );
    const shapeNext = syncShapeLabelCounters(schema.annotations);
    nextShapeNumbersRef.current = {
      line: Math.max(nextShapeNumbersRef.current.line, shapeNext.line),
      rect: Math.max(nextShapeNumbersRef.current.rect, shapeNext.rect),
      ellipse: Math.max(nextShapeNumbersRef.current.ellipse, shapeNext.ellipse),
    };
  }, [schema.annotations]);

  const createShapeLabel = useCallback((kind: ShapeDrawTool) => {
    const n = nextShapeNumbersRef.current[kind];
    nextShapeNumbersRef.current[kind] = n + 1;
    return buildShapeLabel(kind, n);
  }, []);

  const resolveAnnotationAssetUrl = useCallback(
    async (assetId: string): Promise<string> => {
      if (api.getAnnotationAssetUrl) {
        return api.getAnnotationAssetUrl(fileId, assetId);
      }
      return api.getFileUrl(assetId);
    },
    [api, fileId],
  );

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

  const upsertTemplateAnnotation = useCallback(
    (next: TemplateAnnotation) => {
      const normalized = normalizeTemplateAnnotation(next);
      setSchema((prev) => {
        const exists = prev.annotations.some((a) => a.id === normalized.id);
        if (!exists) {
          return { annotations: [...prev.annotations, normalized] };
        }
        return {
          annotations: prev.annotations.map((a) =>
            a.id === normalized.id ? normalized : a,
          ),
        };
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  const upsertAnnotation = useCallback(
    (next: FileAnnotation) => {
      const existing = schemaRef.current.annotations.find(
        (a) => a.id === next.id,
      );
      const existingText =
        existing && isTextAnnotation(existing) ? existing : undefined;
      upsertTemplateAnnotation(
        normalizeFileAnnotation({
          ...(existingText ?? next),
          ...next,
          label:
            existingText?.label ||
            next.label ||
            annotationPlainPreview(next.content_html),
        }),
      );
    },
    [upsertTemplateAnnotation],
  );

  const clearSaveTimer = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  }, []);

  const flushSave = useCallback(async () => {
    if (!supportsTemplateAnnotations || !fileId) return;
    clearSaveTimer();
    const merged = normalizeAnnotationsSchema(
      prepareSchemaForPersist(schemaRef.current, selectedId),
    );
    schemaRef.current = merged;
    setSchema(merged);
    await persist(merged);
  }, [
    supportsTemplateAnnotations,
    fileId,
    clearSaveTimer,
    prepareSchemaForPersist,
    selectedId,
    persist,
  ]);

  useImperativeHandle(ref, () => ({ flushSave }), [flushSave]);

  const addAnnotation = useCallback(() => {
    const id = crypto.randomUUID();
    const page = activePage;
    const newTextNumber = nextNewTextNumberRef.current;
    nextNewTextNumberRef.current += 1;
    const newLabel = buildNewTextLabel(newTextNumber);
    const pageW = (pageWidthAtScale1Ref.current ?? 0) * scale;
    const pageH = (pageHeightAtScale1Ref.current ?? 0) * scale;
    const estimated = estimateAnnotationTextBoxNorm({
      text: newLabel,
      fontSizePx: DEFAULT_ANNOTATION.font_size,
      fontFamily: DEFAULT_ANNOTATION.font_family,
      pageWidthPx: pageW,
      pageHeightPx: pageH,
      pdfScale: scale,
      minWidth: ANNOTATION_MIN_WIDTH,
      minHeight: ANNOTATION_MIN_HEIGHT,
    });
    const w =
      pageW > 0 && pageH > 0 ? estimated.width : DEFAULT_ANNOTATION.width;
    const h =
      pageW > 0 && pageH > 0 ? estimated.height : DEFAULT_ANNOTATION.height;
    const ann = normalizeFileAnnotation({
      type: TEMPLATE_ANNOTATION_TYPES.TEXT,
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
    setShapeDrawTool(null);
    scheduleSave();
  }, [activePage, scale, scheduleSave]);

  const addImageAnnotation = useCallback(
    async (file: File) => {
      if (!api.uploadAnnotationImage) {
        toast.error("La API no soporta carga de imágenes para anotaciones");
        return;
      }
      setIsUploadingImage(true);
      try {
        const uploaded = await api.uploadAnnotationImage(fileId, file);
        const id = crypto.randomUUID();
        const imageAnn = normalizeTemplateAnnotation({
          type: TEMPLATE_ANNOTATION_TYPES.IMAGE,
          id,
          page: activePage,
          x: 0.2,
          y: 0.2,
          width: 0.3,
          height: 0.18,
          assetId: uploaded.assetId,
          label: file.name?.trim() || undefined,
        }) as ImageAnnotation;
        setSchema((prev) => ({ annotations: [...prev.annotations, imageAnn] }));
        setSelectedId(id);
        setShapeDrawTool(null);
        if (uploaded.url) {
          setAnnotationAssetUrls((prev) => ({
            ...prev,
            [uploaded.assetId]: uploaded.url!,
          }));
        }
        scheduleSave();
      } catch (e) {
        console.error(e);
        toast.error("No se pudo subir la imagen para anotación");
      } finally {
        setIsUploadingImage(false);
      }
    },
    [activePage, api, fileId, scheduleSave],
  );

  const openImagePicker = useCallback(() => {
    setShapeDrawTool(null);
    imageInputRef.current?.click();
  }, []);

  const handleImageInputChange = useCallback(
    async (ev: ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      ev.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Selecciona un archivo de imagen válido");
        return;
      }
      await addImageAnnotation(file);
    },
    [addImageAnnotation],
  );

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

  useEffect(() => {
    const imageAssetIds = Array.from(
      new Set(
        schema.annotations
          .filter(isImageAnnotation)
          .map((ann) => ann.assetId)
          .filter((assetId) => !!assetId && !annotationAssetUrls[assetId]),
      ),
    );
    if (!imageAssetIds.length) return;
    let cancelled = false;
    void Promise.allSettled(
      imageAssetIds.map(async (assetId) => {
        const assetUrl = await resolveAnnotationAssetUrl(assetId);
        return { assetId, url: assetUrl };
      }),
    ).then((results) => {
      if (cancelled) return;
      const nextEntries = results
        .filter(
          (r): r is PromiseFulfilledResult<{ assetId: string; url: string }> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value)
        .filter((v) => !!v.url);
      if (!nextEntries.length) return;
      setAnnotationAssetUrls((prev) => {
        const merged = { ...prev };
        for (const item of nextEntries) merged[item.assetId] = item.url;
        return merged;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [annotationAssetUrls, resolveAnnotationAssetUrl, schema.annotations]);

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

  const selectedAnnotation = schema.annotations.find(
    (a) => a.id === selectedId,
  );
  const selectedIsText =
    selectedAnnotation != null && isTextAnnotation(selectedAnnotation);
  const selectedShape = isShapeToolbarAnnotation(selectedAnnotation)
    ? selectedAnnotation
    : null;
  const selectedImage =
    selectedAnnotation != null && isImageAnnotation(selectedAnnotation)
      ? selectedAnnotation
      : null;

  const handlePageViewportAtScaleOne = useCallback(
    (width: number, height: number) => {
      pageWidthAtScale1Ref.current = width;
      pageHeightAtScale1Ref.current = height;
      setPageViewportAtScaleOne({ width, height });
    },
    [],
  );

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
    <div className="flex h-full min-h-0 w-full flex-col bg-background">
      <AnnotationToolbar
        shapeDrawTool={shapeDrawTool}
        onShapeDrawToolChange={setShapeDrawTool}
        onInsertText={addAnnotation}
        onInsertImage={openImagePicker}
        onSaveAsPdf={openSaveAsDialog}
        isExporting={isPdfBusy}
        isUploadingImage={isUploadingImage}
        hasAnnotations={hasAnnotations}
        hasSelection={!!selectedId}
        activePdfPage={activePage}
        pdfPageCount={pdfPageCount}
        formatToolbar={
          selectedIsText ? (
            <AnnotationDockedToolbar
              selectedId={selectedId}
              canDelete={!!selectedId}
              onDelete={() => {
                if (selectedId) removeAnnotation(selectedId);
              }}
            />
          ) : selectedShape ? (
            <AnnotationShapeToolbar
              annotation={selectedShape}
              onUpdate={upsertTemplateAnnotation}
              onDelete={() => {
                if (selectedId) removeAnnotation(selectedId);
              }}
            />
          ) : selectedImage && selectedId ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Eliminar imagen"
              onClick={() => removeAnnotation(selectedId)}
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null
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
                  pageWidthAtScale1={pageViewportAtScaleOne?.width}
                  pageHeightAtScale1={pageViewportAtScaleOne?.height}
                  annotations={schema.annotations}
                  annotationAssetUrls={annotationAssetUrls}
                  selectedId={selectedId}
                  shapeDrawTool={shapeDrawTool}
                  createShapeLabel={createShapeLabel}
                  onSelect={setSelectedId}
                  onClearSelection={() => setSelectedId(null)}
                  onChangeTextAnnotation={upsertAnnotation}
                  onChangeShapeAnnotation={upsertTemplateAnnotation}
                  onShapeDrawToolChange={setShapeDrawTool}
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
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleImageInputChange(e);
        }}
      />
    </div>
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
