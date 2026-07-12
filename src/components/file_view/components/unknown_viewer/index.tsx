import { Download, FileX } from "lucide-react";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";

export interface FileUnknownViewerProps {
  fileName: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void;
}

export const FileUnknownViewer: React.FC<FileUnknownViewerProps> = ({
  fileName,
  isPending = false,
  isError = false,
  onDownload,
}) => {
  if (isPending) {
    return (
      <div className="p-6 w-full h-full">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <StatusMessage
          title="Sucedio un error inesperado"
          description="Vuelve a intentarlo dentro de unos minutos, si el error persiste, contacta con soporte."
          icon={FileX}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 mx-auto max-w-md text-center">
      <div className="p-4 rounded-md bg-status-card-background-icon-empty text-foreground">
        <FileX className="size-6" />
      </div>
      <div className="mt-6">
        <h2 className="text-base font-normal text-foreground text-center">
          Vista previa no disponible para este tipo de archivo
        </h2>
        <p className="text-sm text-secondary-foreground mt-2">
          No se puede previsualizar el archivo &quot;{fileName}&quot;. Por
          favor, descargue el archivo para verlo en su dispositivo.
        </p>
      </div>
      {onDownload ? (
        <Button className="mt-6" size="sm" onClick={onDownload}>
          <Download className="size-4" />
          <p>Descargar archivo</p>
        </Button>
      ) : null}
    </div>
  );
};
