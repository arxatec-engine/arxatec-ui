import { Loader2, RefreshCw, FileX } from "lucide-react";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";

export interface FileEditViewerProps {
  isPending?: boolean;
  isError?: boolean;
  isUnsupported?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export const FileEditViewer: React.FC<FileEditViewerProps> = ({
  isPending = false,
  isError = false,
  isUnsupported = false,
  isEmpty = false,
  onRetry,
  children,
}) => {
  if (isPending) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p className="text-sm">Importando contenido del documento…</p>
      </div>
    );
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
