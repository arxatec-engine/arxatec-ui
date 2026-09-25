import { useMemo } from "react";
import { Copy, FileText } from "lucide-react";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";
import { summaryMarkdownToHtml } from "../../utilities/summary_markdown";
import { useFileViewLoadingChange } from "../../hooks";
import type { FileViewLoadingChangeHandler } from "../../types";

export interface FileSummaryViewerProps {
  content?: string | null;
  isLoading?: boolean;
  isProcessing?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  isUnsupported?: boolean;
  onCopy?: () => void;
  onRetry?: () => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
}

export const FileSummaryViewer = ({
  content,
  isLoading = false,
  isProcessing = false,
  isError = false,
  isUnsupported = false,
  onCopy,
  onRetry,
  onLoadingChange,
}: FileSummaryViewerProps) => {
  const html = useMemo(() => summaryMarkdownToHtml(content), [content]);
  useFileViewLoadingChange(isLoading || isProcessing, onLoadingChange);

  if (isLoading) {
    return null;
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
    return null;
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
      <div className="flex-1 overflow-auto p-8">
        <div
          className="prose prose-sm dark:prose-invert text-foreground leading-relaxed max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};
