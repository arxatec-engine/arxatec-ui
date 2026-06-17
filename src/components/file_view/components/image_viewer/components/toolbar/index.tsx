import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Download, Home, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";

interface Props {
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  scale: number;
  isPending: boolean;
  isError: boolean;
  handleDownloadFile: () => void;
  handleRotate: () => void;
  handleReset: () => void;
}
export const Toolbar: React.FC<Props> = ({
  handleZoomOut,
  handleZoomIn,
  scale,
  isPending,
  isError,
  handleDownloadFile,
  handleRotate,
  handleReset,
}) => {
  const disabled = isPending || isError;

  return (
    <ViewerFloatingBar ariaLabel="Controles del visor de imagen">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Reducir zoom"
            onClick={handleZoomOut}
            disabled={scale <= 0.25 || disabled}
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
            onClick={handleZoomIn}
            disabled={scale >= 4.0 || disabled}
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
            aria-label="Rotar imagen"
            onClick={handleRotate}
            disabled={disabled}
          >
            <RotateCw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Rotar imagen</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Centrar imagen"
            onClick={handleReset}
            disabled={disabled}
          >
            <Home className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Centrar imagen</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Descargar imagen"
            onClick={handleDownloadFile}
            disabled={disabled}
          >
            <Download className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descargar imagen</TooltipContent>
      </Tooltip>
    </ViewerFloatingBar>
  );
};
