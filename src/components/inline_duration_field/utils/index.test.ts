import { describe, expect, it, vi } from "vitest";
import {
  attachWheelScroll,
  durationToParts,
  formatDurationLabel,
  getScrollViewport,
  hourValues,
  minuteValues,
  partsToSeconds,
} from "@/components/inline_duration_field/utils";

describe("inline_duration_field/utils", () => {
  it("should split seconds into hours and minutes", () => {
    expect(durationToParts(5400)).toEqual({ hours: 1, minutes: 30 });
    expect(durationToParts(59)).toEqual({ hours: 0, minutes: 0 });
    expect(durationToParts(0)).toEqual({ hours: 0, minutes: 0 });
  });

  it("should ignore leftover seconds below a minute", () => {
    expect(durationToParts(90)).toEqual({ hours: 0, minutes: 1 });
  });

  it("should combine hours and minutes into seconds", () => {
    expect(partsToSeconds(1, 30)).toBe(5400);
    expect(partsToSeconds(0, 15)).toBe(900);
    expect(partsToSeconds(-1, -10)).toBe(0);
  });

  it("should format a duration for the trigger", () => {
    expect(formatDurationLabel(0)).toBe("");
    expect(formatDurationLabel(900)).toBe("15m");
    expect(formatDurationLabel(3600)).toBe("1h");
    expect(formatDurationLabel(5400)).toBe("1h 30m");
  });

  it("should list hours up to the current value when it exceeds the default max", () => {
    expect(hourValues(0)).toHaveLength(24);
    expect(hourValues(30).at(-1)).toBe(30);
  });

  it("should list every minute of an hour", () => {
    expect(minuteValues()).toHaveLength(60);
    expect(minuteValues().at(-1)).toBe(59);
  });

  it("should prefer the ScrollArea viewport when it is present", () => {
    const root = document.createElement("div");
    const viewport = document.createElement("div");
    viewport.setAttribute("data-slot", "scroll-area-viewport");
    root.append(viewport);

    expect(getScrollViewport(root)).toBe(viewport);
    expect(getScrollViewport(document.createElement("div"))).toBeInstanceOf(
      HTMLDivElement,
    );
  });

  it("should move scrollTop with the wheel and stop the event from bubbling", () => {
    const node = document.createElement("div");
    let scrollTop = 0;
    Object.defineProperty(node, "scrollTop", {
      configurable: true,
      get: () => scrollTop,
      set: (next) => {
        scrollTop = next;
      },
    });

    const parent = document.createElement("div");
    parent.append(node);
    const parentWheel = vi.fn();
    parent.addEventListener("wheel", parentWheel);

    const detach = attachWheelScroll(node);
    const event = new WheelEvent("wheel", {
      deltaY: 80,
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(scrollTop).toBe(80);
    expect(parentWheel).not.toHaveBeenCalled();
    detach();
  });
});
