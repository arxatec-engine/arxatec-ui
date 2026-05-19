import { Button } from "@/components/button";
import { Download, Home, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleZoomOut}
          disabled={scale <= 0.25 || isPending || isError}
          variant="ghost"
          size="icon"
          aria-label="Reducir zoom"
        >
          <ZoomOut className="size-5" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center text-foreground">
          {Math.round(scale * 100)}%
        </span>
        <Button
          onClick={handleZoomIn}
          disabled={scale >= 4.0 || isPending || isError}
          variant="ghost"
          size="icon"
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="size-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleDownloadFile}
          disabled={isPending || isError}
          variant="ghost"
          size="icon"
          aria-label="Descargar imagen"
        >
          <Download className="size-5" />
        </Button>
        <Button
          onClick={handleRotate}
          disabled={isPending || isError}
          variant="ghost"
          size="icon"
          aria-label="Rotar imagen"
        >
          <RotateCw className="size-5" />
        </Button>
        <Button
          onClick={handleReset}
          disabled={isPending || isError}
          variant="ghost"
          size="icon"
          aria-label="Centrar imagen"
        >
          <Home className="size-5" />
        </Button>
      </div>
    </div>
  );
};
