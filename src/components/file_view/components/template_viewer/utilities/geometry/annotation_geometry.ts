export const ANNOTATION_PADDING_PX = 6;
export const ANNOTATION_BORDER_PX = 1;
export const ANNOTATION_WIDTH_BUFFER_PX = 4;
export const ANNOTATION_LINE_HEIGHT = 1;

export function annotationPaddingScreen(pdfScale: number): number {
  const s = pdfScale > 0 ? pdfScale : 1;
  return ANNOTATION_PADDING_PX * s;
}

export function estimateAnnotationTextBoxNorm(params: {
  text: string;
  fontSizePx: number;
  fontFamily: string;
  pageWidthPx: number;
  pageHeightPx: number;
  pdfScale?: number;
  minWidth?: number;
  minHeight?: number;
}): { width: number; height: number } {
  const {
    text,
    fontSizePx,
    fontFamily,
    pageWidthPx,
    pageHeightPx,
    pdfScale = 1,
    minWidth = 0.06,
    minHeight = 0.02,
  } = params;
  const s = pdfScale > 0 ? pdfScale : 1;
  if (pageWidthPx <= 0 || pageHeightPx <= 0) {
    return { width: minWidth, height: minHeight };
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let textW = Math.max(1, text.length) * fontSizePx * 0.55;
  if (ctx != null) {
    ctx.font = `${fontSizePx}px ${fontFamily}`;
    textW = ctx.measureText(text).width;
  }
  const contentW = textW + ANNOTATION_WIDTH_BUFFER_PX * s;
  const contentH = fontSizePx * ANNOTATION_LINE_HEIGHT;
  return {
    width: Math.min(1, Math.max(minWidth, contentW / pageWidthPx)),
    height: Math.min(1, Math.max(minHeight, contentH / pageHeightPx)),
  };
}
