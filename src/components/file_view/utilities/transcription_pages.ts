/**
 * Contrato de paginación de las transcripciones.
 *
 * El backend guarda la transcripción como texto plano con las páginas
 * separadas por U+000C (form feed), la misma convención que emite
 * `pdftotext`. Los formatos sin paginación real (audio, Word, imágenes) y las
 * transcripciones antiguas llegan como una única página.
 */
export const TRANSCRIPTION_PAGE_BREAK = "\f";

/** Devuelve siempre al menos una página. */
export const splitTranscriptionPages = (content: string): string[] => {
  return content.split(TRANSCRIPTION_PAGE_BREAK);
};

/** Texto sin marcas de página, listo para copiar al portapapeles. */
export const toPlainTranscription = (content: string): string => {
  return splitTranscriptionPages(content)
    .map((page) => page.trim())
    .filter((page) => page.length > 0)
    .join("\n\n");
};
