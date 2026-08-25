import { Slider } from "@/components/slider";

interface Props {
  played: number;
  onSeekChange: (value: number[]) => void;
}

export const VideoProgressBar = ({ played, onSeekChange }: Props) => {
  return (
    <div className="w-full">
      <Slider
        value={[played * 100]}
        onValueChange={onSeekChange}
        min={0}
        max={100}
        step={0.1}
        className="w-full cursor-pointer"
      />
    </div>
  );
};
