export const OFFICE_EMBED_IFRAME_ID = "msdoc-iframe";
export const OFFICE_EMBED_IFRAME_SELECTOR = `#${OFFICE_EMBED_IFRAME_ID}`;

/** Office Online still paints its spinner after the iframe `load` event. */
export const OFFICE_EMBED_SETTLE_MS = 2000;

/** Last resort so the overlay never traps the preview. */
export const OFFICE_EMBED_FALLBACK_MS = 12_000;
