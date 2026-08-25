import { SHAPE_COLOR_PALETTE } from "../../../utilities";

export const normalizePickerValue = (
  value: string | null | undefined,
) => {
  if (value == null || value === "" || value === "transparent") {
    return "transparent";
  }
  const hit = SHAPE_COLOR_PALETTE.find(
    (c) => c.value.toLowerCase() === value.toLowerCase(),
  );
  return hit?.value ?? "#000000";
};
