import { cn } from "@/utilities/class";

import { useThumbnailVisibility } from "../../hooks/use_thumbnail_visibility";
import type { PresentationNavigationProps } from "../../types";
import { PresentationSlide } from "../slide";

interface Props extends PresentationNavigationProps {
  index: number;
}

export const PresentationThumbnail = ({
  presentation,
  activeIndex,
  idPrefix,
  onSelect,
  index,
  labels,
  className,
}: Props) => {
  const active = index === activeIndex;
  const { buttonRef, visible } = useThumbnailVisibility(index, active);
  // Do not touch lazy slide getters until the thumbnail enters the viewport.
  const hidden = (visible || active) && presentation.slides[index].hidden;
  return (
    <button
      data-slot="presentation-thumbnail"
      ref={buttonRef}
      type="button"
      aria-label={`${labels.slide} ${index + 1}${hidden ? `, ${labels.hidden.toLowerCase()}` : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(index)}
      className={cn(
        "w-28 shrink-0 rounded-md border p-1 text-xs text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-36",
        active
          ? "border-primary bg-accent text-foreground"
          : "border-transparent hover:bg-accent",
        className,
      )}
    >
      <div
        className="overflow-hidden rounded-sm border border-border bg-white"
        style={{
          aspectRatio: `${presentation.width} / ${presentation.height}`,
        }}
      >
        {(visible || active) && (
          <PresentationSlide
            presentation={presentation}
            index={index}
            idPrefix={`${idPrefix}-thumb-${index}-`}
            thumbnail
          />
        )}
      </div>
      <span className="mt-1 block truncate">
        {index + 1}
        {hidden ? ` · ${labels.hidden}` : ""}
      </span>
    </button>
  );
};
