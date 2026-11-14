import {
  parse,
  renderSlideToSvg,
  setFontDecoder,
  staticHidden,
  invalidateTextMeasureCaches,
  type Presentation,
  type TextBody,
} from "@web-ppt/core";
import { eotToTtf } from "mtx-decompressor";

export type { Presentation } from "@web-ppt/core";

let fontSequence = 0;
// FontFace registrations are document-wide, even when slides use Shadow DOM.
// Private aliases keep different embedded subsets from affecting another viewer.
const fontAliases = new WeakMap<Presentation, Map<string, string>>();

export async function readPresentation(
  bytes: ArrayBuffer,
  signal: AbortSignal,
): Promise<Presentation> {
  signal.throwIfAborted();
  if (!bytes.byteLength) throw new Error("El archivo está vacío.");
  setFontDecoder((font) => {
    try {
      return eotToTtf(font);
    } catch {
      return null;
    }
  });
  const presentation = await parse(bytes, { lazy: true });
  if (
    signal.aborted ||
    !presentation.slides.length ||
    !Number.isFinite(presentation.width) ||
    !Number.isFinite(presentation.height) ||
    presentation.width <= 0 ||
    presentation.height <= 0
  ) {
    presentation.dispose?.();
    signal.throwIfAborted();
    throw new Error("La presentación no contiene diapositivas válidas.");
  }
  return presentation;
}

export function renderPresentationSlide(
  presentation: Presentation,
  index: number,
  idPrefix: string,
): string {
  const slide = presentation.slides[index];
  if (!slide) throw new Error("No se encontró la diapositiva.");
  const aliases = fontAliases.get(presentation);
  const localizeText = (body: TextBody | null | undefined) => {
    if (!aliases?.size) return;
    for (const paragraph of body?.paragraphs ?? []) {
      if (paragraph.bulletFont)
        paragraph.bulletFont =
          aliases.get(paragraph.bulletFont.toLowerCase()) ??
          paragraph.bulletFont;
      for (const run of paragraph.runs) {
        run.fonts = [
          ...new Set(
            run.fonts.flatMap((family) => {
              const alias = aliases.get(family.toLowerCase());
              return alias ? [alias, family] : [family];
            }),
          ),
        ];
      }
    }
  };
  const localize = (elements: typeof slide.elements) => {
    for (const element of elements) {
      if (element.kind === "unsupported")
        element.label = "Contenido no compatible";
      if (element.kind === "group") localize(element.children);
      if (element.kind === "shape") localizeText(element.text);
      if (element.kind === "table") {
        for (const row of element.rows)
          for (const cell of row.cells) localizeText(cell.text);
      }
    }
  };
  localize(slide.elements);
  return renderSlideToSvg(presentation, slide, {
    idPrefix,
    textMode: "html",
    media: "badge",
    hiddenElements: [...staticHidden(slide)],
  });
}

export async function loadPresentationFonts(
  presentation: Presentation,
  signal: AbortSignal,
): Promise<() => void> {
  const fonts: FontFace[] = [];
  const aliases = new Map<string, string>();
  const candidates = new Map<string, string>();
  const prefix = `ArxatecPresentation${++fontSequence}`;
  fontAliases.set(presentation, aliases);
  const dispose = () => {
    for (const font of fonts) document.fonts.delete(font);
    fonts.length = 0;
    fontAliases.delete(presentation);
  };
  if (typeof FontFace === "undefined" || !document.fonts) return dispose;
  await Promise.all(
    (presentation.embeddedFonts ?? []).map(async (font) => {
      if (!font.src.startsWith("blob:")) return;
      const original = font.family.toLowerCase();
      const family =
        candidates.get(original) ?? `${prefix}Font${candidates.size}`;
      candidates.set(original, family);
      const face = new FontFace(family, `url("${font.src}")`, {
        weight: font.bold ? "700" : "400",
        style: font.italic ? "italic" : "normal",
      });
      try {
        await face.load();
        if (!signal.aborted) {
          document.fonts.add(face);
          fonts.push(face);
          aliases.set(original, family);
          font.family = family;
        }
      } catch {
        // A damaged or unavailable embedded face uses the browser's fallback.
      }
    }),
  );
  if (signal.aborted) dispose();
  else invalidateTextMeasureCaches();
  return dispose;
}

export function readPresentationBlob(
  blob: Blob,
  signal: AbortSignal,
): Promise<ArrayBuffer> {
  signal.throwIfAborted();
  if (blob.arrayBuffer) return blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const abort = () => reader.abort();
    const cleanup = () => signal.removeEventListener("abort", abort);
    reader.onload = () => {
      cleanup();
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = () => {
      cleanup();
      reject(reader.error ?? new Error("No se pudo leer el archivo."));
    };
    reader.onabort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    reader.readAsArrayBuffer(blob);
  });
}
