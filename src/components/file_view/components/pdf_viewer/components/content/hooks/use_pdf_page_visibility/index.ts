import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ForwardedRef } from "react";
import { pdfjs } from "react-pdf";

import type { ContentHandle, PageDimensions } from "../../types";

export const usePdfPageVisibility = (
  ref: ForwardedRef<ContentHandle>,
  onVisiblePageChange: (page: number) => void,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageElementsRef = useRef(new Map<number, HTMLDivElement>());
  const visibleHeightsRef = useRef(new Map<number, number>());
  const spyObserverRef = useRef<IntersectionObserver | null>(null);
  const mountObserverRef = useRef<IntersectionObserver | null>(null);
  const onVisiblePageChangeRef = useRef(onVisiblePageChange);
  useEffect(() => {
    onVisiblePageChangeRef.current = onVisiblePageChange;
  }, [onVisiblePageChange]);

  const [renderedPages, setRenderedPages] = useState<Set<number>>(
    () => new Set([1, 2]),
  );
  const [pageDimensions, setPageDimensions] = useState<PageDimensions | null>(
    null,
  );

  const options = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visibleHeights = visibleHeightsRef.current;
        for (const entry of entries) {
          const page = Number((entry.target as HTMLElement).dataset.page);
          visibleHeights.set(
            page,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }
        let bestPage = 0;
        let bestHeight = 0;
        visibleHeights.forEach((height, page) => {
          if (
            height > bestHeight ||
            (height === bestHeight && height > 0 && page < bestPage)
          ) {
            bestHeight = height;
            bestPage = page;
          }
        });
        if (bestPage > 0) onVisiblePageChangeRef.current(bestPage);
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const mountObserver = new IntersectionObserver(
      (entries) => {
        setRenderedPages((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const page = Number((entry.target as HTMLElement).dataset.page);
            if (entry.isIntersecting) next.add(page);
            else next.delete(page);
          }
          return next;
        });
      },
      { root: container, rootMargin: "150% 0px" },
    );

    spyObserverRef.current = spyObserver;
    mountObserverRef.current = mountObserver;
    pageElementsRef.current.forEach((element) => {
      spyObserver.observe(element);
      mountObserver.observe(element);
    });

    return () => {
      spyObserver.disconnect();
      mountObserver.disconnect();
      spyObserverRef.current = null;
      mountObserverRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      scrollToPage: (page: number) => {
        const container = containerRef.current;
        const element = pageElementsRef.current.get(page);
        if (!container || !element) return;
        const top =
          element.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop -
          24;
        container.scrollTo({ top, behavior: "smooth" });
      },
    }),
    [],
  );

  const registerPageElement =
    (page: number) => (element: HTMLDivElement | null) => {
      const pageElements = pageElementsRef.current;
      const previous = pageElements.get(page);
      if (previous) {
        spyObserverRef.current?.unobserve(previous);
        mountObserverRef.current?.unobserve(previous);
      }
      if (element) {
        pageElements.set(page, element);
        spyObserverRef.current?.observe(element);
        mountObserverRef.current?.observe(element);
      } else {
        pageElements.delete(page);
        visibleHeightsRef.current.delete(page);
      }
    };

  return {
    containerRef,
    renderedPages,
    pageDimensions,
    setPageDimensions,
    registerPageElement,
    options,
  };
};
