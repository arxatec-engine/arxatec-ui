import { cn } from "@/utilities/class";
import { Slider } from "@/components/slider";

import { formatTime } from "../../utilities";

interface Props {
  className?: string;
  played: number;
  playedSeconds: number;
  duration: number;
  onSeekChange: (value: number[]) => void;
  disabled?: boolean;
  label: string;
}

export const VideoProgressBar = ({
  className,
  played,
  playedSeconds,
  duration,
  onSeekChange,
  disabled,
  label,
}: Props) => {
  return (
    <div data-slot="video-progress-bar" className={cn("w-full", className)}>
      <Slider
        value={[played * 100]}
        onValueChange={onSeekChange}
        min={0}
        max={100}
        step={0.1}
        disabled={disabled}
        aria-label={label}
        aria-valuetext={`${formatTime(playedSeconds)} / ${formatTime(duration)}`}
        className="w-full cursor-pointer py-1 [&_[data-slot=slider-thumb]]:size-3"
      />
    </div>
  );
};
