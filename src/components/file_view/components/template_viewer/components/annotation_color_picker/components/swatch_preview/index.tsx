import { cn } from "@/utilities/class";
import { type ShapeColorValue } from "../../../../utilities";

const SwatchPreview = ({
  color,
  className,
}: {
  color: ShapeColorValue;
  className?: string;
}) => {
  if (color === "transparent") {
    return (
      <div
        className={cn(
          "size-5 rounded-sm border border-border bg-size-[6px_6px] bg-position-[0_0,3px_3px]",
          className,
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
        }}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn("size-5 rounded-sm border border-border", className)}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  );
};

export { SwatchPreview };
