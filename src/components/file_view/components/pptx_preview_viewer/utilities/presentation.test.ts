import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { slideText } from "@web-ppt/core";

import {
  readPresentation,
  renderPresentationSlide,
  loadPresentationFonts,
} from "./presentation";
import { sanitizePresentationSvg } from "./sanitize";
import {
  resolvePresentationFormat,
  PPT_MIME,
  PPTX_MIME,
} from "../../../utilities/presentation_format";

const objectUrl = URL.createObjectURL;
const revokeUrl = URL.revokeObjectURL;
const fixture = (name: string) =>
  readFileSync(
    resolve(
      "src/components/file_view/components/pptx_preview_viewer/fixtures",
      name,
    ),
  );

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:fixture-asset");
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    measureText: (text: string) => ({ width: text.length * 8 }),
  } as unknown as CanvasRenderingContext2D);
});
afterEach(() => {
  URL.createObjectURL = objectUrl;
  URL.revokeObjectURL = revokeUrl;
  vi.restoreAllMocks();
});

describe("presentation format routing", () => {
  it.each([
    ["Diapositivas.PPTX?token=abc#slide=2", undefined, "pptx"],
    [
      "https://files.test/Informe.ppt?signature=123",
      "application/octet-stream",
      "ppt",
    ],
    ["download", ` ${PPTX_MIME.toUpperCase()}; charset=binary `, "pptx"],
    [undefined, PPT_MIME, "ppt"],
    ["Informe.pdf", "application/pdf", null],
  ])("recognizes %s / %s", (name, mime, expected) => {
    expect(resolvePresentationFormat(name, mime)).toBe(expected);
  });
});

