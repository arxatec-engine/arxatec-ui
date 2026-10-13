import { describe, expect, it } from "vitest";
import { getFileKindStyle, FILE_KIND_STYLES } from "./index";

const COLOR_TOKENS = /^text-([a-z]+-\d+) dark:text-([a-z]+-\d+)$/;

const expectedAccent = (color: string): string => {
  const match = COLOR_TOKENS.exec(color);

  if (!match) {
    throw new Error(
      `color "${color}" does not follow the "text-<hue> dark:text-<hue>" shape`,
    );
  }

  const [, light, dark] = match;

  return `[--file-kind:var(--color-${light})] dark:[--file-kind:var(--color-${dark})]`;
};

describe("file kind styles", () => {
  it("should expose every kind's own icon color as the --file-kind accent", () => {
    for (const [kind, style] of Object.entries(FILE_KIND_STYLES)) {
      expect(
        style.accent,
        `accent of "${kind}" drifted from its icon color`,
      ).toBe(expectedAccent(style.color));
    }
  });

  it("should give each kind a hue no other kind uses", () => {
    const hues = Object.values(FILE_KIND_STYLES).map((style) => style.color);

    expect(new Set(hues).size).toBe(hues.length);
  });

  it("should fall back to the unknown kind for an unmapped mime type", () => {
    expect(getFileKindStyle("application/x-unmapped")).toBe(
      FILE_KIND_STYLES.unknown,
    );
  });
});
