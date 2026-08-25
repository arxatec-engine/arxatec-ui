import type { FileTemplateViewerApi } from "../../../types/annotations";

export type FileTemplateViewerHandle = {
  flushSave: () => Promise<void>;
};

export type TemplateViewerHandle = FileTemplateViewerHandle;

/**
 * Acciones que ofrece el anfitrión.
 *
 * Existe porque el visor se usa en dos sitios con capacidades distintas: una
 * biblioteca de documentos, donde el resultado se guarda como archivo nuevo, y
 * una herramienta de usar y tirar, donde no hay dónde guardarlo. Omitir el
 * objeto deja el comportamiento completo de siempre.
 */
export interface FileTemplateViewerFeatures {
  /** Botón "Guardar como": crea un archivo nuevo en la biblioteca del anfitrión. */
  saveAs?: boolean;
}

export interface ContentProps {
  fileId: string;
  mimeType: string;
  fileName?: string;
  api: FileTemplateViewerApi;
  features?: FileTemplateViewerFeatures;
}

export type FileTemplateViewerProps = ContentProps;
