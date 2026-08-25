import type { FileAnnotationsSchema } from "../../../../types/annotations";
import { parseAndNormalizeAnnotationsSchema } from "../schema";

export const emptySchema = (): FileAnnotationsSchema => {
  return { annotations: [] };
};

export const parseSchema = (raw: unknown): FileAnnotationsSchema | null => {
  if (raw == null) return emptySchema();
  return parseAndNormalizeAnnotationsSchema(raw);
};

/** Texto plano de la anotación para la lista lateral, recortado a 500 caracteres. */
export const annotationPlainPreview = (html: string): string => {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 500) || "—";
};

export const clamp01 = (n: number) => {
  return Math.min(1, Math.max(0, n));
};
