import { cn } from "@/utilities/class";

import { VideoControls } from "../video_controls";
import type { UseVideoPlayerReturn } from "../../hooks/use_video_player";
import type { FileVideoPlayerLabels } from "../../types";

interface Props {
  className?: string;
  player: Omit<UseVideoPlayerReturn, "videoRef" | "containerRef">;
  onDownload: () => void;
  labels: FileVideoPlayerLabels;
}

export const VideoOverlay = ({
  className,
  player,
  onDownload,
  labels,
}: Props) => (
  <div
    data-slot="video-controls-overlay"
    className={cn(
      "pointer-events-none absolute inset-0 z-20 transition-opacity duration-200 motion-reduce:transition-none",
      player.showControls ? "opacity-100" : "opacity-0",
      className,
    )}
  >
    <VideoControls player={player} onDownload={onDownload} labels={labels} />
  </div>
);
