import createDOMPurify from "dompurify";

export function isPresentationResource(value: string): boolean {
  return /^(?:blob:|data:image\/(?:png|jpe?g|gif|webp|avif|bmp|svg\+xml)[;,])/i.test(
    value,
  );
}

export function isPresentationLink(value: string): boolean {
  if (/^slide:\d+$/.test(value) || /^#[\w.-]+$/.test(value)) return true;
  if (
    Array.from(value).some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  )
    return false;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function safeCss(value: string): boolean {
  // Inspect decoded escapes too: CSS URLs can otherwise bypass URI filtering.
  const decoded = value
    .replace(/\\(?:\r\n|[\n\r\f])/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\\([0-9a-f]{1,6}\s?|.)/gi, (_, escape: string) =>
      /^[0-9a-f]/i.test(escape)
        ? String.fromCodePoint(Math.min(parseInt(escape.trim(), 16), 0x10ffff))
        : escape,
    );
  if (
    /@import|@namespace|expression\s*\(|-moz-binding|behavior\s*:|(?:image-set|cross-fade|paint|src|image)\s*\(/i.test(
      decoded,
    )
  )
    return false;
  for (const match of decoded.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gis)) {
    if (!match[2].startsWith("#") && !isPresentationResource(match[2]))
      return false;
  }
  return true;
}

export function sanitizePresentationSvg(markup: string): DocumentFragment {
  // Keep hooks private; consumers may use their own DOMPurify configuration.
  const purify = createDOMPurify(window);
  purify.addHook("uponSanitizeElement", (node) => {
    if (
      node.nodeName.toLowerCase() === "style" &&
      !safeCss(node.textContent ?? "")
    )
      node.textContent = "";
  });
  purify.addHook("uponSanitizeAttribute", (node, attribute) => {
    const name = attribute.attrName.toLowerCase();
    const value = attribute.attrValue;
    if (name === "href" || name === "xlink:href" || name === "src") {
      attribute.keepAttr =
        node.nodeName.toLowerCase() === "a"
          ? isPresentationLink(value)
          : value.startsWith("#") || isPresentationResource(value);
    } else if (!safeCss(value)) attribute.keepAttr = false;
  });
  const fragment = purify.sanitize(markup, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_TAGS: ["foreignObject"],
    HTML_INTEGRATION_POINTS: { foreignobject: true },
    ADD_ATTR: ["xmlns", "xmlns:xlink"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|blob):|data:image\/|slide:\d+$|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
    FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "audio",
      "video",
      "animate",
      "animateMotion",
      "animateTransform",
      "set",
      "form",
      "input",
      "button",
      "link",
      "meta",
      "base",
    ],
    FORBID_ATTR: ["srcset", "formaction", "action"],
    RETURN_DOM_FRAGMENT: true,
  });
  for (const link of fragment.querySelectorAll("a")) {
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("target", "_blank");
  }
  return fragment;
}
