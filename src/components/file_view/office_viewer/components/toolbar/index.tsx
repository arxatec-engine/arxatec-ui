import { Download } from "lucide-react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";

export interface FileOfficeViewerToolbarProps {
  onDownload?: () => void;
}

export const FileOfficeViewerToolbar: React.FC<
  FileOfficeViewerToolbarProps
> = ({ onDownload }) => (
  <div className="flex items-center justify-end p-4 bg-card border-b border-border shadow-sm">
    {onDownload ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onDownload}
            variant="ghost"
            size="icon"
            aria-label="Descargar archivo"
          >
            <Download className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descargar archivo</TooltipContent>
      </Tooltip>
    ) : null}
  </div>
);
