import { DURATION_MAX_HOURS, DURATION_MAX_MINUTES } from "../constants";

export const durationToParts = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
  };
};

export const partsToSeconds = (hours: number, minutes: number) =>
  Math.max(0, hours) * 3600 + Math.max(0, minutes) * 60;

export const formatDurationLabel = (seconds: number) => {
  if (seconds <= 0) return "";
  const { hours, minutes } = durationToParts(seconds);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

export const hourValues = (currentHours = 0) =>
  Array.from(
    { length: Math.max(DURATION_MAX_HOURS, currentHours) + 1 },
    (_, index) => index,
  );

export const minuteValues = () =>
  Array.from({ length: DURATION_MAX_MINUTES + 1 }, (_, index) => index);

export const SCROLL_AREA_VIEWPORT_SELECTOR = "[data-slot=scroll-area-viewport]";

export const getScrollViewport = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(SCROLL_AREA_VIEWPORT_SELECTOR) ?? root;

export const attachWheelScroll = (node: HTMLElement) => {
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    node.scrollTop += event.deltaY;
  };

  node.addEventListener("wheel", onWheel, { passive: false });
  return () => node.removeEventListener("wheel", onWheel);
};
