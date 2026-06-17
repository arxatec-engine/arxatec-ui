import { Download } from "lucide-react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { ViewerFloatingBar } from "../../../viewer_floating_bar";

export interface FileOfficeViewerToolbarProps {
  onDownload?: () => void;
}

export const FileOfficeViewerToolbar: React.FC<
  FileOfficeViewerToolbarProps
> = ({ onDownload }) => {
  if (!onDownload) return null;

  return (
    <ViewerFloatingBar ariaLabel="Controles del visor de documento">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Descargar archivo"
            onClick={onDownload}
          >
            <Download className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descargar archivo</TooltipContent>
      </Tooltip>
    </ViewerFloatingBar>
  );
};
