function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function normPointToStage(
  nx: number,
  ny: number,
  stageW: number,
  stageH: number,
): { x: number; y: number } {
  return { x: nx * stageW, y: ny * stageH };
}

export function stagePointToNorm(
  sx: number,
  sy: number,
  stageW: number,
  stageH: number,
): { x: number; y: number } {
  if (stageW <= 0 || stageH <= 0) return { x: 0, y: 0 };
  return { x: clamp01(sx / stageW), y: clamp01(sy / stageH) };
}

export function normSizeToStage(
  nw: number,
  nh: number,
  stageW: number,
  stageH: number,
): { width: number; height: number } {
  return { width: nw * stageW, height: nh * stageH };
}

export function stageSizeToNorm(
  sw: number,
  sh: number,
  stageW: number,
  stageH: number,
): { width: number; height: number } {
  if (stageW <= 0 || stageH <= 0) return { width: 0.01, height: 0.01 };
  return {
    width: clamp01(sw / stageW),
    height: clamp01(sh / stageH),
  };
}

export function strokeNormToStage(strokeWidth: number, stageW: number): number {
  return Math.max(1, strokeWidth * stageW);
}

export function bboxFromStageDrag(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stageW: number,
  stageH: number,
): { x: number; y: number; width: number; height: number } {
  const left = Math.min(x0, x1);
  const top = Math.min(y0, y1);
  const width = Math.max(Math.abs(x1 - x0), 4);
  const height = Math.max(Math.abs(y1 - y0), 4);
  const normPos = stagePointToNorm(left, top, stageW, stageH);
  const normSize = stageSizeToNorm(width, height, stageW, stageH);
  return {
    x: normPos.x,
    y: normPos.y,
    width: Math.max(0.01, normSize.width),
    height: Math.max(0.01, normSize.height),
  };
}

export function lineFromStageDrag(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stageW: number,
  stageH: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const a = stagePointToNorm(x0, y0, stageW, stageH);
  const b = stagePointToNorm(x1, y1, stageW, stageH);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}
