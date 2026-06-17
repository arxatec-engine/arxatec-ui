import { Copy, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";

export interface FileTranscriptionViewerProps {
  content?: string | null;
  isLoading?: boolean;
  isProcessing?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onCopy?: () => void;
}

export const FileTranscriptionViewer: React.FC<
  FileTranscriptionViewerProps
> = ({
  content,
  isLoading = false,
  isProcessing = false,
  isFetching = false,
  isError = false,
  onCopy,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Procesando transcripción
          {isFetching ? "..." : ". Actualizando automáticamente..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 h-full">
        <StatusMessage
          title="Transcripción no disponible"
          description="Este archivo aún no tiene una transcripción o sucedió un error al cargarla."
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

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
          TRANSCRIPCIÓN
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
