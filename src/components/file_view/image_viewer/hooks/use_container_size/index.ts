import { useState, useRef, useEffect } from "react";

export const useContainerSize = () => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    containerSize,
    containerRef,
  };
};
