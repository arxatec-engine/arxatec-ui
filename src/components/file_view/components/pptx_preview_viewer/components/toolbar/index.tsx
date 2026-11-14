import type { Ref } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen,
  Scan,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Separator } from "@/components/separator";
import { cn } from "@/utilities/class";

import { ViewerFloatingBarButton } from "../../../viewer_floating_bar/components/viewer_floating_bar_button";
import type { FilePptxPreviewViewerLabels } from "../../types";
import type { usePresentationControls } from "../../hooks/use_presentation_controls";
import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";

interface Props {
  className?: string;
  labels: FilePptxPreviewViewerLabels;
  index: number;
  count: number;
  scale: number;
  zoom: number;
  presenting: boolean;
  controls: ReturnType<typeof usePresentationControls>;
  showThumbnails: boolean;
  thumbnailsId: string;
  toggleRef: Ref<HTMLButtonElement>;
  onToggleThumbnails: () => void;
  onTogglePresentation: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onZoom: (value: number) => void;
  onDownload: () => void;
}

export const PresentationToolbar = ({
  toggleRef,
  controls,
  ...props
}: Props) => {
  return (
    <div
      data-slot="presentation-toolbar"
      className={cn("contents", props.className)}
      onPointerEnter={controls.onPointerEnter}
      onPointerLeave={controls.onPointerLeave}
      onFocusCapture={controls.onFocusCapture}
      onBlurCapture={controls.onBlurCapture}
    >
      <ViewerFloatingBar
        ariaLabel={props.labels.toolbar}
        placement={props.presenting ? "top" : "bottom"}
        className={cn(
          "transition-opacity duration-150 motion-reduce:transition-none",
          !controls.visible &&
            "pointer-events-none opacity-0 focus-within:pointer-events-auto focus-within:opacity-100",
        )}
      >
        <div className="flex items-center gap-1">
          <ViewerFloatingBarButton
            label={props.labels.previous}
            icon={ChevronLeft}
            onClick={props.onPrevious}
            disabled={props.index === 0}
          />
          <ViewerFloatingBarValue>
            {props.index + 1}/{props.count}
          </ViewerFloatingBarValue>
          <ViewerFloatingBarButton
            label={props.labels.next}
            icon={ChevronRight}
            onClick={props.onNext}
            disabled={props.index === props.count - 1}
          />
        </div>
        {!props.presenting && (
          <>
            <div className="flex items-center gap-1">
              <Separator orientation="vertical" className="mx-0.5 h-6" />
              <ViewerFloatingBarButton
                label={props.labels.zoomOut}
                icon={ZoomOut}
                onClick={() => props.onZoom(Math.max(0.5, props.zoom - 0.25))}
                disabled={props.zoom <= 0.5}
              />
              <ViewerFloatingBarValue>
                {Math.round(props.scale * 100)}%
              </ViewerFloatingBarValue>
              <ViewerFloatingBarButton
                label={props.labels.zoomIn}
                icon={ZoomIn}
                onClick={() => props.onZoom(Math.min(3, props.zoom + 0.25))}
                disabled={props.zoom >= 3}
              />
              <ViewerFloatingBarButton
                label={props.labels.fit}
                icon={Scan}
                onClick={() => props.onZoom(1)}
              />
            </div>
            <div className="flex items-center gap-1">
              <Separator orientation="vertical" className="mx-0.5 h-6" />
              <ViewerFloatingBarButton
                label={
                  props.showThumbnails
                    ? props.labels.hideThumbnails
                    : props.labels.showThumbnails
                }
                icon={props.showThumbnails ? PanelLeftClose : PanelLeftOpen}
                aria-expanded={props.showThumbnails}
                aria-controls={props.thumbnailsId}
                onClick={props.onToggleThumbnails}
              />
              <ViewerFloatingBarButton
                label={props.labels.download}
                icon={Download}
                onClick={props.onDownload}
              />
            </div>
          </>
        )}
        <ViewerFloatingBarButton
          label={
            props.presenting
              ? props.labels.exitPresentation
              : props.labels.startPresentation
          }
          icon={props.presenting ? Minimize : Maximize}
          aria-pressed={props.presenting}
          ref={toggleRef}
          onClick={props.onTogglePresentation}
        />
      </ViewerFloatingBar>
    </div>
  );
};
