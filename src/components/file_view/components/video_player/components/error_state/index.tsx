import { FileX } from "lucide-react";

import { cn } from "@/utilities/class";
import { StatusMessage } from "@/components/status_message";

import { useFileViewLoadingChange } from "../../../../hooks";
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
    <div
      data-slot="video-error-state"
      className={cn("p-4 h-full w-full", className)}
    >
      <StatusMessage
        title={labels.errorTitle}
        icon={FileX}
        description={labels.errorDescription}
        classNameCard="w-full h-full flex-col items-center justify-center"
        classNameIconCard="mx-auto"
        classNameDescription="text-center w-full max-w-sm"
        classNameTitle="text-center w-full"
      />
    </div>
  );
};
