import { useState } from "react";
import type { KeyboardEvent, RefObject } from "react";

interface Options {
  count: number;
  viewportRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  presenting: boolean;
  exit: () => void;
  reveal: () => void;
}

export const usePresentationNavigation = ({
  count,
  viewportRef,
  containerRef,
  presenting,
  exit,
  reveal,
}: Options) => {
  const [{ index, direction }, setSlide] = useState({ index: 0, direction: 1 });
  const select = (next: number) => {
    if (!Number.isInteger(next) || next < 0 || next >= count || next === index)
      return;
    setSlide({ index: next, direction: next > index ? 1 : -1 });
    viewportRef.current?.scrollTo({ left: 0, top: 0 });
  };

  const selectFromToolbar = (next: number) => {
    select(next);
    if (presenting) containerRef.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    reveal();
    if (presenting && event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      exit();
      return;
    }
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      (event.target as HTMLElement).closest(
        "input, textarea, select, [contenteditable=true]",
      )
    )
      return;
    if (
      presenting &&
      event.key === " " &&
      !(event.target as HTMLElement).closest("button, a, [role=link]")
    ) {
      event.preventDefault();
      select(index + (event.shiftKey ? -1 : 1));
      return;
    }
    const next = {
      ArrowRight: index + 1,
      PageDown: index + 1,
      ArrowLeft: index - 1,
      PageUp: index - 1,
      Home: 0,
      End: count - 1,
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      select(next);
    }
  };
  return { index, direction, select, selectFromToolbar, onKeyDown };
};
