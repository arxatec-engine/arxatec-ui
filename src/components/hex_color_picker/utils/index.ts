import { normalizeHexColor } from "@/utilities/colors";

export const HEX_COLOR_SWATCHES = [
  "#171717",
  "#2563EB",
  "#0F766E",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#CA8A04",
  "#DC2626",
  "#059669",
  "#0EA5E9",
  "#4F46E5",
  "#64748B",
  "#C026D3",
  "#14B8A6",
  "#06B6D4",
  "#84CC16",
  "#22C55E",
  "#8B5CF6",
  "#A855F7",
  "#F97316",
  "#F43F5E",
  "#78716C",
  "#0891B2",
  "#FBBF24",
] as const;

export const HEX_COLOR_PICKER_FALLBACK = "#171717";

export function hexColorOrFallback(value: string | null | undefined): string {
  return normalizeHexColor(value ?? "") ?? HEX_COLOR_PICKER_FALLBACK;
}
