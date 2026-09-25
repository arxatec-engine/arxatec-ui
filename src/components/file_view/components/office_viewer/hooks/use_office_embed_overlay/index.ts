import { type RefObject, useEffect, useState } from "react";
import {
  OFFICE_EMBED_FALLBACK_MS,
  OFFICE_EMBED_IFRAME_SELECTOR,
  OFFICE_EMBED_SETTLE_MS,
} from "../../constants";

export const useOfficeEmbedOverlay = (
  rootRef: RefObject<HTMLElement | null>,
  embedKey: string,
) => {
  const [readyKey, setReadyKey] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let iframe: HTMLIFrameElement | null = null;
    let settleTimer: number | undefined;
    let revealed = false;

    const reveal = () => {
      if (revealed) {
        return;
      }

      revealed = true;
      setReadyKey(embedKey);
    };

    const scheduleReveal = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(reveal, OFFICE_EMBED_SETTLE_MS);
    };

    const bind = (node: HTMLIFrameElement) => {
      if (iframe === node) {
        return;
      }

      iframe?.removeEventListener("load", scheduleReveal);
      iframe = node;
      iframe.addEventListener("load", scheduleReveal);
    };

    const existing = root.querySelector<HTMLIFrameElement>(OFFICE_EMBED_IFRAME_SELECTOR);
    if (existing) {
      bind(existing);
    }

    const observer = new MutationObserver(() => {
      const node = root.querySelector<HTMLIFrameElement>(OFFICE_EMBED_IFRAME_SELECTOR);
      if (node) {
        bind(node);
      }
    });

    observer.observe(root, { childList: true, subtree: true });
    const fallbackTimer = window.setTimeout(reveal, OFFICE_EMBED_FALLBACK_MS);

    return () => {
      observer.disconnect();
      iframe?.removeEventListener("load", scheduleReveal);
      window.clearTimeout(settleTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [embedKey, rootRef]);

  return readyKey !== embedKey;
};
