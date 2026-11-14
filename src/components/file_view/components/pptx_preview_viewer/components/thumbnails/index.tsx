import { useLayoutEffect, useRef } from "react";

import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import type { PresentationNavigationProps } from "../../types";
import { PresentationThumbnail } from "../thumbnail";

interface Props extends PresentationNavigationProps {
  open: boolean;
  mounted: boolean;
}

export const PresentationThumbnails = ({
  open,
  mounted,
  className,
  ...props
}: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    panelRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  return (
    <div
      ref={panelRef}
      data-slot="presentation-thumbnails"
      data-presentation-thumbnails=""
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      className={cn(
        "order-2 h-0 w-full shrink-0 overflow-hidden opacity-0 transition-[width,height,opacity] duration-200 ease-in-out motion-reduce:transition-none md:order-none md:h-full md:w-0",
        open && "h-28 opacity-100 md:w-44",
        className,
      )}
    >
      {/* Mount on first use, then retain the strip through collapse and reversal. */}
      {mounted && (
        <nav
          id={`${props.idPrefix}-thumbnails`}
          aria-label={props.labels.thumbnails}
          className="h-28 w-full border-t border-border bg-card md:h-full md:w-44 md:border-r md:border-t-0"
        >
          <ScrollArea className="h-full w-full">
            <div className="flex w-max gap-1 p-2 md:w-full md:flex-col md:items-center">
              {Array.from(
                { length: props.presentation.slides.length },
                (_, index) => (
                  <PresentationThumbnail key={index} {...props} index={index} />
                ),
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </nav>
      )}
    </div>
  );
};
