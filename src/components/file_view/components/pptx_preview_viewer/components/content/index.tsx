import { useId, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { cn } from "@/utilities/class";

import { usePresentationNavigation } from "../../hooks/use_presentation_navigation";
import { usePresentationViewport } from "../../hooks/use_presentation_viewport";
import type { FilePptxPreviewViewerLabels } from "../../types";
import { usePresentationControls } from "../../hooks/use_presentation_controls";
import { usePresentationMode } from "../../hooks/use_presentation_mode";
import type { Presentation } from "../../utilities/presentation";
import { PresentationSlide } from "../slide";
import { PresentationThumbnails } from "../thumbnails";
import { PresentationToolbar } from "../toolbar";

interface Props {
  presentation: Presentation;
  onReady: () => void;
  onError: (error: Error) => void;
  onDownload: () => void;
  labels: FilePptxPreviewViewerLabels;
  className?: string;
}

export const PresentationContent = ({
  presentation,
  onReady,
  onError,
  onDownload,
  labels,
  className,
}: Props) => {
  const id = useId().replace(/[^a-z\d_-]/gi, "");
  const { containerRef, toggleRef, presenting, enter, exit } =
    usePresentationMode();
  const controls = usePresentationControls(presenting);
  const [zoom, setZoom] = useState(1);
  const [{ open: showThumbnails, mounted: thumbnailsMounted }, setThumbnails] =
    useState({ open: false, mounted: false });
  const { viewportRef, viewport, inset, bottom, fit } = usePresentationViewport(
    presentation,
    presenting,
    containerRef,
  );
  const scale = fit * (presenting ? 1 : zoom);
  const { index, direction, select, selectFromToolbar, onKeyDown } =
    usePresentationNavigation({
      count: presentation.slides.length,
      viewportRef,
      containerRef,
      presenting,
      exit,
      reveal: controls.reveal,
    });

  return (
    <div
      data-slot="presentation-content"
      ref={containerRef}
      className={cn(
        "flex h-full min-h-0 w-full flex-col outline-none md:flex-row",
        presenting ? "bg-black" : "bg-background",
        className,
      )}
      role="region"
      aria-label={labels.viewer}
      data-presentation-mode={presenting}
      tabIndex={0}
      onPointerMove={controls.reveal}
      onPointerDown={controls.reveal}
      onKeyDown={onKeyDown}
    >
      <PresentationThumbnails
        labels={labels}
        presentation={presentation}
        activeIndex={index}
        idPrefix={id}
        onSelect={select}
        open={showThumbnails && !presenting}
        mounted={thumbnailsMounted}
      />
      <section
        aria-label={`${labels.slide} ${index + 1} ${labels.of} ${presentation.slides.length}`}
        className="relative min-h-0 min-w-0 flex-1"
      >
        <ScrollArea viewportRef={viewportRef} className="h-full w-full">
          <div
            className="grid min-h-full min-w-full place-items-center"
            style={{
              padding: inset,
              paddingBottom: bottom,
              minHeight: Math.max(
                viewport.height,
                presentation.height * scale + inset + bottom,
              ),
              width: Math.max(
                viewport.width,
                presentation.width * scale + inset * 2,
              ),
            }}
          >
            <div
              className={cn(
                "overflow-hidden bg-white",
                !presenting && "rounded-md border border-border",
              )}
              style={{
                width: presentation.width * scale,
                height: presentation.height * scale,
              }}
            >
              <PresentationSlide
                presentation={presentation}
                index={index}
                direction={direction}
                idPrefix={`${id}-slide-${index}-`}
                onReady={onReady}
                onError={onError}
                onSlideLink={select}
              />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <PresentationToolbar
          labels={labels}
          index={index}
          count={presentation.slides.length}
          zoom={zoom}
          scale={scale}
          presenting={presenting}
          controls={controls}
          showThumbnails={showThumbnails}
          thumbnailsId={`${id}-thumbnails`}
          toggleRef={toggleRef}
          onToggleThumbnails={() =>
            setThumbnails(({ open }) => ({ open: !open, mounted: true }))
          }
          onTogglePresentation={presenting ? exit : enter}
          onPrevious={() => selectFromToolbar(index - 1)}
          onNext={() => selectFromToolbar(index + 1)}
          onZoom={setZoom}
          onDownload={onDownload}
        />
      </section>
    </div>
  );
};
