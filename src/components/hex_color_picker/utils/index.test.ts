import { describe, expect, it } from "vitest";
import {
  HEX_COLOR_PICKER_FALLBACK,
  HEX_COLOR_SWATCHES,
  hexColorOrFallback,
} from "@/components/hex_color_picker/utils";

describe("hex_color_picker/utils", () => {
  describe("HEX_COLOR_SWATCHES", () => {
    it("should expose a non-empty list of normalized uppercase hex swatches", () => {
      expect(HEX_COLOR_SWATCHES.length).toBeGreaterThan(0);
      for (const swatch of HEX_COLOR_SWATCHES) {
        expect(swatch).toMatch(/^#[0-9A-F]{6}$/);
      }
    });

    it("should not contain duplicated swatches", () => {
      const unique = new Set(HEX_COLOR_SWATCHES);

      expect(unique.size).toBe(HEX_COLOR_SWATCHES.length);
    });
  });

  describe("constants", () => {
    it("should default the fallback color to #171717", () => {
      expect(HEX_COLOR_PICKER_FALLBACK).toBe("#171717");
    });
  });

  describe("hexColorOrFallback", () => {
    it("should normalize a valid hex value without hash to #RRGGBB uppercase", () => {
      const result = hexColorOrFallback("ff0000");

      expect(result).toBe("#FF0000");
    });

    it("should expand a 3-digit shorthand hex value", () => {
      const result = hexColorOrFallback("#f00");

      expect(result).toBe("#FF0000");
    });

    it("should return the fallback when the value is null", () => {
      const result = hexColorOrFallback(null);

      expect(result).toBe(HEX_COLOR_PICKER_FALLBACK);
    });

    it("should return the fallback when the value is undefined", () => {
      const result = hexColorOrFallback(undefined);

      expect(result).toBe(HEX_COLOR_PICKER_FALLBACK);
    });

    it("should return the fallback when the value is an empty string", () => {
      const result = hexColorOrFallback("");

      expect(result).toBe(HEX_COLOR_PICKER_FALLBACK);
    });

    it("should return the fallback when the value is not a valid hex color", () => {
      const result = hexColorOrFallback("not-a-color");

      expect(result).toBe(HEX_COLOR_PICKER_FALLBACK);
    });
  });
});
