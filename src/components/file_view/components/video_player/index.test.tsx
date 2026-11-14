import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";

import { FileVideoPlayer } from "./index";

const props = { url: "https://example.com/video.mp4", fileName: "video.mp4" };

const loadVideo = (container: HTMLElement, duration = 120) => {
  const video = container.querySelector("video")!;
  Object.defineProperty(video, "duration", {
    configurable: true,
    value: duration,
  });
  fireEvent.loadedMetadata(video);
  fireEvent.canPlay(video);
  return video;
};

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function () {
    Object.defineProperty(this, "paused", { configurable: true, value: false });
    this.dispatchEvent(new Event("playing"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function () {
    Object.defineProperty(this, "paused", { configurable: true, value: true });
    this.dispatchEvent(new Event("pause"));
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("floating video controls", () => {
  it("releases loading and renders translated copy when no URL is available", () => {
    const onLoadingChange = vi.fn();
    render(
      <FileVideoPlayer
        url=""
        onLoadingChange={onLoadingChange}
        labels={{ errorTitle: "Video unavailable" }}
      />,
    );
    expect(screen.getByText("Video unavailable")).toBeInTheDocument();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("plays and pauses the media from the toolbar", () => {
    const { container } = render(<FileVideoPlayer {...props} />);
    const toolbar = within(screen.getByRole("toolbar"));
    expect(toolbar.getByRole("button", { name: "Reproducir" })).toBeDisabled();
    const video = loadVideo(container);
    fireEvent.click(toolbar.getByRole("button", { name: "Reproducir" }));
    expect(video.play).toHaveBeenCalledOnce();
    fireEvent.click(toolbar.getByRole("button", { name: "Pausar" }));
    expect(video.pause).toHaveBeenCalledOnce();
    expect(toolbar.getByRole("button", { name: "Reproducir" })).toBeEnabled();
  });

  it("seeks with keyboard without taking arrow keys away from the sliders", () => {
    const { container } = render(<FileVideoPlayer {...props} />);
    const video = loadVideo(container);
    const region = screen.getByRole("region");
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(video.currentTime).toBe(5);
    const progress = screen.getByRole("slider", { name: "Progreso del video" });
    fireEvent.keyDown(progress, { key: "End" });
    expect(video.currentTime).toBe(120);
    expect(progress).toHaveAttribute("aria-valuetext", "2:00 / 2:00");
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(video.currentTime).toBe(120);
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(video.currentTime).toBe(115);
  });

  it("restores sound after lowering the volume to zero", () => {
    const { container } = render(<FileVideoPlayer {...props} />);
    const video = loadVideo(container);
    fireEvent.keyDown(screen.getByRole("slider", { name: "Volumen" }), {
      key: "Home",
    });
    expect(video.volume).toBe(0);
    expect(video.muted).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Activar sonido" }));
    expect(video.muted).toBe(false);
    expect(video.volume).toBeGreaterThan(0);
  });

  it("reports loading, buffering and terminal failures while preserving download", () => {
    const onLoadingChange = vi.fn();
    const onDownload = vi.fn();
    const { container, unmount } = render(
      <FileVideoPlayer
        {...props}
        onLoadingChange={onLoadingChange}
        onDownload={onDownload}
      />,
    );
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    const video = loadVideo(container);
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    fireEvent.waiting(video);
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    fireEvent.error(video);
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText("No se pudo cargar el video")).toBeInTheDocument();
    const toolbar = within(screen.getByRole("toolbar"));
    expect(toolbar.getByRole("button", { name: "Reproducir" })).toBeDisabled();
    fireEvent.click(toolbar.getByRole("button", { name: "Descargar video" }));
    expect(onDownload).toHaveBeenCalledOnce();
    unmount();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("tracks fullscreen for this player instead of unrelated elements", () => {
    render(<FileVideoPlayer {...props} />);
    const region = screen.getByRole("region");
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      value: document.body,
    });
    fireEvent(document, new Event("fullscreenchange"));
    expect(
      screen.getByRole("button", { name: "Pantalla completa" }),
    ).toBeInTheDocument();
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      value: region,
    });
    fireEvent(document, new Event("fullscreenchange"));
    expect(
      screen.getByRole("button", { name: "Salir de pantalla completa" }),
    ).toBeInTheDocument();
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      value: null,
    });
  });

  it("requests native fullscreen and keeps controls available when permission is denied", async () => {
    const error = vi.spyOn(toast, "error").mockImplementation(() => "error");
    render(
      <FileVideoPlayer
        {...props}
        labels={{ fullscreenError: "Fullscreen unavailable" }}
      />,
    );
    const requestFullscreen = vi
      .fn()
      .mockRejectedValue(new Error("not granted"));
    Object.defineProperty(screen.getByRole("region"), "requestFullscreen", {
      configurable: true,
      value: requestFullscreen,
    });
    fireEvent.click(screen.getByRole("button", { name: "Pantalla completa" }));
    await waitFor(() => expect(requestFullscreen).toHaveBeenCalledOnce());
    expect(error).toHaveBeenCalledWith("Fullscreen unavailable");
    expect(
      screen.getByRole("button", { name: "Pantalla completa" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Descargar video" }),
    ).toBeEnabled();
  });
});
