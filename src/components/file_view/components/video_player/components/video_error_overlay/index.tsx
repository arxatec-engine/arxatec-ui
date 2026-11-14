import { FileVideo } from "lucide-react";

import { cn } from "@/utilities/class";
import { Button } from "@/components/button";

import type { FileVideoPlayerLabels } from "../../types";

interface Props {
  className?: string;
  onDownload: () => void;
  labels: FileVideoPlayerLabels;
}

export const VideoErrorOverlay = ({ className, onDownload, labels }: Props) => (
  <div
    data-slot="video-error-overlay"
    className={cn(
      "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background px-6 pb-28 text-center text-foreground",
      className,
    )}
    role="status"
  >
    <div className="flex size-12 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
      <FileVideo className="size-5" aria-hidden="true" />
    </div>
    <p className="text-sm font-medium">{labels.errorTitle}</p>
    <p className="max-w-sm text-sm text-muted-foreground">
      {labels.errorDescription}
    </p>
    <Button type="button" onClick={onDownload} variant="outline" size="sm">
      {labels.download}
    </Button>
  </div>
);
