import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

export interface AutomaticPagesOptions {
  viewportRef: RefObject<HTMLDivElement | null>;
  identity: string;
  itemCount: number;
  enabled?: boolean;
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  loadMore: () => Promise<void>;
}

export const useAutomaticPages = (options: AutomaticPagesOptions) => {
  const latest = useRef(options);
  useLayoutEffect(() => {
    latest.current = options;
  });
  const {
    viewportRef,
    identity,
    itemCount,
    enabled = true,
    hasMore,
    isLoading,
    isError,
  } = options;
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!enabled || (!viewport && itemCount > 0)) return;
    let active = true;
    let inFlight = false;
    const loadIfNeeded = () => {
      const current = latest.current;
      if (
        !active ||
        inFlight ||
        !current.hasMore ||
        current.isLoading ||
        current.isError
      )
        return;
      if (viewport) {
        const remaining =
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
        if (remaining > Math.max(128, viewport.clientHeight / 2)) return;
      }
      inFlight = true;
      void current
        .loadMore()
        .catch(() => undefined)
        .finally(() => {
          inFlight = false;
        });
    };
    const observer =
      viewport && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(loadIfNeeded)
        : undefined;
    if (viewport) {
      viewport.addEventListener("scroll", loadIfNeeded, { passive: true });
      observer?.observe(viewport);
      if (viewport.firstElementChild)
        observer?.observe(viewport.firstElementChild);
    }
    loadIfNeeded();
    return () => {
      active = false;
      observer?.disconnect();
      viewport?.removeEventListener("scroll", loadIfNeeded);
    };
  }, [viewportRef, identity, itemCount, enabled, hasMore, isLoading, isError]);
};
