import { formatTime } from "../../utils";

interface Props {
  playedSeconds: number;
  duration: number;
  mobile?: boolean;
}

export const VideoTimeDisplay = ({
  playedSeconds,
  duration,
  mobile = false,
}: Props) => {
  if (mobile) {
    return (
      <div className="text-white text-sm font-medium sm:hidden">
        {formatTime(playedSeconds)} / {formatTime(duration)}
      </div>
    );
  }

  return (
    <div className="text-white text-sm font-medium hidden sm:flex items-center gap-1">
      <span>{formatTime(playedSeconds)}</span>
      <span className="text-white/60">/</span>
      <span className="text-white/60">{formatTime(duration)}</span>
    </div>
  );
};
