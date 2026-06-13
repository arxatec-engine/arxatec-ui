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
import type { ReactNode } from "react";

export interface FileViewerFloatingBarProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  minScale?: number;
  maxScale?: number;
  zoomDisabled?: boolean;
  pageNumber?: number;
  pageCount?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onFitWidth?: () => void;
  onDownload?: () => void;
  downloadLabel?: string;
  downloadDisabled?: boolean;
  extraActions?: ReactNode;
  ariaLabel?: string;
}

export const FileViewerFloatingBar: React.FC<FileViewerFloatingBarProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  minScale = 0.5,
  maxScale = 3,
  zoomDisabled = false,
  pageNumber = 1,
  pageCount = 0,
  onPrevPage,
  onNextPage,
  onFitWidth,
  onDownload,
  downloadLabel = "Descargar archivo",
  downloadDisabled = false,
  extraActions,
  ariaLabel = "Controles del visor",
}) => {
  const showPagination = pageCount > 0 && onPrevPage && onNextPage;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4"
      role="toolbar"
      aria-label={ariaLabel}
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
                    onClick={onPrevPage}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Página anterior</TooltipContent>
              </Tooltip>
              <div className="min-w-11 select-none rounded-md bg-muted px-2 py-0.5 text-center text-xs font-medium tabular-nums text-foreground">
                {pageNumber}/{pageCount}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label="Página siguiente"
                    onClick={onNextPage}
                    disabled={pageNumber >= pageCount}
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
              disabled={zoomDisabled || scale <= minScale}
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
              disabled={zoomDisabled || scale >= maxScale}
            >
              <ZoomIn className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aumentar zoom</TooltipContent>
        </Tooltip>
        {onFitWidth ? (
          <>
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
          </>
        ) : null}
        {extraActions ? (
          <>
            <Separator orientation="vertical" className="mx-0.5 h-6" />
            {extraActions}
          </>
        ) : null}
        {onDownload ? (
          <>
            <Separator orientation="vertical" className="mx-0.5 h-6" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label={downloadLabel}
                  onClick={onDownload}
                  disabled={downloadDisabled}
                >
                  <Download className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{downloadLabel}</TooltipContent>
            </Tooltip>
          </>
        ) : null}
      </div>
    </div>
  );
};
