import { useCallback, useLayoutEffect, useState } from "react";
import { Page } from "react-pdf";
import type {
  FileAnnotation,
  TemplateAnnotation,
} from "../../../types/annotations";
import { AnnotationKonvaLayer } from "../annotation_konva_layer";
import { AnnotationOverlay } from "../annotation_overlay";
import { LoadingState } from "../../../pdf_viewer/components";
import { type ShapeDrawTool, isShapeDrawTool } from "../../utilities";

interface Props {
  pageNumber: number;
  scale: number;
  pageWidthAtScale1?: number;
  pageHeightAtScale1?: number;
  annotations: TemplateAnnotation[];
  annotationAssetUrls: Record<string, string>;
  selectedId: string | null;
  shapeDrawTool: ShapeDrawTool | null;
  createShapeLabel: (kind: ShapeDrawTool) => string;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  onChangeText: (next: FileAnnotation) => void;
  onChangeShape: (next: TemplateAnnotation) => void;
  onShapeDrawToolChange: (tool: ShapeDrawTool | null) => void;
  onPageViewportAtScaleOne?: (width: number, height: number) => void;
}

export function PdfTemplatePageRow({
  pageNumber,
  scale,
  pageWidthAtScale1,
  pageHeightAtScale1,
  annotations,
  annotationAssetUrls,
  selectedId,
  shapeDrawTool,
  createShapeLabel,
  onSelect,
  onClearSelection,
  onChangeText,
  onChangeShape,
  onShapeDrawToolChange,
  onPageViewportAtScaleOne,
}: Props) {
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const setWrapRef = useCallback((el: HTMLDivElement | null) => {
    setWrapEl(el);
  }, []);

  useLayoutEffect(() => {
    if (!wrapEl) return;
    const apply = () => {
      setBox({ w: wrapEl.clientWidth, h: wrapEl.clientHeight });
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(wrapEl);
    return () => ro.disconnect();
  }, [wrapEl, scale]);

  const layoutW =
    pageWidthAtScale1 != null && pageWidthAtScale1 > 0
      ? pageWidthAtScale1 * scale
      : box.w;
  const layoutH =
    pageHeightAtScale1 != null && pageHeightAtScale1 > 0
      ? pageHeightAtScale1 * scale
      : box.h;

  const textAnnotations = annotations.filter(
    (a): a is FileAnnotation => a.type === "text",
  );

  const getPageRect = useCallback((): DOMRect | null => {
    if (layoutW <= 0 || layoutH <= 0) return null;
    return new DOMRect(0, 0, layoutW, layoutH);
  }, [layoutW, layoutH]);

  const moveableLayoutKey = `${pageNumber}-${scale.toFixed(3)}`;

  const overlayLayoutPending =
    layoutW > 0 &&
    layoutH > 0 &&
    box.w > 0 &&
    box.h > 0 &&
    (Math.abs(box.w - layoutW) > 2 || Math.abs(box.h - layoutH) > 2);

  const onRenderSuccess = useCallback(
    (page: {
      getViewport: (opts: { scale: number }) => {
        width: number;
        height: number;
      };
    }) => {
      const viewport = page.getViewport({ scale: 1 });
      onPageViewportAtScaleOne?.(viewport.width, viewport.height);
    },
    [onPageViewportAtScaleOne],
  );

  return (
    <div ref={setWrapRef} className="relative inline-block shadow-md">
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer
        renderAnnotationLayer
        loading={<LoadingState />}
        onRenderSuccess={onRenderSuccess}
      />
      <AnnotationKonvaLayer
        pageNumber={pageNumber}
        stageWidth={layoutW}
        stageHeight={layoutH}
        annotations={annotations}
        annotationAssetUrls={annotationAssetUrls}
        selectedId={selectedId}
        shapeDrawTool={shapeDrawTool}
        createShapeLabel={createShapeLabel}
        onSelect={onSelect}
        onClearSelection={onClearSelection}
        onChange={onChangeShape}
        onShapeDrawToolChange={onShapeDrawToolChange}
        hidden={overlayLayoutPending}
      />
      <AnnotationOverlay
        pageNumber={pageNumber}
        pdfScale={scale}
        annotations={textAnnotations}
        selectedId={selectedId}
        onSelect={onSelect}
        onChange={onChangeText}
        getPageRect={getPageRect}
        moveableLayoutKey={moveableLayoutKey}
        hidden={overlayLayoutPending}
        allowPagePointerEvents={isShapeDrawTool(shapeDrawTool)}
      />
    </div>
  );
}
