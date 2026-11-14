import { StrictMode } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FilePptxPreviewViewer } from "./index";
import type { Presentation } from "./utilities/presentation";
import {
  readPresentation,
  readPresentationBlob,
  loadPresentationFonts,
  renderPresentationSlide,
} from "./utilities/presentation";

vi.mock("./utilities/presentation", () => ({
  readPresentation: vi.fn(),
  readPresentationBlob: vi.fn(async () => new ArrayBuffer(8)),
  loadPresentationFonts: vi.fn(async () => vi.fn()),
  renderPresentationSlide: vi.fn(
    (document: Presentation, index: number, id: string) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><text id="${id}text">${document.slides[index].notes}</text><a data-slide="2" role="link" tabindex="0"><text>Ir a datos</text></a></svg>`,
  ),
}));
vi.mock("../../utilities/download_from_url", () => ({
  downloadFromUrl: vi.fn(async () => undefined),
}));

const source = "https://files.test/download?id=12&token=a+b#slide=2";
function document(label = "Inicio", count = 3): Presentation {
  return {
    source: "pptx",
    width: 1280,
    height: 720,
    slides: Array.from({ length: count }, (_, index) => ({
      background: null,
      elements: [],
      notes: index === 0 ? label : `Datos ${index + 1}`,
      hidden: index === 2,
    })),
    dispose: vi.fn(),
  };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
const read = vi.mocked(readPresentation);
const renderSlide = vi.mocked(renderPresentationSlide);
const defaultRender = renderSlide.getMockImplementation()!;
const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  read.mockImplementation(async () => document());
  renderSlide.mockImplementation(defaultRender);
  globalThis.fetch = vi.fn(
    async () =>
      ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }) as Response,
  );
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});

function activeText(container: HTMLElement) {
  return container.querySelector("section [data-presentation-slide]")
    ?.shadowRoot?.textContent;
}

function mockFullscreen() {
  const dom = globalThis.document;
  let element: Element | null = null;
  const descriptors = (
    [
      [HTMLElement.prototype, "requestFullscreen"],
      [dom, "exitFullscreen"],
      [dom, "fullscreenElement"],
    ] as const
  ).map(([target, key]) => ({
    target,
    key,
    descriptor: Object.getOwnPropertyDescriptor(target, key),
  }));
  const change = (next: Element | null) => {
    element = next;
    fireEvent(dom, new Event("fullscreenchange"));
  };
  const request = vi.fn(async function (this: HTMLElement) {
    change(this);
  });
  const exit = vi.fn(async () => change(null));
  Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
    configurable: true,
    value: request,
  });
  Object.defineProperties(dom, {
    exitFullscreen: { configurable: true, value: exit },
    fullscreenElement: { configurable: true, get: () => element },
  });
  return {
    request,
    exit,
    change,
    restore: () => {
      for (const { target, key, descriptor } of descriptors) {
        if (descriptor) Object.defineProperty(target, key, descriptor);
        else Reflect.deleteProperty(target, key);
      }
    },
  };
}

describe("FilePptxPreviewViewer", () => {
  it("reads a local File without a network request and waits for the first slide", async () => {
    const file = new File(["pptx"], "Informe.pptx");
    const loading = vi.fn();
    const fonts = deferred<() => void>();
    vi.mocked(loadPresentationFonts).mockReturnValueOnce(fonts.promise);
    const { container, unmount } = render(
      <FilePptxPreviewViewer file={file} onLoadingChange={loading} />,
    );
    expect(loading).toHaveBeenLastCalledWith(true);
    await waitFor(() =>
      expect(readPresentationBlob).toHaveBeenCalledWith(
        file,
        expect.any(AbortSignal),
      ),
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    const dispose = vi.fn();
    await act(async () => fonts.resolve(dispose));
    await waitFor(() => expect(loading).toHaveBeenLastCalledWith(false));
    expect(activeText(container)).toContain("Inicio");
    expect(container.querySelector("iframe")).toBeNull();
    unmount();
    expect(dispose).toHaveBeenCalled();
  });

  it("preserves signed URL parameters and download callbacks", async () => {
    const download = vi.fn();
    render(<FilePptxPreviewViewer url={source} onDownload={download} />);
    await screen.findByRole("button", { name: "Descargar presentación" });
    expect(fetch).toHaveBeenCalledWith(source, {
      signal: expect.any(AbortSignal),
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Descargar presentación" }),
    );
    expect(download).toHaveBeenCalledOnce();
  });

  it("navigates by controls, thumbnails, keyboard and internal slide links", async () => {
    const { container } = render(<FilePptxPreviewViewer url={source} />);
    const previous = await screen.findByRole("button", {
      name: "Diapositiva anterior",
    });
    expect(previous).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Diapositiva siguiente" }),
    );
    await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
    fireEvent.click(screen.getByRole("button", { name: "Mostrar miniaturas" }));
    expect(
      screen.getByRole("button", { name: "Diapositiva 2" }),
    ).toHaveAttribute("aria-current", "page");
    fireEvent.click(
      screen.getByRole("button", { name: "Diapositiva 3, oculta" }),
    );
    await waitFor(() => expect(activeText(container)).toContain("Datos 3"));
    expect(
      screen.getByRole("button", { name: "Diapositiva siguiente" }),
    ).toBeDisabled();
    fireEvent.keyDown(
      screen.getByRole("region", { name: "Visor de presentación" }),
      { key: "Home" },
    );
    await waitFor(() => expect(activeText(container)).toContain("Inicio"));
    fireEvent.click(
      container
        .querySelector("section [data-presentation-slide]")!
        .shadowRoot!.querySelector("a")!,
    );
    await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
  });

  it("keeps the previous slide while images decode and discards a skipped slide", async () => {
    const image = deferred<void>();
    const decode = Object.getOwnPropertyDescriptor(Image.prototype, "decode");
    const decodeImage = vi.fn(() => image.promise);
    Object.defineProperty(Image.prototype, "decode", {
      configurable: true,
      value: decodeImage,
    });
    renderSlide.mockImplementation((presentation, index, prefix) => {
      const markup = defaultRender(presentation, index, prefix);
      return index === 1
        ? markup.replace("</svg>", '<image href="blob:pending-image"/></svg>')
        : markup;
    });
    try {
      const loading = vi.fn();
      const { container } = render(
        <FilePptxPreviewViewer url={source} onLoadingChange={loading} />,
      );
      await waitFor(() => expect(loading).toHaveBeenLastCalledWith(false));
      fireEvent.click(
        screen.getByRole("button", { name: "Diapositiva siguiente" }),
      );
      await waitFor(() => expect(decodeImage).toHaveBeenCalled());
      expect(activeText(container)).toContain("Inicio");
      expect(
        container.querySelector("section [data-presentation-slide]"),
      ).toHaveAttribute("aria-busy", "true");
      expect(loading).toHaveBeenLastCalledWith(false);
      fireEvent.click(
        screen.getByRole("button", { name: "Diapositiva siguiente" }),
      );
      await waitFor(() => expect(activeText(container)).toContain("Datos 3"));
      await act(async () => image.resolve());
      expect(activeText(container)).toContain("Datos 3");
      expect(
        container.querySelector("section [data-presentation-slide]"),
      ).toHaveAttribute("aria-busy", "false");
      expect(read).toHaveBeenCalledOnce();
    } finally {
      if (decode) Object.defineProperty(Image.prototype, "decode", decode);
      else Reflect.deleteProperty(Image.prototype, "decode");
    }
  });

  it("supports zoom and fit without parsing the file again", async () => {
    render(<FilePptxPreviewViewer url={source} />);
    const zoom = await screen.findByRole("button", { name: "Aumentar zoom" });
    for (let i = 0; i < 8; i++) fireEvent.click(zoom);
    expect(zoom).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Ajustar diapositiva" }),
    );
    expect(zoom).not.toBeDisabled();
    expect(read).toHaveBeenCalledOnce();
  });

  it.each(["file", "url"] as const)(
    "toggles thumbnails without losing navigation or zoom for %s",
    async (sourceKind) => {
      const props =
        sourceKind === "file"
          ? { file: new File(["pptx"], "Informe.pptx") }
          : { url: source };
      const { container } = render(<FilePptxPreviewViewer {...props} />);
      const zoom = await screen.findByRole("button", { name: "Aumentar zoom" });
      expect(
        screen.queryByRole("navigation", { name: "Diapositivas" }),
      ).toBeNull();
      const initialToggle = screen.getByRole("button", {
        name: "Mostrar miniaturas",
      });
      expect(initialToggle).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(initialToggle);
      for (let i = 0; i < 8; i++) fireEvent.click(zoom);
      const hide = screen.getByRole("button", { name: "Ocultar miniaturas" });
      expect(hide).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.getByRole("navigation", { name: "Diapositivas" }),
      ).toHaveAttribute("id", hide.getAttribute("aria-controls"));
      fireEvent.click(hide);
      expect(
        screen.queryByRole("navigation", { name: "Diapositivas" }),
      ).toBeNull();
      fireEvent.click(
        screen.getByRole("button", { name: "Diapositiva siguiente" }),
      );
      await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
      const show = screen.getByRole("button", { name: "Mostrar miniaturas" });
      expect(show).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(show);
      expect(
        screen.getByRole("button", { name: "Diapositiva 2" }),
      ).toHaveAttribute("aria-current", "page");
      expect(zoom).toBeDisabled();
      expect(read).toHaveBeenCalledOnce();
    },
  );

  it("presents the current slide, follows native fullscreen exits and restores viewer preferences", async () => {
    const fullscreen = mockFullscreen();
    const { container, unmount } = render(
      <FilePptxPreviewViewer url={source} />,
    );
    try {
      const viewer = await screen.findByRole("region", {
        name: "Visor de presentación",
      });
      fireEvent.click(
        screen.getByRole("button", { name: "Diapositiva siguiente" }),
      );
      const zoom = screen.getByRole("button", { name: "Aumentar zoom" });
      for (let i = 0; i < 8; i++) fireEvent.click(zoom);
      fireEvent.click(
        screen.getByRole("button", { name: "Iniciar presentación" }),
      );
      await waitFor(() =>
        expect(globalThis.document.fullscreenElement).toBe(viewer),
      );
      expect(viewer).toHaveAttribute("data-presentation-mode", "true");
      expect(viewer).toHaveFocus();
      expect(screen.queryByRole("navigation")).toBeNull();
      expect(
        screen.queryByRole("button", { name: "Aumentar zoom" }),
      ).toBeNull();
      await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
      const next = screen.getByRole("button", {
        name: "Diapositiva siguiente",
      });
      act(() => next.focus());
      fireEvent.click(next);
      expect(viewer).toHaveFocus();
      fireEvent.keyDown(viewer, { key: "ArrowLeft" });
      await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
      fireEvent.keyDown(viewer, { key: " " });
      await waitFor(() => expect(activeText(container)).toContain("Datos 3"));
      fireEvent.keyDown(viewer, { key: " ", shiftKey: true });
      await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
      act(() => fullscreen.change(null));
      expect(viewer).toHaveAttribute("data-presentation-mode", "false");
      expect(
        screen.getByRole("button", { name: "Iniciar presentación" }),
      ).toHaveFocus();
      expect(
        screen.getByRole("button", { name: "Aumentar zoom" }),
      ).toBeDisabled();
      expect(screen.queryByRole("navigation")).toBeNull();
      fireEvent.click(
        screen.getByRole("button", { name: "Mostrar miniaturas" }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Iniciar presentación" }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Salir de presentación" }),
      );
      await waitFor(() =>
        expect(globalThis.document.fullscreenElement).toBeNull(),
      );
      expect(fullscreen.exit).toHaveBeenCalledOnce();
      expect(
        screen.getByRole("button", { name: "Diapositiva 2" }),
      ).toHaveAttribute("aria-current", "page");
      expect(read).toHaveBeenCalledOnce();
    } finally {
      unmount();
      fullscreen.restore();
    }
  });

  it("keeps presentation navigation usable when fullscreen is denied and Escape does not close the parent", async () => {
    const fullscreen = mockFullscreen();
    fullscreen.request.mockRejectedValueOnce(new Error("Fullscreen denied"));
    const parentKey = vi.fn();
    const onError = vi.fn();
    const { container, unmount } = render(
      <div onKeyDown={parentKey}>
        <FilePptxPreviewViewer
          file={new File(["ppt"], "Informe.ppt")}
          onError={onError}
        />
      </div>,
    );
    try {
      fireEvent.click(
        await screen.findByRole("button", { name: "Iniciar presentación" }),
      );
      await act(async () => undefined);
      const viewer = screen.getByRole("region", {
        name: "Visor de presentación",
      });
      expect(viewer).toHaveAttribute("data-presentation-mode", "true");
      expect(globalThis.document.fullscreenElement).toBeNull();
      fireEvent.keyDown(viewer, { key: "ArrowRight" });
      await waitFor(() => expect(activeText(container)).toContain("Datos 2"));
      parentKey.mockClear();
      fireEvent.keyDown(viewer, { key: "Escape" });
      expect(parentKey).not.toHaveBeenCalled();
      expect(
        screen.queryByRole("navigation", { name: "Diapositivas" }),
      ).toBeNull();
      expect(onError).not.toHaveBeenCalled();
      expect(fullscreen.exit).not.toHaveBeenCalled();
    } finally {
      unmount();
      fullscreen.restore();
    }
  });

  it("releases fullscreen on source changes and also cancels a request that finishes after unmount", async () => {
    const fullscreen = mockFullscreen();
    const pending = deferred<void>();
    const { rerender, unmount } = render(
      <FilePptxPreviewViewer url={source} />,
    );
    try {
      fireEvent.click(
        await screen.findByRole("button", { name: "Iniciar presentación" }),
      );
      rerender(<FilePptxPreviewViewer url="blob:another" />);
      await screen.findByRole("button", { name: "Iniciar presentación" });
      expect(fullscreen.exit).toHaveBeenCalledOnce();
      expect(globalThis.document.fullscreenElement).toBeNull();
      fullscreen.request.mockImplementationOnce(function (this: HTMLElement) {
        return pending.promise.then(() => fullscreen.change(this));
      });
      fireEvent.click(
        screen.getByRole("button", { name: "Iniciar presentación" }),
      );
      unmount();
      await act(async () => pending.resolve());
      expect(fullscreen.exit).toHaveBeenCalledTimes(2);
      expect(globalThis.document.fullscreenElement).toBeNull();
    } finally {
      unmount();
      fullscreen.restore();
    }
  });

  it("clears failed loading, reports HTTP errors and retries", async () => {
    const onError = vi.fn();
    const loading = vi.fn();
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
    } as Response);
    render(
      <FilePptxPreviewViewer
        url={source}
        onError={onError}
        onLoadingChange={loading}
      />,
    );
    await screen.findByRole("alert");
    expect(onError.mock.calls[0][0].message).toContain("403");
    expect(loading).toHaveBeenLastCalledWith(false);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await screen.findByRole("button", { name: "Diapositiva siguiente" });
    await waitFor(() => expect(loading).toHaveBeenLastCalledWith(false));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("discards late renders, aborts old sources and disposes both documents", async () => {
    const old = document("Antiguo");
    const next = document("Nuevo");
    const pending = deferred<Presentation>();
    read.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(next);
    const onError = vi.fn();
    const { container, rerender, unmount } = render(
      <FilePptxPreviewViewer url={source} onError={onError} />,
    );
    await waitFor(() => expect(read).toHaveBeenCalledOnce());
    const signal = vi.mocked(fetch).mock.calls[0][1]!.signal!;
    rerender(<FilePptxPreviewViewer url="blob:next" onError={onError} />);
    await waitFor(() => expect(activeText(container)).toContain("Nuevo"));
    expect(signal.aborted).toBe(true);
    await act(async () => pending.resolve(old));
    expect(activeText(container)).toContain("Nuevo");
    expect(old.dispose).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    unmount();
    expect(next.dispose).toHaveBeenCalled();
  });

  it("resets slide and zoom on source changes and works in StrictMode", async () => {
    const { rerender } = render(
      <StrictMode>
        <FilePptxPreviewViewer url={source} />
      </StrictMode>,
    );
    fireEvent.click(
      await screen.findByRole("button", { name: "Diapositiva siguiente" }),
    );
    await screen.findByRole("region", { name: "Diapositiva 2 de 3" });
    rerender(
      <StrictMode>
        <FilePptxPreviewViewer url="blob:another" />
      </StrictMode>,
    );
    await screen.findByRole("region", { name: "Diapositiva 1 de 3" });
    expect(
      screen.getByRole("button", { name: "Diapositiva anterior" }),
    ).toBeDisabled();
  });

  it("does not parse offscreen slides just to build the thumbnail strip", async () => {
    const large = document("Inicio", 200);
    for (let index = 3; index < large.slides.length; index++)
      Object.defineProperty(large.slides, index, {
        get() {
          throw new Error("offscreen slide accessed");
        },
      });
    read.mockResolvedValueOnce(large);
    render(<FilePptxPreviewViewer url={source} />);
    fireEvent.click(
      await screen.findByRole("button", { name: "Mostrar miniaturas" }),
    );
    await screen.findByRole("button", { name: "Diapositiva 200" });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not fetch while pending or in an externally supplied error state", () => {
    const { rerender } = render(
      <FilePptxPreviewViewer
        url={source}
        isPending
        loadingOverlay={<span>Preparando archivo</span>}
      />,
    );
    expect(screen.getByText("Preparando archivo")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    rerender(<FilePptxPreviewViewer url={source} isError />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});

it("forwards consumer copy and styling to the rendered presentation", async () => {
  const { container } = render(
    <FilePptxPreviewViewer
      url={source}
      className="consumer-preview"
      labels={{
        toolbar: "Presentation controls",
        next: "Next slide",
        viewer: "Presentation viewer",
      }}
    />,
  );
  expect(
    await screen.findByRole("toolbar", { name: "Presentation controls" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next slide" })).toBeEnabled();
  expect(
    screen.getByRole("region", { name: "Presentation viewer" }),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-slot="file-pptx-preview-viewer"]'),
  ).toHaveClass("consumer-preview");
});
