import React from "react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Maximize, Minimize } from "lucide-react";
import { cn } from "@/utilities/class";
import { VideoControls } from "../";

interface Props {
  showControls: boolean;
  isHovering: boolean;
  isFullscreen: boolean;
  playing: boolean;
  played: number;
  playedSeconds: number;
  duration: number;
  volume: number;
  muted: boolean;
  onToggleFullscreen: () => void;
  onPlayPause: () => void;
  onSeekChange: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export const VideoOverlay: React.FC<Props> = ({
  showControls,
  isHovering,
  isFullscreen,
  playing,
  played,
  playedSeconds,
  duration,
  volume,
  muted,
  onToggleFullscreen,
  onPlayPause,
  onSeekChange,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300",
        showControls || isHovering ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onToggleFullscreen}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              aria-label={
                isFullscreen
                  ? "Salir de pantalla completa"
                  : "Pantalla completa"
              }
              type="button"
            >
              {isFullscreen ? (
                <Minimize className="size-5" />
              ) : (
                <Maximize className="size-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          </TooltipContent>
        </Tooltip>
      </div>

      <VideoControls
        playing={playing}
        played={played}
        playedSeconds={playedSeconds}
        duration={duration}
        volume={volume}
        muted={muted}
        onPlayPause={onPlayPause}
        onSeekChange={onSeekChange}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
    </div>
  );
};
