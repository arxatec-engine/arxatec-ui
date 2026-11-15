import { Download, FileX } from "lucide-react";
import { Button } from "@/components/button";
import { useFileViewLoadingChange } from "../../hooks";
import { FileViewErrorState } from "../error_state";
import type { FileViewLoadingChangeHandler } from "../../types";

export interface FileUnknownViewerProps {
  fileName: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
}

export const FileUnknownViewer = ({
  fileName,
  isPending = false,
  isError = false,
  onDownload,
  onLoadingChange,
}: FileUnknownViewerProps) => {
  useFileViewLoadingChange(isPending && !isError, onLoadingChange);

  if (isPending) {
    return null;
  }

  if (isError) {
    return <FileViewErrorState />;
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
