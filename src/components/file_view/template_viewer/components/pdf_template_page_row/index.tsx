import { useCallback, useLayoutEffect, useState } from "react";
import { Page } from "react-pdf";
import type { FileAnnotation } from "../../../types/annotations";
import { AnnotationOverlay } from "../annotation_overlay";
import { LoadingState } from "../../../pdf_viewer/components";

interface Props {
  pageNumber: number;
  scale: number;
  annotations: FileAnnotation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (next: FileAnnotation) => void;
  onPageViewportAtScaleOne?: (width: number, height: number) => void;
}

export function PdfTemplatePageRow({
  pageNumber,
  scale,
  annotations,
  selectedId,
  onSelect,
  onChange,
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

  const getPageRect = useCallback((): DOMRect | null => {
    if (box.w <= 0 || box.h <= 0) return null;
    return new DOMRect(0, 0, box.w, box.h);
  }, [box.w, box.h]);

  const moveableLayoutKey = `${pageNumber}-${scale.toFixed(3)}-${Math.round(box.w)}-${Math.round(box.h)}`;

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
      <AnnotationOverlay
        pageNumber={pageNumber}
        pdfScale={scale}
        annotations={annotations}
        selectedId={selectedId}
        onSelect={onSelect}
        onChange={onChange}
        getPageRect={getPageRect}
        moveableLayoutKey={moveableLayoutKey}
      />
    </div>
  );
}
