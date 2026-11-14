import { useCallback, useEffect, useRef, useState } from "react";

type PointerPosition = { clientX: number; clientY: number };

export const useVideoControlsVisibility = () => {
  const [controlsHidden, setControlsHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const activePointers = useRef(new Set<number>());
  const lastPosition = useRef<PointerPosition | null>(null);

  const clearControlsTimeout = useCallback(
    () => clearTimeout(timeout.current),
    [],
  );
  const scheduleHide = useCallback(() => {
    clearControlsTimeout();
    if (activePointers.current.size === 0) {
      timeout.current = setTimeout(() => setControlsHidden(true), 2500);
    }
  }, [clearControlsTimeout]);
  const resetControlsTimeout = useCallback(() => {
    setControlsHidden(false);
    scheduleHide();
  }, [scheduleHide]);
  const handlePointerMove = useCallback(
    (event: PointerPosition) => {
      const last = lastPosition.current;
      if (
        last &&
        last.clientX === event.clientX &&
        last.clientY === event.clientY
      )
        return;
      lastPosition.current = { clientX: event.clientX, clientY: event.clientY };
      resetControlsTimeout();
    },
    [resetControlsTimeout],
  );

  useEffect(() => {
    const releasePointer = (event: PointerEvent) => {
      if (activePointers.current.delete(event.pointerId))
        resetControlsTimeout();
    };
    const releaseAll = () => {
      activePointers.current.clear();
      scheduleHide();
    };
    scheduleHide();
    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);
    window.addEventListener("blur", releaseAll);
    return () => {
      clearControlsTimeout();
      activePointers.current.clear();
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("blur", releaseAll);
    };
  }, [scheduleHide, resetControlsTimeout, clearControlsTimeout]);

  return {
    showControls: !controlsHidden,
    isHovering,
    resetControlsTimeout,
    clearControlsTimeout,
    handlePointerMove,
    handlePointerDown: (event: PointerPosition & { pointerId: number }) => {
      activePointers.current.add(event.pointerId);
      lastPosition.current = { clientX: event.clientX, clientY: event.clientY };
      resetControlsTimeout();
    },
    handleMouseEnter: (event?: PointerPosition) => {
      setIsHovering(true);
      if (event) handlePointerMove(event);
      else resetControlsTimeout();
    },
    handleMouseLeave: (event?: PointerPosition) => {
      setIsHovering(false);
      if (event) handlePointerMove(event);
      else resetControlsTimeout();
    },
  };
};
