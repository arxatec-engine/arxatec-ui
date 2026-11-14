import { Volume2, VolumeX } from "lucide-react";

import { cn } from "@/utilities/class";
import { Slider } from "@/components/slider";

import { ViewerFloatingBarButton } from "../../../viewer_floating_bar/components/viewer_floating_bar_button";
import type { FileVideoPlayerLabels } from "../../types";

interface Props {
  className?: string;
  volume: number;
  muted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
  labels: FileVideoPlayerLabels;
  showTooltip?: boolean;
}

export const VideoVolumeControl = ({
  className,
  volume,
  muted,
  onToggleMute,
  onVolumeChange,
  labels,
  showTooltip,
}: Props) => (
  <div
    data-slot="video-volume-control"
    className={cn("flex shrink-0 items-center gap-1", className)}
  >
    <ViewerFloatingBarButton
      label={muted || volume === 0 ? labels.unmute : labels.mute}
      icon={muted || volume === 0 ? VolumeX : Volume2}
      onClick={onToggleMute}
      aria-pressed={muted || volume === 0}
      showTooltip={showTooltip}
    />
    <Slider
      value={[muted ? 0 : volume * 100]}
      onValueChange={onVolumeChange}
      min={0}
      max={100}
      step={1}
      aria-label={labels.volume}
      aria-valuetext={`${Math.round(muted ? 0 : volume * 100)}%`}
      className="mr-2 hidden w-16 cursor-pointer py-2 @min-[420px]/video:flex [&_[data-slot=slider-thumb]]:size-3"
    />
  </div>
);
