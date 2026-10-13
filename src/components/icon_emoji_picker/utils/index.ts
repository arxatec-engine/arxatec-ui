const LUCIDE_ICON_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isEmojiIcon = (
  value: string | null | undefined,
): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  !LUCIDE_ICON_NAME.test(value);
