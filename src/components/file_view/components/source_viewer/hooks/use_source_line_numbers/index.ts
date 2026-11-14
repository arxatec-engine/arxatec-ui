import { useEffect, useRef, useState } from "react";

export const useSourceLineNumbers = (content: string, fontSize: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [minimumLines, setMinimumLines] = useState(100);
  const sourceLineCount = content.split("\n").length;
  const totalLines = Math.max(minimumLines, sourceLineCount + 20);
  // An empty file has no highlighted row; its first number comes from the filler.
  const renderedLines = content ? sourceLineCount : 0;

  useEffect(() => {
    const container = containerRef.current;
    const firstLine = container?.querySelector<HTMLElement>(
      ".react-syntax-highlighter-line-number",
    );
    if (!container || !firstLine || typeof ResizeObserver === "undefined")
      return;

    const update = () => {
      const lineHeight = Number.parseFloat(
        getComputedStyle(firstLine).lineHeight,
      );
      if (lineHeight > 0) {
        // Bound auto-height parents so added rows cannot grow their own target.
        const height = Math.min(container.clientHeight, window.innerHeight);
        setMinimumLines(Math.max(100, Math.ceil(height / lineHeight) + 20));
      }
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(firstLine);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [content, fontSize]);

  return {
    containerRef,
    emptyLineStart: renderedLines + 1,
    emptyLineCount: totalLines - renderedLines,
  };
};
