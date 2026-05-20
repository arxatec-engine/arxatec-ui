import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { FileDown, Loader2, Type } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  onInsertText: () => void;
  onSaveAsPdf: () => void;
  isExporting: boolean;
  hasAnnotations: boolean;
  formatToolbar?: ReactNode;
  hasSelection?: boolean;
  activePdfPage?: number;
  pdfPageCount?: number;
}

export const AnnotationToolbar: React.FC<Props> = ({
  onInsertText,
  onSaveAsPdf,
  isExporting,
  hasAnnotations,
  formatToolbar,
  hasSelection = false,
  activePdfPage = 1,
  pdfPageCount = 0,
}) => {
  const pageHint =
    pdfPageCount > 0
      ? `Se insertará en la página ${activePdfPage}.`
      : "Cuando cargue el PDF podrás elegir la página desde la barra inferior.";

  const saveDisabled = !hasAnnotations || isExporting;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border bg-card px-3 py-1.5">
      <div className="order-last flex w-full min-w-0 basis-full items-center justify-center sm:order-0 sm:w-auto sm:flex-1 sm:basis-0">
        <div className="flex items-center gap-1">
          {hasSelection ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  onClick={onInsertText}
                  aria-label="Insertar caja de texto"
                >
                  <Type className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-medium">Insertar caja de texto</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  · {pageHint}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 bg-primary/10 px-2.5 font-medium text-primary hover:bg-primary/15 hover:text-primary"
                  onClick={onInsertText}
                >
                  <Type className="size-4" />
                  Nuevo texto
                </Button>
              </TooltipTrigger>
              <TooltipContent>{pageHint}</TooltipContent>
            </Tooltip>
          )}
          {hasSelection && formatToolbar ? (
            <>
              <Separator orientation="vertical" className="h-5 bg-border/80" />
              {formatToolbar}
            </>
          ) : null}
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center sm:ml-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saveDisabled}
              className="h-8 gap-1.5"
              onClick={() => onSaveAsPdf()}
              aria-label="Guardar PDF anotado como nuevo archivo"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileDown className="size-4" />
              )}
              {isExporting ? "Generando…" : "Guardar como"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Crear PDF anotado con otro nombre en documentos
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
