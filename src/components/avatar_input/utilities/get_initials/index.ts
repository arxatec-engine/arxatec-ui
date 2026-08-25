/** Marcador cuando no hay nombre: sin letras que traducir (L8). */
const NO_NAME = "?";

/** Iniciales de dos letras: primera y última palabra del nombre. */
export const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(/\s+/).filter(Boolean);

  if (names.length === 0) return NO_NAME;
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
