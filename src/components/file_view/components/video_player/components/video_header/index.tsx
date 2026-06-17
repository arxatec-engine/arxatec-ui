import React from "react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Download } from "lucide-react";

interface Props {
  onDownload: () => void;
  disabled?: boolean;
}

export const VideoHeader: React.FC<Props> = ({
  onDownload,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-end p-4 bg-card border-b border-border">
      <Tooltip>
        <TooltipTrigger>
          <Button
            onClick={onDownload}
            variant="ghost"
            size="icon"
            aria-label="Descargar video"
            disabled={disabled}
          >
            <Download className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descargar video</TooltipContent>
      </Tooltip>
    </div>
  );
};
