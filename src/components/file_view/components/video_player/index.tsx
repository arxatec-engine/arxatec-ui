import React from "react";
import { toast } from "sonner";
import { downloadFileFromUrl } from "@/utilities/download";
import { useVideoPlayer } from "./hooks";
import {
  VideoHeader,
  VideoOverlay,
  VideoLoadingOverlay,
  VideoErrorOverlay,
  ErrorState,
} from "./components";

export interface FileVideoPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
}

const FileVideoPlayerContent: React.FC<FileVideoPlayerProps> = ({
  url,
  fileName,
  onDownload,
}) => {
  const {
    videoRef,
    containerRef,
    playing,
    played,
    playedSeconds,
    duration,
    volume,
    muted,
    isFullscreen,
    showControls,
    isHovering,
    isReady,
    isBuffering,
    hasError,
    handleMouseEnter,
    handleMouseLeave,
    handlePlayPause,
    handleSeekChange,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    resetControlsTimeout,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleCanPlay,
    handleWaiting,
    handlePlaying,
    handlePause,
    handleEnded,
    handleError,
  } = useVideoPlayer(url);

  const handleDownloadFile = async () => {
    try {
      if (onDownload) {
        await onDownload();
        return;
      }
      await downloadFileFromUrl(url, fileName);
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar el video");
    }
  };

  const onMouseLeave = () => {
    handleMouseLeave();
    if (playing) {
      resetControlsTimeout();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <VideoHeader onDownload={handleDownloadFile} />
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative h-full w-full group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={resetControlsTimeout}
      >
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={url}
            className="w-full h-full object-contain xl:object-cover"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>

        {((!isReady && !hasError) || isBuffering) && (
          <VideoLoadingOverlay isBuffering={isBuffering} />
        )}

        {hasError && <VideoErrorOverlay onDownload={handleDownloadFile} />}

        <VideoOverlay
          showControls={showControls}
          isHovering={isHovering}
          isFullscreen={isFullscreen}
          playing={playing}
          played={played}
          playedSeconds={playedSeconds}
          duration={duration}
          volume={volume}
          muted={muted}
          onToggleFullscreen={toggleFullscreen}
          onPlayPause={handlePlayPause}
          onSeekChange={handleSeekChange}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
        />
      </div>
    </div>
  );
};

export const FileVideoPlayer: React.FC<FileVideoPlayerProps> = (props) => {
  if (!props.url) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <div className="flex-1 flex items-center justify-center">
          <ErrorState />
        </div>
      </div>
    );
  }

  return <FileVideoPlayerContent key={props.url} {...props} />;
};
