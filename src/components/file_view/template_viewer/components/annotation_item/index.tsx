import type { AnyExtension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import { createAnnotationEditorExtensions } from "@/components/rich_text_editor/lib/annotation_editor_extensions";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Moveable, {
  type OnDrag,
  type OnDragEnd,
  type OnResize,
  type OnResizeEnd,
} from "react-moveable";
import type { FileAnnotation } from "../../../types/annotations";
import { cn } from "@/utilities/class";
import { useActiveAnnotationEditor } from "../../context/use_active_annotation_editor";
import {
  ANNOTATION_BORDER_PX,
  ANNOTATION_LINE_HEIGHT,
  ANNOTATION_PADDING_PX,
  ANNOTATION_WIDTH_BUFFER_PX,
  annotationPaddingScreen,
} from "../../utilities";
import {
  ANNOTATION_MIN_HEIGHT as MIN_H,
  ANNOTATION_MIN_WIDTH as MIN_W,
  normalizeFileAnnotation,
} from "../../constants";

const ANNOTATION_TEXT_COLOR = "#000000";

const DRAG_STRIP_PX = ANNOTATION_PADDING_PX;

function parseTranslatePx(transform: string): { x: number; y: number } {
  if (!transform || transform === "none") return { x: 0, y: 0 };
  const m = transform.match(
    /translate\(\s*([-0-9.]+)px\s*,\s*([-0-9.]+)px\s*\)/,
  );
  if (m) return { x: Number(m[1]), y: Number(m[2]) };
  const m3 = transform.match(
    /translate3d\(\s*([-0-9.]+)px\s*,\s*([-0-9.]+)px\s*,/,
  );
  if (m3) return { x: Number(m3[1]), y: Number(m3[2]) };
  return { x: 0, y: 0 };
}

function measureProseMirrorContentLogicalPx(
  pm: HTMLElement,
  pdfScale: number,
): { width: number; height: number } {
  const s = pdfScale > 0 ? pdfScale : 1;
  const prevWidth = pm.style.width;
  const prevMaxWidth = pm.style.maxWidth;
  pm.style.width = "max-content";
  pm.style.maxWidth = "none";
  const range = document.createRange();
  range.selectNodeContents(pm);
  const rectW = range.getBoundingClientRect().width;
  const screenW = Math.ceil(
    rectW > 0
      ? rectW
      : Math.max(pm.scrollWidth, pm.getBoundingClientRect().width),
  );
  const screenH = Math.ceil(pm.scrollHeight);
  pm.style.width = prevWidth;
  pm.style.maxWidth = prevMaxWidth;
  return {
    width: screenW / s,
    height: screenH / s,
  };
}

interface Props {
  annotation: FileAnnotation;
  pdfScale: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (next: FileAnnotation) => void;
  getPageRect: () => DOMRect | null;
  moveableContainer: HTMLElement | null;
  moveableLayoutKey: string;
}

export const AnnotationItem: React.FC<Props> = ({
  annotation,
  pdfScale,
  isSelected,
  onSelect,
  onChange,
  getPageRect,
  moveableContainer,
  moveableLayoutKey,
}) => {
  const { registerEditor, registerActiveEditorHtmlSource } =
    useActiveAnnotationEditor();
  const extensions = useMemo(() => createAnnotationEditorExtensions(), []);

  const annRef = useRef(annotation);
  const lastEditorPushedHtmlRef = useRef<string | null>(null);
  const [pendingManualSizeId, setPendingManualSizeId] = useState<string | null>(
    null,
  );
  const userManualSize =
    annotation.size_mode === "manual" || pendingManualSizeId === annotation.id;

  useLayoutEffect(() => {
    annRef.current = annotation;
  }, [annotation]);

  const targetRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const transformingRef = useRef(false);
  const moveableRef = useRef<Moveable>(null);
  type ContentMeasureState = {
    annotationId: string;
    widthLogical: number | null;
    heightLogical: number | null;
    measured: boolean;
  };

  const [contentMeasure, setContentMeasure] = useState<ContentMeasureState>({
    annotationId: annotation.id,
    widthLogical: null,
    heightLogical: null,
    measured: false,
  });

  const activeMeasure = useMemo((): ContentMeasureState => {
    if (contentMeasure.annotationId === annotation.id) {
      return contentMeasure;
    }
    return {
      annotationId: annotation.id,
      widthLogical: null,
      heightLogical: null,
      measured: false,
    };
  }, [annotation.id, contentMeasure]);

  const contentWidthPx = activeMeasure.widthLogical;
  const contentHeightPx = activeMeasure.heightLogical;
  const hasMeasuredContent = activeMeasure.measured;

  const pdfScaleRef = useRef(pdfScale);
  const getPageRectRef = useRef(getPageRect);
  const userManualSizeRef = useRef(userManualSize);

  useLayoutEffect(() => {
    pdfScaleRef.current = pdfScale;
    getPageRectRef.current = getPageRect;
    userManualSizeRef.current = userManualSize;
  }, [pdfScale, getPageRect, userManualSize]);

  const editor = useEditor({
    immediatelyRender: true,
    extensions: extensions as AnyExtension[],
    content: annotation.content_html,
    editorProps: {
      attributes: {
        class:
          "annotation-pm outline-none bg-transparent max-w-full whitespace-pre-wrap break-words p-0 m-0 block",
        style: `color: ${ANNOTATION_TEXT_COLOR}; caret-color: ${ANNOTATION_TEXT_COLOR};`,
        dir: "ltr",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const cur = annRef.current;
      const html = ed.getHTML();
      const patch: Partial<FileAnnotation> = { content_html: html };
      if (!userManualSizeRef.current) {
        const scale = pdfScaleRef.current > 0 ? pdfScaleRef.current : 1;
        const pm = ed.view.dom as HTMLElement;
        const { width: wLogical, height: hLogical } =
          measureProseMirrorContentLogicalPx(pm, scale);
        const rect = getPageRectRef.current();
        if (rect && rect.width > 0 && rect.height > 0) {
          const targetH = Math.max(MIN_H * rect.height, hLogical * scale);
          const targetW = Math.max(
            MIN_W * rect.width,
            wLogical * scale + ANNOTATION_WIDTH_BUFFER_PX * scale,
          );
          const nextH = Math.min(1, targetH / rect.height);
          const nextW = Math.min(1, targetW / rect.width);
          const widthDeltaPx = Math.abs(nextW - cur.width) * rect.width;
          const heightDeltaPx = Math.abs(nextH - cur.height) * rect.height;
          if (widthDeltaPx >= 2 || heightDeltaPx >= 2) {
            patch.width = nextW;
            patch.height = nextH;
          }
        }
      }
      const next = normalizeFileAnnotation({ ...cur, ...patch });
      annRef.current = next;
      lastEditorPushedHtmlRef.current = html;
      onChange(next);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = (annotation.content_html ?? "").trim();
    if (!incoming) return;
    if (incoming === lastEditorPushedHtmlRef.current) {
      lastEditorPushedHtmlRef.current = null;
      return;
    }
    const cur = editor.getHTML().trim();
    if (incoming !== cur) {
      editor.commands.setContent(annotation.content_html, {
        emitUpdate: false,
      });
      annRef.current = {
        ...annRef.current,
        content_html: annotation.content_html,
      };
    }
  }, [annotation.content_html, annotation.id, editor]);

  useEffect(() => {
    if (!isSelected || !editor) {
      registerActiveEditorHtmlSource(null);
      return;
    }
    registerActiveEditorHtmlSource(() => editor.getHTML());
    return () => registerActiveEditorHtmlSource(null);
  }, [isSelected, editor, registerActiveEditorHtmlSource]);

  useEffect(() => {
    if (!isSelected && editor) {
      editor.commands.blur();
    }
  }, [isSelected, editor]);

  const patchAnnotation = useCallback(
    (patch: Partial<FileAnnotation>) => {
      const next = normalizeFileAnnotation({
        ...annRef.current,
        ...patch,
      });
      annRef.current = next;
      if (patch.content_html != null) {
        lastEditorPushedHtmlRef.current = patch.content_html;
      }
      onChange(next);
    },
    [onChange],
  );

  useEffect(() => {
    if (!editor) return;
    if (isSelected) {
      registerEditor(annotation.id, editor, {
        font_size: annotation.font_size,
        font_family: annotation.font_family,
        patchAnnotation,
      });
      return () => registerEditor(annotation.id, null);
    }
    registerEditor(annotation.id, null);
    return undefined;
  }, [
    isSelected,
    editor,
    annotation.id,
    annotation.font_size,
    annotation.font_family,
    registerEditor,
    patchAnnotation,
  ]);

  useEffect(() => {
    if (!editor) return;
    const nudgeView = () => {
      if (document.visibilityState !== "visible") return;
      requestAnimationFrame(() => {
        const { from } = editor.state.selection;
        editor.commands.setTextSelection(from);
      });
    };
    document.addEventListener("visibilitychange", nudgeView);
    window.addEventListener("pageshow", nudgeView);
    return () => {
      document.removeEventListener("visibilitychange", nudgeView);
      window.removeEventListener("pageshow", nudgeView);
    };
  }, [editor]);

  const pageRect = getPageRect();
  const pageW = pageRect?.width ?? 0;
  const pageH = pageRect?.height ?? 0;
  const s = pdfScale > 0 ? pdfScale : 1;
  const padScreen = annotationPaddingScreen(s);
  const border = ANNOTATION_BORDER_PX;
  const chromeX = padScreen + border;
  const minWPx = Math.max(4, MIN_W * pageW);
  const minHPx = Math.max(4, MIN_H * pageH);

  const schemaTextWPx = Math.max(minWPx, annotation.width * pageW);
  const schemaTextHPx = Math.max(minHPx, annotation.height * pageH);

  const useAutoSize = !userManualSize;
  const widthBufferPx = ANNOTATION_WIDTH_BUFFER_PX * s;

  const textWPx = useAutoSize
    ? contentWidthPx != null
      ? Math.max(minWPx, contentWidthPx * s + widthBufferPx)
      : schemaTextWPx
    : schemaTextWPx;
  const textHPx = useAutoSize
    ? contentHeightPx != null
      ? Math.max(minHPx, contentHeightPx * s)
      : schemaTextHPx
    : schemaTextHPx;

  const position = useMemo(
    () => ({
      x: annotation.x * pageW - chromeX,
      y: annotation.y * pageH - chromeX,
    }),
    [annotation.x, annotation.y, pageW, pageH, chromeX],
  );

  const size = useMemo(
    () => ({
      width: textWPx + chromeX * 2,
      height: textHPx + chromeX * 2,
    }),
    [textWPx, textHPx, chromeX],
  );

  const moveableInstanceKey = `${moveableLayoutKey}-${annotation.id}`;

  const scaledFontSize = annotation.font_size * s;

  const syncSizeFromContent = useCallback(
    (contentHLogical: number, contentWLogical: number) => {
      const rect = getPageRect();
      if (
        !rect?.width ||
        !rect?.height ||
        transformingRef.current ||
        userManualSize
      ) {
        return;
      }
      const pageW = rect.width;
      const pageH = rect.height;
      const scale = s > 0 ? s : 1;
      const targetH = Math.max(MIN_H * pageH, contentHLogical * scale);
      const targetW = Math.max(
        MIN_W * pageW,
        contentWLogical * scale + ANNOTATION_WIDTH_BUFFER_PX * scale,
      );
      const nextH = Math.min(1, targetH / pageH);
      const nextW = Math.min(1, targetW / pageW);
      const cur = annRef.current;
      const widthDeltaPx = Math.abs(nextW - cur.width) * pageW;
      const heightDeltaPx = Math.abs(nextH - cur.height) * pageH;
      if (widthDeltaPx < 2 && heightDeltaPx < 2) {
        return;
      }
      const html = editor?.getHTML() ?? cur.content_html;
      const next = normalizeFileAnnotation({
        ...cur,
        content_html: html,
        height: nextH,
        width: nextW,
      });
      annRef.current = next;
      lastEditorPushedHtmlRef.current = html;
      onChange(next);
    },
    [editor, getPageRect, onChange, s, userManualSize],
  );

  useLayoutEffect(() => {
    if (!editor) return;
    const pm = editor.view.dom as HTMLElement;

    const apply = () => {
      if (transformingRef.current) return;
      const { width: wLogical, height: hLogical } =
        measureProseMirrorContentLogicalPx(pm, s);
      setContentMeasure((prev) => {
        const base =
          prev.annotationId === annotation.id
            ? prev
            : {
                annotationId: annotation.id,
                widthLogical: null,
                heightLogical: null,
                measured: false,
              };
        const widthLogical =
          base.widthLogical != null &&
          Math.abs(base.widthLogical - wLogical) < 0.25
            ? base.widthLogical
            : wLogical;
        const heightLogical =
          base.heightLogical != null &&
          Math.abs(base.heightLogical - hLogical) < 0.25
            ? base.heightLogical
            : hLogical;
        return {
          annotationId: annotation.id,
          widthLogical,
          heightLogical,
          measured: true,
        };
      });
      if (!userManualSize) {
        syncSizeFromContent(hLogical, wLogical);
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(pm);
    return () => ro.disconnect();
  }, [
    editor,
    annotation.id,
    annotation.content_html,
    annotation.font_size,
    annotation.font_family,
    s,
    syncSizeFromContent,
    userManualSize,
  ]);

  const persistFromTarget = useCallback(
    (el: HTMLElement) => {
      const rect = getPageRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      const pad = annotationPaddingScreen(s);
      const { x: visualX, y: visualY } = parseTranslatePx(el.style.transform);
      const visualW = el.offsetWidth;
      const visualH = el.offsetHeight;
      const textX = visualX + pad + border;
      const textY = visualY + pad + border;
      const textW = Math.max(0, visualW - (pad + border) * 2);
      const textH = Math.max(0, visualH - (pad + border) * 2);
      onChange(
        normalizeFileAnnotation({
          ...annRef.current,
          x: textX / rect.width,
          y: textY / rect.height,
          width: textW / rect.width,
          height: textH / rect.height,
          size_mode: "manual",
        }),
      );
    },
    [getPageRect, onChange, s, border],
  );

  useLayoutEffect(() => {
    if (transformingRef.current) return;
    const el = targetRef.current;
    if (!el) return;
    el.style.width = `${size.width}px`;
    el.style.height = `${size.height}px`;
    el.style.transform = `translate(${position.x}px, ${position.y}px)`;
  }, [position.x, position.y, size.width, size.height]);

  useLayoutEffect(() => {
    if (!isSelected || !hasMeasuredContent) return;
    const frame = requestAnimationFrame(() => {
      moveableRef.current?.updateRect();
    });
    return () => cancelAnimationFrame(frame);
  }, [
    isSelected,
    hasMeasuredContent,
    moveableInstanceKey,
    size.width,
    size.height,
    position.x,
    position.y,
  ]);

  if (!pageRect || pageW <= 0 || pageH <= 0) {
    return null;
  }

  const boundsW = moveableContainer?.clientWidth ?? pageW;
  const boundsH = moveableContainer?.clientHeight ?? pageH;

  return (
    <>
      <div
        ref={targetRef}
        data-annotation-box
        data-auto-size={useAutoSize ? "true" : undefined}
        role="presentation"
        className={cn(
          "pointer-events-auto absolute left-0 top-0 box-border scheme-light isolate overflow-hidden",
          isSelected
            ? "z-20 border border-blue-600"
            : "z-10 border border-dashed border-muted-foreground/40",
        )}
        style={{
          boxSizing: "border-box",
          width: size.width,
          height: size.height,
          padding: padScreen,
          transform: `translate(${position.x}px, ${position.y}px)`,
          color: ANNOTATION_TEXT_COLOR,
          fontFamily: annotation.font_family,
          fontSize: scaledFontSize,
          lineHeight: ANNOTATION_LINE_HEIGHT,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <div
          ref={dragHandleRef}
          className="annotation-drag-handle pointer-events-auto absolute left-0 right-0 top-0 z-20 cursor-move select-none"
          style={{ height: DRAG_STRIP_PX * s }}
          aria-hidden
        />
        <div
          className={cn(
            "relative z-10 min-w-0",
            useAutoSize ? "w-max max-w-none" : "w-fit max-w-full",
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {editor ? <EditorContent editor={editor} /> : null}
        </div>
      </div>

      {isSelected && moveableContainer && hasMeasuredContent ? (
        <Moveable
          ref={moveableRef}
          key={moveableInstanceKey}
          target={targetRef}
          container={moveableContainer}
          draggable
          resizable
          origin={false}
          keepRatio={false}
          dragTarget={dragHandleRef}
          dragTargetSelf={false}
          bounds={{
            left: -chromeX,
            top: -chromeX,
            right: boundsW + chromeX,
            bottom: boundsH + chromeX,
          }}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          onDragStart={() => {
            transformingRef.current = true;
          }}
          onDrag={(e: OnDrag) => {
            e.target.style.transform = e.transform;
          }}
          onDragEnd={({ target }: OnDragEnd) => {
            transformingRef.current = false;
            persistFromTarget(target as HTMLElement);
          }}
          onResizeStart={() => {
            transformingRef.current = true;
          }}
          onResize={(e: OnResize) => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
          }}
          onResizeEnd={({ target }: OnResizeEnd) => {
            transformingRef.current = false;
            setPendingManualSizeId(annotation.id);
            persistFromTarget(target as HTMLElement);
          }}
        />
      ) : null}
    </>
  );
};
