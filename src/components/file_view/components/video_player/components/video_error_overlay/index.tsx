import { cn } from "@/utilities/class";
import { Button } from "@/components/button";

import { FileViewErrorState } from "../../../error_state";
import type { FileVideoPlayerLabels } from "../../types";

interface Props {
  className?: string;
  onDownload: () => void;
  labels: FileVideoPlayerLabels;
}

export const VideoErrorOverlay = ({ className, onDownload, labels }: Props) => (
  <div data-slot="video-error-overlay" className={cn("absolute inset-0 z-10", className)}>
    <FileViewErrorState
      title={labels.errorTitle}
      description={labels.errorDescription}
      className="pb-28"
      actions={
        <Button type="button" onClick={onDownload} variant="outline" size="sm">
          {labels.download}
        </Button>
      }
    />
  </div>
);
