import { useEffect, useRef, useState } from "react";

export const useThumbnailVisibility = (index: number, active: boolean) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(index < 3);
  useEffect(() => {
    const button = buttonRef.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        root: button.closest('[data-slot="scroll-area-viewport"]'),
        rootMargin: "160px",
      },
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (active)
      buttonRef.current?.scrollIntoView?.({
        block: "nearest",
        inline: "nearest",
      });
  }, [active]);
  return { buttonRef, visible };
};
