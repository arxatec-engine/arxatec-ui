import { useCallback, useEffect, useRef, useState } from "react";

export function usePresentationMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useRef(false);
  const nativeFullscreen = useRef(false);
  const restoreFocus = useRef(false);
  const [presenting, setPresenting] = useState(false);

  const exit = useCallback(() => {
    active.current = false;
    setPresenting(false);
    if (document.fullscreenElement === containerRef.current)
      void document.exitFullscreen?.().catch(() => undefined);
  }, []);

  const enter = () => {
    const container = containerRef.current;
    if (!container) return;
    active.current = true;
    restoreFocus.current = true;
    setPresenting(true);
    // Keep presentation navigation usable in browsers/embeds without fullscreen.
    if (container.requestFullscreen)
      void container
        .requestFullscreen()
        .then(() => {
          // A source change or early exit may happen during the request.
          if (!active.current && document.fullscreenElement === container)
            void document.exitFullscreen?.().catch(() => undefined);
        })
        .catch(() => undefined);
  };

  useEffect(() => {
    const container = containerRef.current;
    const changed = () => {
      if (document.fullscreenElement === container) {
        nativeFullscreen.current = true;
      } else if (nativeFullscreen.current) {
        nativeFullscreen.current = false;
        active.current = false;
        setPresenting(false);
      }
    };
    document.addEventListener("fullscreenchange", changed);
    return () => {
      active.current = false;
      document.removeEventListener("fullscreenchange", changed);
      if (container && document.fullscreenElement === container)
        void document.exitFullscreen?.().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (presenting) containerRef.current?.focus({ preventScroll: true });
    else if (restoreFocus.current) {
      restoreFocus.current = false;
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [presenting]);

  return { containerRef, toggleRef, presenting, enter, exit };
}
