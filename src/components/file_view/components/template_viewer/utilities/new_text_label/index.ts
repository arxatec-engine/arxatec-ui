import { NEW_TEXT_LABEL_PREFIX } from "../../constants";

/** Devuelve el número de "Nuevo texto N", o `null` si la etiqueta no lo es. */
export const parseNewTextLabelNumber = (label: string): number | null => {
  const m = label.trim().match(/^nuevo texto\s+(\d+)$/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const buildNewTextLabel = (n: number): string => {
  return `${NEW_TEXT_LABEL_PREFIX}${n}`;
};
