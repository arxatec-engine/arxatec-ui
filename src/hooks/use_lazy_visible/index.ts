import { useCallback, useEffect, useRef, useState } from "react";
export interface LazyVisibleOptions {
  margin?: number;
}
export function useLazyVisible(
  enabled: boolean,
  { margin = 200 }: LazyVisibleOptions = {},
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!node || !enabled || isVisible) return;
      const rect = node.getBoundingClientRect();
      const withinViewport =
        rect.bottom > -margin &&
        rect.top < window.innerHeight + margin &&
        rect.right > -margin &&
        rect.left < window.innerWidth + margin;
      if (withinViewport || typeof IntersectionObserver === "undefined") {
        setIsVisible(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: margin + "px" },
      );
      observerRef.current = observer;
      observer.observe(node);
    },
    [enabled, isVisible, margin],
  );
  useEffect(() => () => observerRef.current?.disconnect(), []);
  return { containerRef, isVisible };
}
