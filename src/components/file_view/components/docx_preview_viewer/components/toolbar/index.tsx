import { Download, ZoomIn, ZoomOut } from "lucide-react";

import { Separator } from "@/components/separator";
import { cn } from "@/utilities/class";

import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";
import { ViewerFloatingBarButton } from "../../../viewer_floating_bar/components/viewer_floating_bar_button";
import { WORD_DOCUMENT_LABELS } from "../../constants/labels";
import type { FileDocxPreviewViewerLabels } from "../../types";

interface Props {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  disabled?: boolean;
  labels?: FileDocxPreviewViewerLabels;
  className?: string;
}

export const Toolbar = ({
  scale,
  onZoomIn,
  onZoomOut,
  onDownload,
  disabled = false,
  labels = WORD_DOCUMENT_LABELS,
  className,
}: Props) => (
  <ViewerFloatingBar
    ariaLabel={labels.toolbar}
    data-slot="word-document-toolbar"
    className={cn(className)}
  >
    <ViewerFloatingBarButton
      label={labels.zoomOut}
      icon={ZoomOut}
      onClick={onZoomOut}
      disabled={scale <= 0.5 || disabled}
    />
    <ViewerFloatingBarValue>{Math.round(scale * 100)}%</ViewerFloatingBarValue>
    <ViewerFloatingBarButton
      label={labels.zoomIn}
      icon={ZoomIn}
      onClick={onZoomIn}
      disabled={scale >= 3 || disabled}
    />
    <Separator orientation="vertical" className="mx-0.5 h-6" />
    <ViewerFloatingBarButton
      label={labels.download}
      icon={Download}
      onClick={onDownload}
      disabled={disabled}
    />
  </ViewerFloatingBar>
);
