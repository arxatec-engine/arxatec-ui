export const DEFAULT_SHAPE_STROKE = "#111827";
export const SHAPE_STROKE_TRANSPARENT = "transparent";

export function isTransparentShapeStroke(stroke?: string | null): boolean {
  return stroke?.trim().toLowerCase() === SHAPE_STROKE_TRANSPARENT;
}

export function normalizeShapeStroke(stroke?: string): string {
  const t = stroke?.trim();
  if (isTransparentShapeStroke(t)) return SHAPE_STROKE_TRANSPARENT;
  return t || DEFAULT_SHAPE_STROKE;
}
export const DEFAULT_LINE_STROKE_WIDTH = 0.003;
export const DEFAULT_SHAPE_STROKE_WIDTH = 0.002;

export const STROKE_WIDTH_PRESETS = [
  { label: "1 pt", value: 0.0016 },
  { label: "2 pt", value: 0.003 },
  { label: "5 pt", value: 0.008 },
  { label: "10 pt", value: 0.016 },
] as const;

export function nearestStrokePresetValue(norm: number): number {
  let best: number = STROKE_WIDTH_PRESETS[1].value;
  let min = Math.abs(norm - best);
  for (const p of STROKE_WIDTH_PRESETS) {
    const d = Math.abs(norm - p.value);
    if (d < min) {
      min = d;
      best = p.value;
    }
  }
  return best;
}
