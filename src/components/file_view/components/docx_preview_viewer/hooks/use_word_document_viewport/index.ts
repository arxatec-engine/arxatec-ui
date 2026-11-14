import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export const useWordDocumentViewport = (
  hostRef: RefObject<HTMLDivElement | null>,
  loading: boolean,
  error: boolean,
  source: File | string | undefined,
  attempt: number,
) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    viewport: 0,
  });
  useEffect(() => {
    const viewport = viewportRef.current;
    const host = hostRef.current;
    if (!viewport || !host || loading || error) return;
    const measure = () =>
      setDimensions({
        width: host.offsetWidth,
        height: host.offsetHeight,
        viewport: viewport.clientWidth,
      });
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(host);
    measure();
    return () => observer.disconnect();
  }, [loading, error, source, attempt]);
  const fit =
    dimensions.width > 0 && dimensions.viewport > 0
      ? Math.min(1, dimensions.viewport / dimensions.width)
      : 1;
  return { viewportRef, dimensions, fit };
};
