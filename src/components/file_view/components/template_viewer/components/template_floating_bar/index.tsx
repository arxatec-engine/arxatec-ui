import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  StretchHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface Props {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  pdfPageCount: number;
  activePdfPage: number;
  onPdfPrevPage: () => void;
  onPdfNextPage: () => void;
  onFitWidth: () => void;
  onDownloadAnnotated: () => void;
  isBusy: boolean;
  hasAnnotations: boolean;
}

export const TemplateFloatingBar: React.FC<Props> = ({
  scale,
  onZoomIn,
  onZoomOut,
  pdfPageCount,
  activePdfPage,
  onPdfPrevPage,
  onPdfNextPage,
  onFitWidth,
  onDownloadAnnotated,
  isBusy,
  hasAnnotations,
}) => {
  const showPagination = pdfPageCount > 0;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4"
      role="toolbar"
      aria-label="Controles del visor de plantilla"
    >
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-md border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
        {showPagination ? (
          <>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label="Página anterior"
                    onClick={onPdfPrevPage}
                    disabled={activePdfPage <= 1}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Página anterior</TooltipContent>
              </Tooltip>
              <div className="min-w-11 select-none rounded-md bg-muted px-2 py-0.5 text-center text-xs font-medium tabular-nums text-foreground">
                {activePdfPage}/{pdfPageCount}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label="Página siguiente"
                    onClick={onPdfNextPage}
                    disabled={activePdfPage >= pdfPageCount}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Página siguiente</TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation="vertical" className="mx-0.5 h-6" />
          </>
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Reducir zoom"
              onClick={onZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reducir zoom</TooltipContent>
        </Tooltip>
        <div className="min-w-11 rounded-md bg-muted px-2 py-0.5 text-center text-xs font-medium tabular-nums text-foreground">
          {Math.round(scale * 100)}%
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Aumentar zoom"
              onClick={onZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aumentar zoom</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-0.5 h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Ajustar al ancho"
              onClick={onFitWidth}
            >
              <StretchHorizontal className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Ajustar al ancho del visor (otro clic: 100 %)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Descargar PDF con anotaciones"
              onClick={onDownloadAnnotated}
              disabled={!hasAnnotations || isBusy}
            >
              <Download className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Descargar PDF con anotaciones</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
