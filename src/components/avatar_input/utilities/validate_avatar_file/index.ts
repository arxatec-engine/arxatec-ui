/** Tope de subida del avatar. */
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

/** Motivo del rechazo; el componente lo traduce a texto con sus `labels`. */
export type AvatarFileError = "invalidType" | "tooLarge";

export const validateAvatarFile = (file: File): AvatarFileError | null => {
  if (!file.type.startsWith("image/")) return "invalidType";
  if (file.size > MAX_AVATAR_SIZE) return "tooLarge";

  return null;
};
