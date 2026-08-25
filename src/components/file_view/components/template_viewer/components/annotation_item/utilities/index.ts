export function parseTranslatePx(transform: string): { x: number; y: number } {
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

export function measureProseMirrorContentLogicalPx(
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
