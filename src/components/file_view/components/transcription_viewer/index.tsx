import { useMemo } from "react";
import { Copy, FileText } from "lucide-react";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";
import { splitTranscriptionPages } from "../../utilities/transcription_pages";
import { useFileViewLoadingChange } from "../../hooks";
import type { FileViewLoadingChangeHandler } from "../../types";

export interface FileTranscriptionViewerProps {
  content?: string | null;
  isLoading?: boolean;
  isProcessing?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onCopy?: () => void;
  onLoadingChange?: FileViewLoadingChangeHandler;
}

export const FileTranscriptionViewer = ({
  content,
  isLoading = false,
  isProcessing = false,
  isError = false,
  onCopy,
  onLoadingChange,
}: FileTranscriptionViewerProps) => {
  const pages = useMemo(
    () => splitTranscriptionPages(content ?? ""),
    [content],
  );
  useFileViewLoadingChange(isLoading || isProcessing, onLoadingChange);

  if (isLoading) {
    return null;
  }

  if (isProcessing) {
    return null;
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

  // Los documentos sin paginación real (audio, Word, imágenes) llegan como una
  // sola página: en ese caso no se muestra la numeración.
  const isPaginated = pages.length > 1;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-muted/30">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
            TRANSCRIPCIÓN
          </span>
          {isPaginated ? (
            <span className="text-sm text-muted-foreground">
              {pages.length} páginas
            </span>
          ) : null}
        </div>
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
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {pages.map((page, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-lg border bg-card shadow-sm"
            >
              {isPaginated ? (
                <header className="flex items-center justify-between border-b bg-muted/20 px-6 py-2">
                  <span className="text-sm text-muted-foreground">
                    Página {index + 1} de {pages.length}
                  </span>
                </header>
              ) : null}
              {page.trim().length > 0 ? (
                <pre className="whitespace-pre-wrap break-words px-6 py-5 font-sans text-sm leading-relaxed text-foreground">
                  {page}
                </pre>
              ) : (
                <p className="px-6 py-5 text-sm text-muted-foreground italic">
                  Esta página no contiene texto.
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
