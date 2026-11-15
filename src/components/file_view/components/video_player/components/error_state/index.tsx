import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../../../hooks";
import { FileViewErrorState } from "../../../error_state";
import { VIDEO_PLAYER_LABELS } from "../../constants";
import type { FileVideoPlayerProps } from "../../types";

export const ErrorState = ({
  labels: customLabels,
  onLoadingChange,
  className,
}: Pick<FileVideoPlayerProps, "labels" | "onLoadingChange" | "className">) => {
  const labels = { ...VIDEO_PLAYER_LABELS, ...customLabels };
  useFileViewLoadingChange(false, onLoadingChange);
  return (
    <div data-slot="video-error-state" className={cn("h-full w-full", className)}>
      <FileViewErrorState
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    </div>
  );
};
