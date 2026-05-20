import { Copy, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";

export interface FileSummaryViewerProps {
  content?: string | null;
  isLoading?: boolean;
  isProcessing?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  isUnsupported?: boolean;
  onCopy?: () => void;
  onRetry?: () => void;
}

export const FileSummaryViewer: React.FC<FileSummaryViewerProps> = ({
  content,
  isLoading = false,
  isProcessing = false,
  isFetching = false,
  isError = false,
  isUnsupported = false,
  onCopy,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (isUnsupported) {
    return (
      <div className="p-4 h-full">
        <StatusMessage
          title="Resumen no disponible"
          description="Este tipo de archivo no admite generar un resumen automático."
          icon={FileText}
          classNameCard="w-full h-full flex-col items-center justify-center"
          classNameIconCard="mx-auto"
          classNameDescription="text-center w-full max-w-sm"
          classNameTitle="text-center w-full"
          color="white"
        />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Generando resumen
          {isFetching ? "..." : ". Esto puede tardar un momento..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-4">
        <StatusMessage
          title="No se pudo generar el resumen"
          description="Vuelve a intentarlo. Si el error persiste, verifica que el archivo tenga contenido legible."
          icon={FileText}
          classNameCard="w-full flex-col items-center justify-center"
          classNameIconCard="mx-auto"
          classNameDescription="text-center w-full max-w-sm"
          classNameTitle="text-center w-full"
          color="white"
        />
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
          RESUMEN
        </span>
        {onCopy ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="h-8 gap-2"
          >
            <Copy className="size-3.5" />
            Copiar
          </Button>
        ) : null}
      </div>
      <div className="flex-1 overflow-auto p-8 prose prose-sm dark:prose-invert max-w-full min-w-full w-full mx-auto">
        <pre className="whitespace-pre-wrap font-sans text-foreground text-sm leading-relaxed max-w-2xl mx-auto">
          {content}
        </pre>
      </div>
    </div>
  );
};
