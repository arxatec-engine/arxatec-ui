import React from "react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Slider } from "@/components/slider";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  volume: number;
  muted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
}

export const VideoVolumeControl: React.FC<Props> = ({
  volume,
  muted,
  onToggleMute,
  onVolumeChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggleMute}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-9 w-9"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            type="button"
          >
            {muted || volume === 0 ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {muted ? "Activar sonido" : "Silenciar"}
        </TooltipContent>
      </Tooltip>
      <div className="w-24 hidden sm:block">
        <Slider
          value={[muted ? 0 : volume * 100]}
          onValueChange={onVolumeChange}
          min={0}
          max={100}
          step={1}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  );
};
