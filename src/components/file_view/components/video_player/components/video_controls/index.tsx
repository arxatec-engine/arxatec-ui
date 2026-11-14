import { Download, Maximize, Minimize, Pause, Play } from "lucide-react";

import { Separator } from "@/components/separator";
import { cn } from "@/utilities/class";

import { ViewerFloatingBar } from "../../../viewer_floating_bar";
import { ViewerFloatingBarButton } from "../../../viewer_floating_bar/components/viewer_floating_bar_button";
import { VideoProgressBar } from "../video_progress_bar";
import { VideoTimeDisplay } from "../video_time_display";
import { VideoVolumeControl } from "../video_volume_control";
import type { UseVideoPlayerReturn } from "../../hooks/use_video_player";
import type { FileVideoPlayerLabels } from "../../types";

interface Props {
  className?: string;
  player: Omit<UseVideoPlayerReturn, "videoRef" | "containerRef">;
  onDownload: () => void;
  labels: FileVideoPlayerLabels;
}

export const VideoControls = ({
  className,
  player,
  onDownload,
  labels,
}: Props) => (
  <ViewerFloatingBar
    data-slot="video-controls"
    ariaLabel={labels.toolbar}
    className={cn(
      "w-full max-w-xl flex-col gap-2 px-3 py-2.5 text-card-foreground",
      !player.showControls && "pointer-events-none",
      className,
    )}
  >
    <VideoProgressBar
      played={player.played}
      playedSeconds={player.playedSeconds}
      duration={player.duration}
      onSeekChange={player.handleSeekChange}
      disabled={!player.isReady || player.hasError || player.duration <= 0}
      label={labels.progress}
    />
    <div className="flex w-full min-w-0 items-center gap-1">
      <ViewerFloatingBarButton
        label={player.playing ? labels.pause : labels.play}
        icon={player.playing ? Pause : Play}
        onClick={player.handlePlayPause}
        disabled={!player.isReady || player.hasError}
        showTooltip={player.showControls}
      />
      <VideoVolumeControl
        volume={player.volume}
        muted={player.muted}
        onToggleMute={player.toggleMute}
        onVolumeChange={player.handleVolumeChange}
        labels={labels}
        showTooltip={player.showControls}
      />
      <VideoTimeDisplay
        playedSeconds={player.playedSeconds}
        duration={player.duration}
      />
      <div className="flex-1" />
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      <ViewerFloatingBarButton
        label={labels.download}
        icon={Download}
        onClick={onDownload}
        showTooltip={player.showControls}
      />
      <ViewerFloatingBarButton
        label={player.isFullscreen ? labels.exitFullscreen : labels.fullscreen}
        icon={player.isFullscreen ? Minimize : Maximize}
        onClick={player.toggleFullscreen}
        showTooltip={player.showControls}
      />
    </div>
  </ViewerFloatingBar>
);
