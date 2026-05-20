import { Download, FileSpreadsheet } from "lucide-react";

export interface FileBlobOfficeUnavailableProps {
  url: string;
  fileName?: string;
}

export const FileBlobOfficeUnavailable: React.FC<
  FileBlobOfficeUnavailableProps
> = ({ url, fileName }) => (
  <div className="flex flex-col items-center justify-center h-full p-4 mx-auto max-w-md text-center">
    <div className="p-4 rounded-md bg-status-card-background-icon-empty text-foreground">
      <FileSpreadsheet className="size-6" />
    </div>
    <div className="mt-6">
      <h2 className="text-base font-normal text-primary text-center">
        Vista previa de Office no disponible para archivos locales
      </h2>
      <p className="text-sm text-secondary-foreground mt-2">
        Los documentos Word, Excel y PowerPoint se previsualizan con un servicio
        externo que requiere una URL pública. Descarga el archivo para abrirlo
        en tu dispositivo.
      </p>
      {fileName && (
        <a
          href={url}
          download={fileName}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-2 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="size-4" />
          Descargar &quot;{fileName}&quot;
        </a>
      )}
    </div>
  </div>
);
