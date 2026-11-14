import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import type { Presentation } from "../../utilities/presentation";

export const usePresentationViewport = (
  presentation: Presentation,
  presenting: boolean,
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    toolbarHeight: 44,
  });
  const inset = presenting ? 0 : 16;
  const bottom = presenting ? 0 : viewport.toolbarHeight + 36;
  const availableWidth = Math.max(1, viewport.width - inset * 2);
  const availableHeight = Math.max(1, viewport.height - inset - bottom);
  const fit =
    viewport.width && viewport.height
      ? Math.min(
          availableWidth / presentation.width,
          availableHeight / presentation.height,
        )
      : 1;
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const toolbar = containerRef.current?.querySelector('[role="toolbar"]');
    const measure = () => {
      setViewport({
        width: Math.max(1, element.clientWidth),
        height: Math.max(1, element.clientHeight),
        toolbarHeight: toolbar?.clientHeight ?? 44,
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (toolbar) observer.observe(toolbar);
    measure();
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    viewportRef.current?.scrollTo({ left: 0, top: 0 });
  }, [presenting]);

  return { viewportRef, viewport, inset, bottom, fit };
};
