import { cn } from "@/utilities/class";

import { formatTime } from "../../utilities";

interface Props {
  className?: string;
  playedSeconds: number;
  duration: number;
}

export const VideoTimeDisplay = ({
  className,
  playedSeconds,
  duration,
}: Props) => (
  <div
    data-slot="video-time-display"
    className={cn(
      "flex shrink-0 items-center gap-1 whitespace-nowrap px-1 text-xs font-medium tabular-nums",
      className,
    )}
  >
    <span>{formatTime(playedSeconds)}</span>
    <span className="text-muted-foreground">/ {formatTime(duration)}</span>
  </div>
);
