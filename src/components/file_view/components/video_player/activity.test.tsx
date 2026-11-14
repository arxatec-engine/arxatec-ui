import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FileVideoPlayer } from "./index";

const props = { url: "https://example.com/video.mp4", fileName: "video.mp4" };

const loadVideo = (container: HTMLElement) => {
  const video = container.querySelector("video")!;
  Object.defineProperty(video, "duration", { configurable: true, value: 120 });
  fireEvent.loadedMetadata(video);
  fireEvent.canPlay(video);
  return video;
};

const firePointer = (
  target: Element | Window,
  type: string,
  clientX = 20,
  clientY = 20,
) => {
  const event = new MouseEvent(type, { bubbles: true, clientX, clientY });
  Object.defineProperty(event, "pointerId", { value: 1 });
  fireEvent(target, event);
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("video controls activity", () => {
  it("hides idle controls while paused and hovered, without waking on media events", () => {
    const { container } = render(<FileVideoPlayer {...props} />);
    const video = loadVideo(container);
    firePointer(screen.getByRole("region"), "pointerover");
    act(() => vi.advanceTimersByTime(3000));
    const overlay = container.querySelector(
      '[data-slot="video-controls-overlay"]',
    );
    expect(overlay).toHaveClass("opacity-0");
    fireEvent.playing(video);
    fireEvent.timeUpdate(video);
    fireEvent.pause(video);
    fireEvent.ended(video);
    expect(overlay).toHaveClass("opacity-0");
  });

  it("wakes on real pointer movement and extends visibility while activity continues", () => {
    const { container } = render(<FileVideoPlayer {...props} />);
    loadVideo(container);
    const region = screen.getByRole("region");
    const overlay = container.querySelector(
      '[data-slot="video-controls-overlay"]',
    );
    firePointer(region, "pointermove");
    act(() => vi.advanceTimersByTime(3000));
    firePointer(region, "pointermove");
    firePointer(region, "pointerout");
    firePointer(region, "pointerover");
    expect(overlay).toHaveClass("opacity-0");
    firePointer(region, "pointermove", 30);
    expect(overlay).toHaveClass("opacity-100");
    act(() => vi.advanceTimersByTime(1500));
    firePointer(region, "pointermove", 40);
    act(() => vi.advanceTimersByTime(1500));
    expect(overlay).toHaveClass("opacity-100");
    act(() => vi.advanceTimersByTime(1500));
    expect(overlay).toHaveClass("opacity-0");
  });

  it.each(["pointerup", "pointercancel", "blur"])(
    "holds controls during a gesture and releases on %s outside the player",
    (end) => {
      const { container } = render(<FileVideoPlayer {...props} />);
      loadVideo(container);
      firePointer(screen.getByRole("region"), "pointerdown");
      act(() => vi.advanceTimersByTime(5000));
      const overlay = container.querySelector(
        '[data-slot="video-controls-overlay"]',
      );
      expect(overlay).toHaveClass("opacity-100");
      if (end === "blur") fireEvent(window, new Event("blur"));
      else firePointer(window, end);
      act(() => vi.advanceTimersByTime(3000));
      expect(overlay).toHaveClass("opacity-0");
    },
  );

  it("wakes for keyboard focus and keys, then hides despite stationary focus", () => {
    const { container } = render(<FileVideoPlayer {...props} />);
    loadVideo(container);
    const overlay = container.querySelector(
      '[data-slot="video-controls-overlay"]',
    );
    act(() => vi.advanceTimersByTime(3000));
    expect(overlay).toHaveClass("opacity-0");
    const mute = screen.getByRole("button", { name: "Silenciar" });
    act(() => mute.focus());
    expect(overlay).toHaveClass("opacity-100");
    act(() => vi.advanceTimersByTime(3000));
    expect(overlay).toHaveClass("opacity-0");
    fireEvent.keyDown(mute, { key: "Shift" });
    expect(overlay).toHaveClass("opacity-100");
  });

  it("resets media and the initial visibility period when the URL changes", () => {
    const { container, rerender } = render(<FileVideoPlayer {...props} />);
    const video = loadVideo(container);
    act(() => vi.advanceTimersByTime(3000));
    rerender(<FileVideoPlayer {...props} url="https://example.com/otro.mp4" />);
    expect(container.querySelector("video")).not.toBe(video);
    expect(
      container.querySelector('[data-slot="video-controls-overlay"]'),
    ).toHaveClass("opacity-100");
    expect(
      within(screen.getByRole("toolbar")).getByRole("button", {
        name: "Reproducir",
      }),
    ).toBeDisabled();
  });
});