describe("real PPTX and binary PPT", () => {
  it.each(["pptx", "ppt"])(
    "reads slide order, tables and images from %s bytes",
    async (extension) => {
      const bytes = fixture(`presentation.${extension}`);
      const document = await readPresentation(
        Uint8Array.from(bytes).buffer,
        new AbortController().signal,
      );
      expect(document.source).toBe(extension);
      expect(document.slides).toHaveLength(3);
      expect(document.width / document.height).toBeCloseTo(16 / 9);
      expect(slideText(document.slides[0])).toContain(
        "El diseño original, en nuestro visor",
      );
      expect(slideText(document.slides[1])).toContain("Documentos");
      expect(
        document.slides[1].elements.some((element) => element.kind === "table"),
      ).toBe(true);
      expect(document.slides[2].hidden).toBe(true);
      expect(
        document.slides[2].elements.some((element) => element.kind === "image"),
      ).toBe(true);
      const first = sanitizePresentationSvg(
        renderPresentationSlide(document, 0, "first-view-"),
      );
      expect(first.querySelector("svg")?.getAttribute("viewBox")).toBe(
        "0 0 1280 720",
      );
      expect(first.textContent).toContain("ARXATEC");
      expect(first.querySelector("foreignObject")).not.toBeNull();
      const chart = sanitizePresentationSvg(
        renderPresentationSlide(document, 1, "chart-view-"),
      );
      if (extension === "ppt") {
        expect(
          chart.querySelector('image[href^="data:image/svg+xml"]'),
        ).not.toBeNull();
      } else {
        expect(chart.textContent).toContain("DOCX");
        expect(chart.querySelectorAll("path, rect").length).toBeGreaterThan(3);
      }
      document.dispose?.();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    },
  );

  it("honors 4:3 dimensions", async () => {
    const bytes = fixture("presentation-4x3.pptx");
    const document = await readPresentation(
      Uint8Array.from(bytes).buffer,
      new AbortController().signal,
    );
    expect(document.width / document.height).toBeCloseTo(4 / 3);
    document.dispose?.();
  });

  it("rejects empty, invalid and cancelled input", async () => {
    const controller = new AbortController();
    await expect(
      readPresentation(new ArrayBuffer(0), controller.signal),
    ).rejects.toThrow("vacío");
    await expect(
      readPresentation(
        new TextEncoder().encode("invalid").buffer,
        controller.signal,
      ),
    ).rejects.toThrow();
    controller.abort();
    await expect(
      readPresentation(new ArrayBuffer(1), controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("namespaces gradients and clipping IDs across views", async () => {
    const bytes = fixture("presentation.pptx");
    const document = await readPresentation(
      Uint8Array.from(bytes).buffer,
      new AbortController().signal,
    );
    const a = sanitizePresentationSvg(
      renderPresentationSlide(document, 2, "a-"),
    );
    const b = sanitizePresentationSvg(
      renderPresentationSlide(document, 2, "b-"),
    );
    const ids = new Set(
      Array.from(a.querySelectorAll("[id]"), (node) => node.id),
    );
    expect(ids.size).toBeGreaterThan(0);
    for (const node of b.querySelectorAll("[id]"))
      expect(ids.has(node.id)).toBe(false);
    document.dispose?.();
  });

  it("isolates embedded font families between presentations and removes only its own faces", async () => {
    const originalFace = globalThis.FontFace;
    const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
    const faces = new Set<FontFace>();
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: faces,
    });
    globalThis.FontFace = class {
      constructor(readonly family: string) {}
      async load() {
        return this;
      }
    } as unknown as typeof FontFace;
    const bytes = Uint8Array.from(fixture("presentation.pptx")).buffer;
    const signal = new AbortController().signal;
    const a = await readPresentation(bytes, signal);
    const b = await readPresentation(bytes, signal);
    try {
      for (const presentation of [a, b])
        presentation.embeddedFonts = [
          { family: "Arial", src: "blob:font", bold: false, italic: false },
        ];
      const disposeA = await loadPresentationFonts(a, signal);
      const disposeB = await loadPresentationFonts(b, signal);
      const familyA = a.embeddedFonts![0].family;
      const familyB = b.embeddedFonts![0].family;
      expect(familyA).not.toBe(familyB);
      expect(faces.size).toBe(2);
      const textA = sanitizePresentationSvg(
        renderPresentationSlide(a, 0, "font-a-"),
      ).querySelector<HTMLElement>("foreignObject span");
      const textB = sanitizePresentationSvg(
        renderPresentationSlide(b, 0, "font-b-"),
      ).querySelector<HTMLElement>("foreignObject span");
      expect(textA?.style.fontFamily).toContain(familyA);
      expect(textB?.style.fontFamily).toContain(familyB);
      disposeA();
      expect(faces.size).toBe(1);
      expect([...faces][0].family).toBe(familyB);
      disposeB();
      expect(faces.size).toBe(0);
    } finally {
      a.dispose?.();
      b.dispose?.();
      if (originalFace) globalThis.FontFace = originalFace;
      else Reflect.deleteProperty(globalThis, "FontFace");
      if (originalFonts)
        Object.defineProperty(document, "fonts", originalFonts);
      else Reflect.deleteProperty(document, "fonts");
    }
  });
});

describe("presentation SVG boundary", () => {
  it("keeps rich text, filters, local images and slide links while removing active content", () => {
    const result =
      sanitizePresentationSvg(`<svg xmlns="http://www.w3.org/2000/svg">
      <script>alert(1)</script><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:24px">Texto <b>original</b><img src="blob:picture" onerror="alert(1)"/><iframe src="https://evil.test"></iframe></div></foreignObject>
      <a href="slide:1"><text>Ir a datos</text></a><a href="javascript:alert(1)"><text>Unsafe</text></a>
      <image href="https://evil.test/tracker"/><image href="data:image/png;base64,AA=="/>
      <rect style="fill:url(https://evil.test/a)"/><rect fill="url(#gradient)"/>
      <style>@import url('https://evil.test/font');</style><animate attributeName="href" values="javascript:alert(1)"/>
    </svg>`);
    expect(result.textContent).toContain("Texto original");
    expect(result.querySelector("foreignObject b")?.textContent).toBe(
      "original",
    );
    expect(result.querySelector("img")?.getAttribute("src")).toBe(
      "blob:picture",
    );
    expect(result.querySelector("a")?.getAttribute("href")).toBe("slide:1");
    expect(result.querySelector("a")?.getAttribute("rel")).toBe(
      "noopener noreferrer",
    );
    expect(
      result.querySelectorAll("script, iframe, animate, [onerror]"),
    ).toHaveLength(0);
    expect(
      result.querySelectorAll(
        '[href^="https://evil"], [href^="javascript:"], [style*="evil"]',
      ),
    ).toHaveLength(0);
    expect(result.textContent).not.toContain("@import");
    expect(result.querySelector('[fill="url(#gradient)"]')).not.toBeNull();
  });

  it("blocks CSS escapes and linked fonts without dropping local font faces", () => {
    const result = sanitizePresentationSvg(
      '<svg><style>@font-face{font-family:Local;src:url("blob:font")}</style><rect style="fill:u\\72l(https://evil.test/a)"/><style>@\\69mport "https://evil.test";</style></svg>',
    );
    expect(result.querySelector("style")?.textContent).toContain("blob:font");
    expect(result.querySelector("rect")?.hasAttribute("style")).toBe(false);
    expect(result.textContent).not.toContain("evil.test");
    const cssImages = sanitizePresentationSvg(
      '<svg><rect style="fill:url(https://evil.\\\ntest/a)"/><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" style="background:image-set(\'https://evil.test/a\' 1x)">Safe text</div></foreignObject></svg>',
    );
    expect(cssImages.querySelectorAll("[style]")).toHaveLength(0);
    expect(cssImages.textContent).toContain("Safe text");
  });
});
