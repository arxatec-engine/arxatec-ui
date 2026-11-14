import { cn } from "@/utilities/class";

import { usePresentationSlide } from "../../hooks/use_presentation_slide";
import type { Presentation } from "../../utilities/presentation";

interface Props {
  className?: string;
  presentation: Presentation;
  index: number;
  direction?: number;
  idPrefix: string;
  thumbnail?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onSlideLink?: (index: number) => void;
}

export const PresentationSlide = (props: Props) => {
  const hostRef = usePresentationSlide(props);
  return (
    <div
      ref={hostRef}
      data-slot="presentation-slide"
      data-presentation-slide={props.index + 1}
      aria-hidden={props.thumbnail || undefined}
      className={cn("h-full w-full", props.className)}
    />
  );
};
