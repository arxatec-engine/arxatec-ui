import { Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { cn } from "@/utilities/class";
import { downloadFileFromUrl } from "@/utilities/download";

import { useVideoPlayer } from "../../hooks";
import { useFileViewLoadingChange } from "../../../../hooks";
import { VideoOverlay } from "../video_overlay";
import { VideoErrorOverlay } from "../video_error_overlay";
import { VIDEO_PLAYER_LABELS } from "../../constants";
import type { FileVideoPlayerProps } from "../../types";

export const FileVideoPlayerContent = ({
  url,
  fileName,
  onDownload,
  onLoadingChange,
  labels: customLabels,
  className,
}: FileVideoPlayerProps) => {
  const labels = { ...VIDEO_PLAYER_LABELS, ...customLabels };
  const { videoRef, containerRef, ...player } = useVideoPlayer(url, labels);
  useFileViewLoadingChange(
    (!player.isReady && !player.hasError) || player.isBuffering,
    onLoadingChange,
  );

  const download = async () => {
    try {
      if (onDownload) await onDownload();
      else await downloadFileFromUrl(url, fileName);
    } catch {
      toast.error(labels.downloadError);
    }
  };

  return (
    <div
      ref={containerRef}
      data-slot="file-video-player"
      role="region"
      aria-label={fileName ?? labels.toolbar}
      aria-keyshortcuts="Space K ArrowLeft ArrowRight M F"
      tabIndex={0}
      className={cn(
        "@container/video relative h-full min-h-0 w-full min-w-0 overflow-hidden bg-muted/30 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        !player.showControls && "cursor-none",
        className,
      )}
      onPointerEnter={player.handleMouseEnter}
      onPointerLeave={player.handleMouseLeave}
      onPointerMove={player.handlePointerMove}
      onPointerDownCapture={player.handlePointerDown}
      onClickCapture={player.resetControlsTimeout}
      onFocusCapture={player.resetControlsTimeout}
      onKeyDownCapture={player.resetControlsTimeout}
      onWheelCapture={player.resetControlsTimeout}
      onKeyDown={player.handleKeyDown}
    >
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 size-full object-contain"
        playsInline
        preload="auto"
        aria-label={fileName}
        onClick={player.handlePlayPause}
        onTimeUpdate={player.handleTimeUpdate}
        onLoadedMetadata={player.handleLoadedMetadata}
        onDurationChange={player.handleLoadedMetadata}
        onCanPlay={player.handleCanPlay}
        onWaiting={player.handleWaiting}
        onPlaying={player.handlePlaying}
        onPause={player.handlePause}
        onEnded={player.handleEnded}
        onError={player.handleError}
      />
      {player.isReady && !player.playing && !player.hasError && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center pb-16 transition-opacity duration-200 motion-reduce:transition-none",
            player.showControls ? "opacity-100" : "opacity-0",
          )}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className={cn(
              "size-14 rounded-full border border-border bg-card text-card-foreground shadow-lg",
              player.showControls
                ? "pointer-events-auto"
                : "pointer-events-none",
            )}
            aria-label={labels.play}
            onClick={player.handlePlayPause}
          >
            <Play
              className="size-6 translate-x-px"
              fill="currentColor"
              aria-hidden="true"
            />
          </Button>
        </div>
      )}
      {player.hasError && (
        <VideoErrorOverlay onDownload={download} labels={labels} />
      )}
      <VideoOverlay player={player} onDownload={download} labels={labels} />
    </div>
  );
};
