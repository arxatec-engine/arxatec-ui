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
  ANNOTATION_MIN_HEIGHT as MIN_H,
  ANNOTATION_MIN_WIDTH as MIN_W,
  normalizeFileAnnotation,
  shouldAutoFitAnnotationBox,
} from "../../constants";

const ANNOTATION_TEXT_COLOR = "#000000";

const autoFitSessionKey = (annotationId: string) =>
  `arxatec-pdf-ann-autofit:v1:${annotationId}`;

const INNER_PAD_PX = 6;
const DRAG_STRIP_PX = INNER_PAD_PX;
const CHROME_PX = 0;
const ANNOTATION_BOX_BORDER_PX = 1;

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
  const { registerEditor } = useActiveAnnotationEditor();
  const extensions = useMemo(() => createAnnotationEditorExtensions(), []);

  const annRef = useRef(annotation);

  useEffect(() => {
    annRef.current = annotation;
  }, [annotation]);

  const targetRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const transformingRef = useRef(false);
  const [innerContentPx, setInnerContentPx] = useState<{
    w: number;
    h: number;
  } | null>(null);

  const editor = useEditor({
    immediatelyRender: true,
    extensions: extensions as AnyExtension[],
    content: annotation.content_html,
    editorProps: {
      attributes: {
        class:
          "annotation-pm outline-none bg-transparent max-w-full whitespace-pre-wrap break-words p-0 m-0",
        style: `color: ${ANNOTATION_TEXT_COLOR}; caret-color: ${ANNOTATION_TEXT_COLOR};`,
        dir: "ltr",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange({ ...annRef.current, content_html: ed.getHTML() });
    },
  });

  useEffect(() => {
    if (!editor) return;
    const cur = editor.getHTML();
    if (annotation.content_html && annotation.content_html !== cur) {
      editor.commands.setContent(annotation.content_html, {
        emitUpdate: false,
      });
    }
  }, [annotation.content_html, editor]);

  useEffect(() => {
    if (!isSelected && editor) {
      editor.commands.blur();
    }
  }, [isSelected, editor]);

  useEffect(() => {
    if (!editor) return;
    if (isSelected) {
      registerEditor(annotation.id, editor);
      return () => registerEditor(annotation.id, null);
    }
    registerEditor(annotation.id, null);
    return undefined;
  }, [isSelected, editor, annotation.id, registerEditor]);

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
  const padScreen = INNER_PAD_PX * s;
  const minWPx = Math.max(4, MIN_W * pageW);
  const minHPx = Math.max(4, MIN_H * pageH);

  const position = useMemo(
    () => ({
      x: annotation.x * pageW - padScreen,
      y: annotation.y * pageH - padScreen,
    }),
    [annotation.x, annotation.y, pageW, pageH, padScreen],
  );

  const size = useMemo(
    () => ({
      width: Math.max(minWPx, annotation.width * pageW) + padScreen * 2,
      height: Math.max(minHPx, annotation.height * pageH) + padScreen * 2,
    }),
    [
      annotation.width,
      annotation.height,
      pageW,
      pageH,
      minWPx,
      minHPx,
      padScreen,
    ],
  );

  const persistFromTarget = useCallback(
    (el: HTMLElement) => {
      const rect = getPageRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      const pad = INNER_PAD_PX * s;
      const { x: visualX, y: visualY } = parseTranslatePx(el.style.transform);
      const visualW = el.offsetWidth;
      const visualH = el.offsetHeight;
      const textX = visualX + pad;
      const textY = visualY + pad;
      const textW = Math.max(0, visualW - pad * 2);
      const textH = Math.max(0, visualH - pad * 2);
      onChange(
        normalizeFileAnnotation({
          ...annRef.current,
          x: textX / rect.width,
          y: textY / rect.height,
          width: textW / rect.width,
          height: textH / rect.height,
        }),
      );
    },
    [getPageRect, onChange, s],
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
    const el = targetRef.current;
    if (!el) return;
    const sync = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setInnerContentPx((prev) => {
        if (prev && Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5) {
          return prev;
        }
        return { w, h };
      });
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size.width, size.height, position.x, position.y]);

  useLayoutEffect(() => {
    if (!editor || transformingRef.current) return;
    if (!shouldAutoFitAnnotationBox(annRef.current)) return;

    const rect = getPageRect();
    if (!rect?.height) return;

    let storageOk = false;
    try {
      storageOk = typeof sessionStorage !== "undefined";
    } catch {
      storageOk = false;
    }
    const fitKey = autoFitSessionKey(annotation.id);
    if (storageOk && sessionStorage.getItem(fitKey)) return;

    const pm = editor.view.dom as HTMLElement;
    const contentH = Math.ceil(pm.scrollHeight);
    const pageLogicalH = rect.height / s;
    const targetPxLogical = Math.max(
      MIN_H * pageLogicalH,
      contentH + CHROME_PX,
    );
    const nextH = Math.min(1, targetPxLogical / pageLogicalH);

    if (storageOk) {
      sessionStorage.setItem(fitKey, "1");
    }

    if (Math.abs(nextH - annotation.height) < 0.003) return;

    onChange(
      normalizeFileAnnotation({
        ...annRef.current,
        height: nextH,
      }),
    );
  }, [
    editor,
    annotation.id,
    annotation.height,
    annotation.content_html,
    getPageRect,
    onChange,
    s,
  ]);

  const innerLayout = useMemo(() => {
    const sc = s > 0 ? s : 1;
    const bw = ANNOTATION_BOX_BORDER_PX;
    const fallbackW = Math.max(0, size.width - 2 * bw);
    const fallbackH = Math.max(0, size.height - 2 * bw);
    const hasMeasure =
      innerContentPx != null && innerContentPx.w > 0 && innerContentPx.h > 0;
    const cw = hasMeasure ? innerContentPx!.w : fallbackW;
    const ch = hasMeasure ? innerContentPx!.h : fallbackH;
    return {
      innerW: cw / sc,
      innerH: ch / sc,
      scale: sc,
    };
  }, [size.width, size.height, s, innerContentPx]);

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
        role="presentation"
        className={cn(
          "absolute left-0 top-0 box-border scheme-light isolate overflow-hidden",
          isSelected
            ? "z-20 border border-blue-600"
            : "z-10 border border-dashed border-muted-foreground/40",
        )}
        style={{
          boxSizing: "border-box",
          width: size.width,
          height: size.height,
          transform: `translate(${position.x}px, ${position.y}px)`,
          color: ANNOTATION_TEXT_COLOR,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <div
          className="relative"
          style={{
            width: innerLayout.innerW,
            height: innerLayout.innerH,
            transform: `scale(${innerLayout.scale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            className="relative z-10 flex h-full w-full flex-col items-start justify-start"
            style={{
              fontFamily: annotation.font_family,
              fontSize: annotation.font_size,
              color: ANNOTATION_TEXT_COLOR,
              padding: INNER_PAD_PX,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {editor ? <EditorContent editor={editor} /> : null}
          </div>

          <div
            ref={dragHandleRef}
            className="annotation-drag-handle pointer-events-auto absolute left-0 right-0 top-0 z-20 cursor-move select-none"
            style={{ height: DRAG_STRIP_PX }}
            aria-hidden
          />
        </div>
      </div>

      {isSelected && moveableContainer ? (
        <Moveable
          key={moveableLayoutKey}
          target={targetRef}
          container={moveableContainer}
          draggable
          resizable
          origin={false}
          keepRatio={false}
          dragTarget={dragHandleRef}
          dragTargetSelf={false}
          bounds={{
            left: -padScreen,
            top: -padScreen,
            right: boundsW + padScreen,
            bottom: boundsH + padScreen,
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
            persistFromTarget(target as HTMLElement);
          }}
        />
      ) : null}
    </>
  );
};
