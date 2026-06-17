import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";

interface Props {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  disabled?: boolean;
}

export const Toolbar: React.FC<Props> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onDownload,
  disabled = false,
}) => (
  <ViewerFloatingBar ariaLabel="Controles del visor de documento">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-label="Reducir zoom"
          onClick={onZoomOut}
          disabled={scale <= 0.5 || disabled}
        >
          <ZoomOut className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Reducir zoom</TooltipContent>
    </Tooltip>
    <ViewerFloatingBarValue>{Math.round(scale * 100)}%</ViewerFloatingBarValue>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-label="Aumentar zoom"
          onClick={onZoomIn}
          disabled={scale >= 3.0 || disabled}
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
          aria-label="Descargar documento"
          onClick={onDownload}
          disabled={disabled}
        >
          <Download className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Descargar documento</TooltipContent>
    </Tooltip>
  </ViewerFloatingBar>
);
