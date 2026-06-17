import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Circle,
  Ellipse,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import type Konva from "konva";
import type {
  EllipseAnnotation,
  ImageAnnotation,
  LineAnnotation,
  RectAnnotation,
  TemplateAnnotation,
} from "../../../../types/annotations";
import {
  isEllipseAnnotation,
  isImageAnnotation,
  isLineAnnotation,
  isRectAnnotation,
  TEMPLATE_ANNOTATION_TYPES,
} from "../../../../types/annotations";
import {
  bboxFromStageDrag,
  lineFromStageDrag,
  normPointToStage,
  normSizeToStage,
  stagePointToNorm,
  strokeNormToStage,
  DEFAULT_LINE_STROKE_WIDTH,
  DEFAULT_SHAPE_STROKE,
  DEFAULT_SHAPE_STROKE_WIDTH,
  isTransparentShapeStroke,
  type ShapeDrawTool,
  isShapeDrawTool,
  normalizeTemplateAnnotation,
} from "../../utilities";

function asKonvaRect(node: Konva.Node): Konva.Rect {
  return node as Konva.Rect;
}

function asKonvaEllipse(node: Konva.Node): Konva.Ellipse {
  return node as Konva.Ellipse;
}

function asKonvaImage(node: Konva.Node): Konva.Image {
  return node as Konva.Image;
}

type KonvaShapeAnnotation =
  | LineAnnotation
  | RectAnnotation
  | EllipseAnnotation
  | ImageAnnotation;

type DraftShape =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "ellipse"; x: number; y: number; width: number; height: number };

interface Props {
  pageNumber: number;
  stageWidth: number;
  stageHeight: number;
  annotations: TemplateAnnotation[];
  annotationAssetUrls: Record<string, string>;
  selectedId: string | null;
  shapeDrawTool: ShapeDrawTool | null;
  createShapeLabel: (kind: ShapeDrawTool) => string;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
  onChange: (next: TemplateAnnotation) => void;
  onShapeDrawToolChange: (tool: ShapeDrawTool | null) => void;
  hidden?: boolean;
}

function isKonvaShape(a: TemplateAnnotation): a is KonvaShapeAnnotation {
  return (
    isLineAnnotation(a) ||
    isRectAnnotation(a) ||
    isEllipseAnnotation(a) ||
    isImageAnnotation(a)
  );
}

