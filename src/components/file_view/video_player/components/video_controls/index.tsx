import React from "react";
import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { Play, Pause } from "lucide-react";
import { VideoProgressBar } from "../video_progress_bar";
import { VideoTimeDisplay } from "../video_time_display";
import { VideoVolumeControl } from "../video_volume_control";

interface Props {
  playing: boolean;
  played: number;
  playedSeconds: number;
  duration: number;
  volume: number;
  muted: boolean;
  onPlayPause: () => void;
  onSeekChange: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export const VideoControls: React.FC<Props> = ({
  playing,
  played,
  playedSeconds,
  duration,
  volume,
  muted,
  onPlayPause,
  onSeekChange,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 z-20">
      <VideoProgressBar played={played} onSeekChange={onSeekChange} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPlayPause}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-10 w-10"
                aria-label={playing ? "Pausar" : "Reproducir"}
                type="button"
              >
                {playing ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{playing ? "Pausar" : "Reproducir"}</TooltipContent>
          </Tooltip>

          <VideoVolumeControl
            volume={volume}
            muted={muted}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />

          <VideoTimeDisplay
            playedSeconds={playedSeconds}
            duration={duration}
            mobile={false}
          />
        </div>

        <VideoTimeDisplay
          playedSeconds={playedSeconds}
          duration={duration}
          mobile={true}
        />
      </div>
    </div>
  );
};
