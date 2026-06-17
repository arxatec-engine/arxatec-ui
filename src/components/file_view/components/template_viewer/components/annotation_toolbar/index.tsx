import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities/class";
import {
  Circle,
  FileDown,
  ImagePlus,
  Loader2,
  Square,
  Type,
  Slash,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ShapeDrawTool } from "../../utilities";

interface Props {
  shapeDrawTool: ShapeDrawTool | null;
  onShapeDrawToolChange: (tool: ShapeDrawTool | null) => void;
  onInsertText: () => void;
  onInsertImage: () => void;
  onSaveAsPdf: () => void;
  isExporting: boolean;
  isUploadingImage?: boolean;
  hasAnnotations: boolean;
  formatToolbar?: ReactNode;
  hasSelection?: boolean;
  activePdfPage?: number;
  pdfPageCount?: number;
}

export const AnnotationToolbar: React.FC<Props> = ({
  shapeDrawTool,
  onShapeDrawToolChange,
  onInsertText,
  onInsertImage,
  onSaveAsPdf,
  isExporting,
  isUploadingImage = false,
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

  const shapeBtnClass = (tool: ShapeDrawTool) =>
    cn(
      "size-7",
      shapeDrawTool === tool &&
        "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
    );

  const toggleShapeTool = (tool: ShapeDrawTool) => {
    onShapeDrawToolChange(shapeDrawTool === tool ? null : tool);
  };

  const handleInsertText = () => {
    onShapeDrawToolChange(null);
    onInsertText();
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border bg-card px-3 py-1.5">
      <div className="order-last flex w-full min-w-0 basis-full items-center justify-center sm:order-0 sm:w-auto sm:flex-1 sm:basis-0">
        <div className="flex flex-wrap items-center gap-1">
          {hasSelection ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleInsertText}
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
                  className="h-8 gap-1.5 px-2.5 font-medium"
                  onClick={handleInsertText}
                >
                  <Type className="size-4" />
                  Nuevo texto
                </Button>
              </TooltipTrigger>
              <TooltipContent>{pageHint}</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={shapeBtnClass("line")}
                onClick={() => toggleShapeTool("line")}
                aria-label="Dibujar línea"
              >
                <Slash className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dibujar línea · {pageHint}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={shapeBtnClass("rect")}
                onClick={() => toggleShapeTool("rect")}
                aria-label="Dibujar rectángulo"
              >
                <Square className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dibujar rectángulo · {pageHint}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={shapeBtnClass("ellipse")}
                onClick={() => toggleShapeTool("ellipse")}
                aria-label="Dibujar elipse"
              >
                <Circle className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dibujar elipse · {pageHint}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={onInsertImage}
                aria-label="Insertar imagen"
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insertar imagen · {pageHint}</TooltipContent>
          </Tooltip>

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
