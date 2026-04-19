const FALLBACK_COLOR = "#171717";

function normalizeHexColor(value: string) {
  const hex = value.trim().replace(/^#/, "");

  if (!/^[\da-fA-F]{3}([\da-fA-F]{3})?$/.test(hex)) {
    return null;
  }

  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : hex;

  return `#${normalized.toUpperCase()}`;
}

function getColorContrastForeground(value: string) {
  const normalized = normalizeHexColor(value);

  if (!normalized) {
    return "#FFFFFF";
  }

  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  const yiq = (red * 299 + green * 587 + blue * 114) / 1000;

  return yiq >= 160 ? "#0F172A" : "#FFFFFF";
}

export { FALLBACK_COLOR, getColorContrastForeground, normalizeHexColor };
