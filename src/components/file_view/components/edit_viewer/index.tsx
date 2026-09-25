import { RefreshCw, FileX } from "lucide-react";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";
import { useFileViewLoadingChange } from "../../hooks";
import type { FileViewLoadingChangeHandler } from "../../types";

export interface FileEditViewerProps {
  isPending?: boolean;
  isError?: boolean;
  isUnsupported?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  children?: React.ReactNode;
  onLoadingChange?: FileViewLoadingChangeHandler;
}

export const FileEditViewer = ({
  isPending = false,
  isError = false,
  isUnsupported = false,
  isEmpty = false,
  onRetry,
  children,
  onLoadingChange,
}: FileEditViewerProps) => {
  useFileViewLoadingChange(isPending, onLoadingChange);

  if (isPending) {
    return null;
  }

  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center gap-4">
        <StatusMessage
          title="No se pudo importar el documento"
          description={
            isUnsupported
              ? "Este tipo de archivo aún no está soportado para edición (p. ej. .doc clásico)."
              : "Vuelve a intentarlo. Si el error persiste, contacta con soporte."
          }
          icon={FileX}
        />
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="size-4 mr-2" />
            Reintentar
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-6">
        <StatusMessage
          title="Contenido vacío"
          description="No se obtuvo contenido editable a partir del archivo."
          icon={FileX}
        />
      </div>
    );
  }

  return <div className="h-full min-h-[400px] flex flex-col">{children}</div>;
};