export const AnnotationKonvaLayer: React.FC<Props> = ({
  pageNumber,
  stageWidth,
  stageHeight,
  annotations,
  annotationAssetUrls,
  selectedId,
  shapeDrawTool,
  createShapeLabel,
  onSelect,
  onClearSelection,
  onChange,
  onShapeDrawToolChange,
  hidden = false,
}) => {
  const selectShape = useCallback(
    (id: string) => {
      onSelect(id);
      onShapeDrawToolChange(null);
    },
    [onSelect, onShapeDrawToolChange],
  );
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedNodeRef = useRef<Konva.Node | null>(null);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<DraftShape | null>(null);
  const [loadedImages, setLoadedImages] = useState<
    Record<string, HTMLImageElement>
  >({});

  const pageShapes = useMemo(
    () => annotations.filter(isKonvaShape).filter((a) => a.page === pageNumber),
    [annotations, pageNumber],
  );

  const selectedShape = useMemo(
    () => pageShapes.find((a) => a.id === selectedId) ?? null,
    [pageShapes, selectedId],
  );
  const selectedIsImage =
    selectedShape != null && isImageAnnotation(selectedShape);

  useEffect(() => {
    const pendingUrls = pageShapes
      .filter(isImageAnnotation)
      .map((ann) => annotationAssetUrls[ann.assetId])
      .filter((url): url is string => !!url && !loadedImages[url]);
    if (!pendingUrls.length) return;
    let cancelled = false;
    for (const url of pendingUrls) {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (cancelled) return;
        setLoadedImages((prev) => ({ ...prev, [url]: image }));
      };
      image.src = url;
    }
    return () => {
      cancelled = true;
    };
  }, [annotationAssetUrls, loadedImages, pageShapes]);

  useEffect(() => {
    const tr = transformerRef.current;
    if (!tr) return;
    if (
      selectedShape &&
      (isRectAnnotation(selectedShape) ||
        isEllipseAnnotation(selectedShape) ||
        isImageAnnotation(selectedShape)) &&
      selectedNodeRef.current
    ) {
      tr.nodes([selectedNodeRef.current]);
      tr.getLayer()?.batchDraw();
      return;
    }
    tr.nodes([]);
    tr.getLayer()?.batchDraw();
  }, [selectedShape, selectedId, stageWidth, stageHeight]);

  const commitDraft = useCallback(
    (shape: DraftShape) => {
      const id = crypto.randomUUID();
      let ann: KonvaShapeAnnotation;

      const label = createShapeLabel(shape.kind);

      if (shape.kind === "line") {
        ann = normalizeTemplateAnnotation({
          id,
          page: pageNumber,
          type: TEMPLATE_ANNOTATION_TYPES.LINE,
          label,
          x1: shape.x1,
          y1: shape.y1,
          x2: shape.x2,
          y2: shape.y2,
          stroke: DEFAULT_SHAPE_STROKE,
          strokeWidth: DEFAULT_LINE_STROKE_WIDTH,
        }) as LineAnnotation;
      } else if (shape.kind === "rect") {
        ann = normalizeTemplateAnnotation({
          id,
          page: pageNumber,
          type: TEMPLATE_ANNOTATION_TYPES.RECT,
          label,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          stroke: DEFAULT_SHAPE_STROKE,
          strokeWidth: DEFAULT_SHAPE_STROKE_WIDTH,
          fill: null,
        }) as RectAnnotation;
      } else {
        ann = normalizeTemplateAnnotation({
          id,
          page: pageNumber,
          type: TEMPLATE_ANNOTATION_TYPES.ELLIPSE,
          label,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          stroke: DEFAULT_SHAPE_STROKE,
          strokeWidth: DEFAULT_SHAPE_STROKE_WIDTH,
          fill: null,
        }) as EllipseAnnotation;
      }

      onChange(ann);
      selectShape(ann.id);
      onShapeDrawToolChange(null);
    },
    [
      createShapeLabel,
      onChange,
      onShapeDrawToolChange,
      pageNumber,
      selectShape,
    ],
  );

  const handleStagePointerDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (hidden || stageWidth <= 0 || stageHeight <= 0) return;
      if (!isShapeDrawTool(shapeDrawTool)) return;
      if (e.target !== e.target.getStage()) return;

      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;

      drawStartRef.current = { x: pos.x, y: pos.y };
      if (shapeDrawTool === "line") {
        setDraft({
          kind: "line",
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y,
        });
      } else {
        setDraft({
          kind: shapeDrawTool,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
        });
      }
    },
    [shapeDrawTool, hidden, stageHeight, stageWidth],
  );

  const handleStagePointerMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const start = drawStartRef.current;
      if (!start || !isShapeDrawTool(shapeDrawTool)) return;

      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;

      if (shapeDrawTool === "line") {
        setDraft({
          kind: "line",
          x1: start.x,
          y1: start.y,
          x2: pos.x,
          y2: pos.y,
        });
        return;
      }

      const left = Math.min(start.x, pos.x);
      const top = Math.min(start.y, pos.y);
      setDraft({
        kind: shapeDrawTool,
        x: left,
        y: top,
        width: Math.abs(pos.x - start.x),
        height: Math.abs(pos.y - start.y),
      });
    },
    [shapeDrawTool],
  );

  const handleStagePointerUp = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const start = drawStartRef.current;
      drawStartRef.current = null;
      if (!start || !isShapeDrawTool(shapeDrawTool)) {
        setDraft(null);
        return;
      }

      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) {
        setDraft(null);
        return;
      }

      const dist = Math.hypot(pos.x - start.x, pos.y - start.y);
      if (dist < 4) {
        setDraft(null);
        return;
      }

      if (shapeDrawTool === "line") {
        const line = lineFromStageDrag(
          start.x,
          start.y,
          pos.x,
          pos.y,
          stageWidth,
          stageHeight,
        );
        commitDraft({
          kind: "line",
          x1: line.x1,
          y1: line.y1,
          x2: line.x2,
          y2: line.y2,
        });
      } else {
        const bbox = bboxFromStageDrag(
          start.x,
          start.y,
          pos.x,
          pos.y,
          stageWidth,
          stageHeight,
        );
        commitDraft({
          kind: shapeDrawTool,
          ...bbox,
        });
      }

      setDraft(null);
    },
    [shapeDrawTool, commitDraft, stageHeight, stageWidth],
  );

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (isShapeDrawTool(shapeDrawTool)) return;
      if (e.target !== e.target.getStage()) return;
      onClearSelection();
    },
    [shapeDrawTool, onClearSelection],
  );

  if (hidden || stageWidth <= 0 || stageHeight <= 0) {
    return null;
  }

  const cursor = isShapeDrawTool(shapeDrawTool) ? "crosshair" : "default";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-8"
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      <Stage
        className="pointer-events-auto"
        width={stageWidth}
        height={stageHeight}
        style={{ cursor }}
        onMouseDown={handleStagePointerDown}
        onMouseMove={handleStagePointerMove}
        onMouseUp={handleStagePointerUp}
        onTouchStart={handleStagePointerDown}
        onTouchMove={handleStagePointerMove}
        onTouchEnd={handleStagePointerUp}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {pageShapes.map((ann) => {
            if (isLineAnnotation(ann)) {
              const p1 = normPointToStage(
                ann.x1,
                ann.y1,
                stageWidth,
                stageHeight,
              );
              const p2 = normPointToStage(
                ann.x2,
                ann.y2,
                stageWidth,
                stageHeight,
              );
              const strokeW = strokeNormToStage(ann.strokeWidth, stageWidth);
              const lineStrokeVisible = !isTransparentShapeStroke(ann.stroke);

              return (
                <Line
                  key={ann.id}
                  id={ann.id}
                  points={[p1.x, p1.y, p2.x, p2.y]}
                  stroke={lineStrokeVisible ? ann.stroke : "rgba(0,0,0,0)"}
                  strokeWidth={lineStrokeVisible ? strokeW : 0}
                  hitStrokeWidth={Math.max(12, strokeW * 3)}
                  draggable
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onTap={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onDragEnd={(ev) => {
                    const node = ev.target as Konva.Line;
                    const dx = node.x();
                    const dy = node.y();
                    node.position({ x: 0, y: 0 });
                    const n1 = stagePointToNorm(
                      p1.x + dx,
                      p1.y + dy,
                      stageWidth,
                      stageHeight,
                    );
                    const n2 = stagePointToNorm(
                      p2.x + dx,
                      p2.y + dy,
                      stageWidth,
                      stageHeight,
                    );
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x1: n1.x,
                        y1: n1.y,
                        x2: n2.x,
                        y2: n2.y,
                      }),
                    );
                  }}
                />
              );
            }

            if (isRectAnnotation(ann)) {
              const pos = normPointToStage(
                ann.x,
                ann.y,
                stageWidth,
                stageHeight,
              );
              const size = normSizeToStage(
                ann.width,
                ann.height,
                stageWidth,
                stageHeight,
              );
              const strokeW = strokeNormToStage(
                ann.strokeWidth ?? DEFAULT_SHAPE_STROKE_WIDTH,
                stageWidth,
              );
              const isSelected = ann.id === selectedId;
              const strokeVisible = !isTransparentShapeStroke(ann.stroke);

              return (
                <Rect
                  key={ann.id}
                  ref={
                    isSelected
                      ? (node) => {
                          selectedNodeRef.current = node;
                        }
                      : undefined
                  }
                  x={pos.x}
                  y={pos.y}
                  width={size.width}
                  height={size.height}
                  stroke={
                    strokeVisible
                      ? (ann.stroke ?? DEFAULT_SHAPE_STROKE)
                      : "transparent"
                  }
                  strokeWidth={strokeW}
                  strokeEnabled={strokeVisible}
                  fill={ann.fill ?? "transparent"}
                  draggable
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onTap={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onDragEnd={(ev) => {
                    const node = asKonvaRect(ev.target);
                    const norm = stagePointToNorm(
                      node.x(),
                      node.y(),
                      stageWidth,
                      stageHeight,
                    );
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x: norm.x,
                        y: norm.y,
                      }),
                    );
                  }}
                  onTransformEnd={(ev) => {
                    const node = asKonvaRect(ev.target);
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    const norm = stagePointToNorm(
                      node.x(),
                      node.y(),
                      stageWidth,
                      stageHeight,
                    );
                    const normSize = {
                      width: (node.width() * scaleX) / stageWidth,
                      height: (node.height() * scaleY) / stageHeight,
                    };
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x: norm.x,
                        y: norm.y,
                        width: Math.max(0.01, normSize.width),
                        height: Math.max(0.01, normSize.height),
                      }),
                    );
                  }}
                />
              );
            }

            if (isEllipseAnnotation(ann)) {
              const pos = normPointToStage(
                ann.x,
                ann.y,
                stageWidth,
                stageHeight,
              );
              const size = normSizeToStage(
                ann.width,
                ann.height,
                stageWidth,
                stageHeight,
              );
              const cx = pos.x + size.width / 2;
              const cy = pos.y + size.height / 2;
              const strokeW = strokeNormToStage(
                ann.strokeWidth ?? DEFAULT_SHAPE_STROKE_WIDTH,
                stageWidth,
              );
              const isSelected = ann.id === selectedId;
              const strokeVisible = !isTransparentShapeStroke(ann.stroke);

              return (
                <Ellipse
                  key={ann.id}
                  ref={
                    isSelected
                      ? (node) => {
                          selectedNodeRef.current = node;
                        }
                      : undefined
                  }
                  x={cx}
                  y={cy}
                  radiusX={size.width / 2}
                  radiusY={size.height / 2}
                  stroke={
                    strokeVisible
                      ? (ann.stroke ?? DEFAULT_SHAPE_STROKE)
                      : "transparent"
                  }
                  strokeWidth={strokeW}
                  strokeEnabled={strokeVisible}
                  fill={ann.fill ?? "transparent"}
                  draggable
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onTap={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onDragEnd={(ev) => {
                    const node = asKonvaEllipse(ev.target);
                    const rx = node.radiusX();
                    const ry = node.radiusY();
                    const normCenter = stagePointToNorm(
                      node.x(),
                      node.y(),
                      stageWidth,
                      stageHeight,
                    );
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x: normCenter.x - rx / stageWidth,
                        y: normCenter.y - ry / stageHeight,
                        width: (rx * 2) / stageWidth,
                        height: (ry * 2) / stageHeight,
                      }),
                    );
                  }}
                  onTransformEnd={(ev) => {
                    const node = asKonvaEllipse(ev.target);
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    const rx = node.radiusX() * scaleX;
                    const ry = node.radiusY() * scaleY;
                    const normCenter = stagePointToNorm(
                      node.x(),
                      node.y(),
                      stageWidth,
                      stageHeight,
                    );
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x: normCenter.x - rx / stageWidth,
                        y: normCenter.y - ry / stageHeight,
                        width: (rx * 2) / stageWidth,
                        height: (ry * 2) / stageHeight,
                      }),
                    );
                  }}
                />
              );
            }

            if (isImageAnnotation(ann)) {
              const pos = normPointToStage(
                ann.x,
                ann.y,
                stageWidth,
                stageHeight,
              );
              const size = normSizeToStage(
                ann.width,
                ann.height,
                stageWidth,
                stageHeight,
              );
              const imageUrl = annotationAssetUrls[ann.assetId];
              const image = imageUrl ? loadedImages[imageUrl] : undefined;
              const isSelected = ann.id === selectedId;

              return (
                <KonvaImage
                  key={ann.id}
                  ref={
                    isSelected
                      ? (node) => {
                          selectedNodeRef.current = node;
                        }
                      : undefined
                  }
                  x={pos.x}
                  y={pos.y}
                  width={size.width}
                  height={size.height}
                  image={image}
                  draggable
                  onClick={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onTap={(ev) => {
                    ev.cancelBubble = true;
                    selectShape(ann.id);
                  }}
                  onDragEnd={(ev) => {
                    const node = asKonvaImage(ev.target);
                    const norm = stagePointToNorm(
                      node.x(),
                      node.y(),
                      stageWidth,
                      stageHeight,
                    );
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x: norm.x,
                        y: norm.y,
                      }),
                    );
                  }}
                  onTransformEnd={(ev) => {
                    const node = asKonvaImage(ev.target);
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    const norm = stagePointToNorm(
                      node.x(),
                      node.y(),
                      stageWidth,
                      stageHeight,
                    );
                    const normSize = {
                      width: (node.width() * scaleX) / stageWidth,
                      height: (node.height() * scaleY) / stageHeight,
                    };
                    onChange(
                      normalizeTemplateAnnotation({
                        ...ann,
                        x: norm.x,
                        y: norm.y,
                        width: Math.max(0.01, normSize.width),
                        height: Math.max(0.01, normSize.height),
                      }),
                    );
                  }}
                />
              );
            }

            return null;
          })}

          {selectedShape && isLineAnnotation(selectedShape) ? (
            <>
              {(
                [
                  { key: "p1", nx: selectedShape.x1, ny: selectedShape.y1 },
                  { key: "p2", nx: selectedShape.x2, ny: selectedShape.y2 },
                ] as const
              ).map((pt) => {
                const stagePt = normPointToStage(
                  pt.nx,
                  pt.ny,
                  stageWidth,
                  stageHeight,
                );
                return (
                  <Circle
                    key={pt.key}
                    x={stagePt.x}
                    y={stagePt.y}
                    radius={6}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth={2}
                    draggable
                    onDragMove={(ev) => {
                      const node = ev.target;
                      const norm = stagePointToNorm(
                        node.x(),
                        node.y(),
                        stageWidth,
                        stageHeight,
                      );
                      onChange(
                        normalizeTemplateAnnotation({
                          ...selectedShape,
                          ...(pt.key === "p1"
                            ? { x1: norm.x, y1: norm.y }
                            : { x2: norm.x, y2: norm.y }),
                        }),
                      );
                    }}
                  />
                );
              })}
            </>
          ) : null}

          {draft?.kind === "line" ? (
            <Line
              points={[draft.x1, draft.y1, draft.x2, draft.y2]}
              stroke={DEFAULT_SHAPE_STROKE}
              strokeWidth={strokeNormToStage(
                DEFAULT_LINE_STROKE_WIDTH,
                stageWidth,
              )}
              dash={[6, 4]}
              listening={false}
            />
          ) : null}

          {draft && draft.kind === "rect" ? (
            <Rect
              x={draft.x}
              y={draft.y}
              width={draft.width}
              height={draft.height}
              stroke={DEFAULT_SHAPE_STROKE}
              strokeWidth={strokeNormToStage(
                DEFAULT_SHAPE_STROKE_WIDTH,
                stageWidth,
              )}
              dash={[6, 4]}
              listening={false}
            />
          ) : null}

          {draft && draft.kind === "ellipse" ? (
            <Ellipse
              x={draft.x + draft.width / 2}
              y={draft.y + draft.height / 2}
              radiusX={Math.max(draft.width / 2, 1)}
              radiusY={Math.max(draft.height / 2, 1)}
              stroke={DEFAULT_SHAPE_STROKE}
              strokeWidth={strokeNormToStage(
                DEFAULT_SHAPE_STROKE_WIDTH,
                stageWidth,
              )}
              dash={[6, 4]}
              listening={false}
            />
          ) : null}

          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            keepRatio={selectedIsImage}
            anchorSize={8}
            anchorCornerRadius={1}
            borderStroke="#2563eb"
            anchorStroke="#2563eb"
            anchorFill="#ffffff"
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 8 || newBox.height < 8) return oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};
