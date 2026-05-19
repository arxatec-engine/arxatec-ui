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
  /* const { assistant, setAssistant } = useFilePreviewAssistantContext();
   const assistantEnabled = assistant === true;

  const toggleAssistant = () => {
    setAssistant(assistantEnabled ? false : true);
  };*/

  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onZoomOut}
              disabled={scale <= 0.5}
              variant="ghost"
              size="icon"
              aria-label="Reducir zoom"
            >
              <ZoomOut className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reducir zoom</TooltipContent>
        </Tooltip>
        <span className="text-sm font-medium text-foreground">
          {Math.round(scale * 100)}%
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onZoomIn}
              disabled={scale >= 3.0}
              variant="ghost"
              size="icon"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aumentar zoom</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPrevPage}
                disabled={pageNumber <= 1}
                variant="ghost"
                size="icon"
                aria-label="Página anterior"
              >
                <ChevronLeft className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Página anterior</TooltipContent>
          </Tooltip>
          <span className="text-sm font-medium text-foreground">
            Página {pageNumber} de {numPages}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNextPage}
                disabled={pageNumber >= numPages}
                variant="ghost"
                size="icon"
                aria-label="Página siguiente"
              >
                <ChevronRight className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Página siguiente</TooltipContent>
          </Tooltip>
        </div>
        {/* 
          <Separator orientation="vertical" className="h-8!" />
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={toggleAssistant}
                variant="ghost"
                size="icon"
                aria-label={
                  assistantEnabled ? "Cerrar asistente" : "Abrir asistente"
                }
              >
                <Sparkles className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {assistantEnabled ? "Cerrar asistente" : "Abrir asistente"}
            </TooltipContent>
          </Tooltip>
          
          */}
        <Separator orientation="vertical" className="h-8!" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDownload}
              variant="ghost"
              size="icon"
              aria-label="Descargar PDF"
            >
              <Download className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Descargar PDF</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
