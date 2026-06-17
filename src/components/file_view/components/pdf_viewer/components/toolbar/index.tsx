import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";

interface Props {
  scale: number;
  pageNumber: number;
  numPages: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onDownload: () => void;
}

export const Toolbar: React.FC<Props> = ({
  scale,
  pageNumber,
  numPages,
  onZoomIn,
  onZoomOut,
  onPrevPage,
  onNextPage,
  onDownload,
}) => {
  const showPagination = numPages > 0;

  return (
    <ViewerFloatingBar ariaLabel="Controles del visor de PDF">
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
            <ViewerFloatingBarValue>
              {pageNumber}/{numPages}
            </ViewerFloatingBarValue>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="Página siguiente"
                  onClick={onNextPage}
                  disabled={pageNumber >= numPages}
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
      <ViewerFloatingBarValue>
        {Math.round(scale * 100)}%
      </ViewerFloatingBarValue>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Aumentar zoom"
            onClick={onZoomIn}
            disabled={scale >= 3.0}
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
            aria-label="Descargar PDF"
            onClick={onDownload}
          >
            <Download className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descargar PDF</TooltipContent>
      </Tooltip>
    </ViewerFloatingBar>
  );
};
