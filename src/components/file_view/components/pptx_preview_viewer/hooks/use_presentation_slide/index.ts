import { useEffect, useRef } from "react";

import {
  renderPresentationSlide,
  type Presentation,
} from "../../utilities/presentation";
import { sanitizePresentationSvg } from "../../utilities/sanitize";

interface Options {
  className?: string;
  presentation: Presentation;
  index: number;
  direction?: number;
  idPrefix: string;
  thumbnail?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onSlideLink?: (index: number) => void;
}

export const usePresentationSlide = ({
  presentation,
  index,
  direction = 1,
  idPrefix,
  thumbnail = false,
  onReady,
  onError,
  onSlideLink,
}: Options) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onError, onSlideLink });
  useEffect(() => {
    callbacks.current = { onReady, onError, onSlideLink };
  }, [onReady, onError, onSlideLink]);

  useEffect(() => {
    const host = hostRef.current;
    return () => host?.shadowRoot?.replaceChildren();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.toggleAttribute("inert", thumbnail);
    host.setAttribute("aria-busy", "true");
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    let cancelled = false;
    let pending = true;
    let animation: Animation | undefined;
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );
    const stopMotion = () => {
      if (reducedMotion?.matches) animation?.cancel();
    };
    reducedMotion?.addEventListener?.("change", stopMotion);
    const followLink = (event: Event) => {
      if (pending) {
        event.preventDefault();
        return;
      }
      const link = event
        .composedPath()
        .find(
          (node): node is Element =>
            node instanceof Element && node.localName === "a",
        );
      const href =
        link?.getAttribute("href") ?? link?.getAttribute("xlink:href");
      const slide = link?.getAttribute("data-slide");
      if (slide && /^\d+$/.test(slide)) {
        event.preventDefault();
        // The engine emits one-based page numbers in data-slide links.
        callbacks.current.onSlideLink?.(Number(slide) - 1);
        return;
      }
      if (!href) return;
      if (href.startsWith("slide:")) {
        event.preventDefault();
        callbacks.current.onSlideLink?.(Number(href.slice(6)) - 1);
      } else if (href.startsWith("#")) {
        event.preventDefault();
        shadow
          .getElementById(href.slice(1))
          ?.scrollIntoView?.({ block: "nearest" });
      }
    };
    const followLinkWithKeyboard = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Enter")
        followLink(event);
    };
    shadow.addEventListener("click", followLink);
    shadow.addEventListener("keydown", followLinkWithKeyboard);
    void (async () => {
      const fragment = sanitizePresentationSvg(
        renderPresentationSlide(presentation, index, idPrefix),
      );
      const svg = fragment.querySelector("svg");
      if (!svg) throw new Error("No se pudo dibujar la diapositiva.");
      const style = document.createElement("style");
      style.textContent = `
        :host { all: initial; display: block; width: 100%; height: 100%; color: #111; font-family: Arial, sans-serif; line-height: normal; }
        :host > svg { display: block; width: 100%; height: 100%; }
      `;
      if (!thumbnail) {
        const sources = new Set(
          Array.from(
            fragment.querySelectorAll("image, img"),
            (node) =>
              node.getAttribute("href") ??
              node.getAttribute("xlink:href") ??
              node.getAttribute("src"),
          ).filter((source): source is string => Boolean(source)),
        );
        await Promise.all(
          Array.from(sources, async (source) => {
            const image = new Image();
            image.src = source;
            await image.decode?.().catch(() => undefined);
          }),
        );
      }
      if (cancelled) return;
      // Keep the previous slide visible until the incoming slide's images decode.
      const replacingSlide = Boolean(shadow.querySelector("svg"));
      shadow.replaceChildren(style, fragment);
      host.setAttribute("aria-busy", "false");
      pending = false;
      if (
        !thumbnail &&
        replacingSlide &&
        !reducedMotion?.matches &&
        host.animate
      ) {
        animation = host.animate(
          [
            { opacity: 0, transform: `translateX(${direction * 12}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" },
        );
      }
      callbacks.current.onReady?.();
    })().catch((cause: unknown) => {
      if (!cancelled)
        callbacks.current.onError?.(
          cause instanceof Error
            ? cause
            : new Error("No se pudo abrir la diapositiva."),
        );
    });
    return () => {
      cancelled = true;
      animation?.cancel();
      reducedMotion?.removeEventListener?.("change", stopMotion);
      shadow.removeEventListener("click", followLink);
      shadow.removeEventListener("keydown", followLinkWithKeyboard);
    };
  }, [presentation, index, idPrefix, thumbnail, direction]);

  return hostRef;
};
