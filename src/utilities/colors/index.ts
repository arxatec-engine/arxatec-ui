export function normalizeHexColor(value: string): string | null {
  const t = value.trim().replace(/^#/, "");
  if (!/^[\da-fA-F]{3}([\da-fA-F]{3})?$/.test(t)) return null;
  const full =
    t.length === 3
      ? t
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : t;
  return `#${full.toUpperCase()}`;
}
