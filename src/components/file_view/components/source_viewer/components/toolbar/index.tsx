import { Check, Copy, Download, WrapText, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/utilities/class";
import { Separator } from "@/components/separator";

import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";
import { ViewerFloatingBarButton } from "../../../viewer_floating_bar/components/viewer_floating_bar_button";
import type { useSourceViewerControls } from "../../hooks/use_source_viewer_controls";
import type { FileSourceViewerLabels } from "../../types";

interface Props {
  className?: string;
  controls: ReturnType<typeof useSourceViewerControls>;
  labels: FileSourceViewerLabels;
}

export const SourceToolbar = ({ controls, labels, className }: Props) => (
  <ViewerFloatingBar
    data-slot="source-toolbar"
    ariaLabel={labels.toolbar}
    className={cn(className)}
  >
    <ViewerFloatingBarButton
      label={labels.zoomOut}
      icon={ZoomOut}
      onClick={controls.zoomOut}
      disabled={controls.fontSize <= 10}
    />
    <ViewerFloatingBarValue className="font-normal">
      {Math.round((controls.fontSize / 14) * 100)}%
    </ViewerFloatingBarValue>
    <ViewerFloatingBarButton
      label={labels.zoomIn}
      icon={ZoomIn}
      onClick={controls.zoomIn}
      disabled={controls.fontSize >= 24}
    />
    <Separator orientation="vertical" className="mx-0.5 h-6" />
    <ViewerFloatingBarButton
      label={labels.wrapLines}
      icon={WrapText}
      onClick={controls.toggleWrap}
      aria-pressed={controls.wrapLines}
      className="aria-pressed:bg-muted"
    />
    <ViewerFloatingBarButton
      label={controls.copied ? labels.copied : labels.copy}
      icon={controls.copied ? Check : Copy}
      onClick={controls.copy}
    />
    <ViewerFloatingBarButton
      label={labels.download}
      icon={Download}
      onClick={controls.download}
    />
    <span role="status" className="sr-only">
      {controls.copied ? labels.copied : ""}
    </span>
  </ViewerFloatingBar>
);
