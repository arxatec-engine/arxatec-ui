import { cn } from "@/utilities/class";

import { FileViewErrorState } from "../../../error_state";
import type { FileVideoPlayerLabels } from "../../types";

interface Props {
  className?: string;
  labels: FileVideoPlayerLabels;
}

export const VideoErrorOverlay = ({ className, labels }: Props) => (
  <div data-slot="video-error-overlay" className={cn("absolute inset-0 z-10", className)}>
    <FileViewErrorState
      title={labels.errorTitle}
      description={labels.errorDescription}
    />
  </div>
);
