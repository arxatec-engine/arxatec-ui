import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { toast } from "sonner";

import { VIDEO_PLAYER_LABELS } from "../../constants";
import type { FileVideoPlayerLabels } from "../../types";
import { useVideoControlsVisibility } from "../use_video_controls_visibility";

export const useVideoPlayer = (
  url: string,
  customLabels?: Partial<FileVideoPlayerLabels>,
) => {
  const labels = { ...VIDEO_PLAYER_LABELS, ...customLabels };
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const visibility = useVideoControlsVisibility();

  useEffect(() => {
    const video = videoRef.current;
    video?.load();
    return () => video?.pause();
  }, [url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video || !isReady || hasError) return;
    visibility.resetControlsTimeout();
    if (!video.paused) {
      video.pause();
    } else {
      video.play().catch(() => {
        setPlaying(false);
        toast.error(labels.playbackError);
      });
    }
  };

  const seekTo = (seconds: number) => {
    if (!videoRef.current || !Number.isFinite(seconds) || duration <= 0) return;
    const time = Math.max(0, Math.min(duration, seconds));
    videoRef.current.currentTime = time;
    setPlayedSeconds(time);
    visibility.resetControlsTimeout();
  };

  const toggleMute = () => {
    visibility.resetControlsTimeout();
    if (muted || volume === 0) {
      if (volume === 0) setVolume(0.8);
      setMuted(false);
    } else {
      setMuted(true);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement === container) {
        await document.exitFullscreen?.();
      } else {
        await container.requestFullscreen?.();
      }
    } catch {
      toast.error(labels.fullscreenError);
    }
    visibility.resetControlsTimeout();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (
      (event.target as HTMLElement).closest(
        "button, input, textarea, select, a, [role=slider], [contenteditable=true]",
      )
    )
      return;
    switch (event.key.toLowerCase()) {
      case " ":
      case "k":
        handlePlayPause();
        break;
      case "arrowleft":
        seekTo((videoRef.current?.currentTime ?? 0) - 5);
        break;
      case "arrowright":
        seekTo((videoRef.current?.currentTime ?? 0) + 5);
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        void toggleFullscreen();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return {
    videoRef,
    containerRef,
    playing,
    played: duration > 0 ? playedSeconds / duration : 0,
    playedSeconds,
    duration,
    volume,
    muted,
    isFullscreen,
    isReady,
    isBuffering,
    hasError,
    ...visibility,
    handlePlayPause,
    handleSeekChange: (value: number[]) => seekTo((value[0] / 100) * duration),
    handleVolumeChange: (value: number[]) => {
      visibility.resetControlsTimeout();
      setVolume(Math.max(0, Math.min(1, value[0] / 100)));
      setMuted(value[0] === 0);
    },
    toggleMute,
    toggleFullscreen,
    handleKeyDown,
    handleTimeUpdate: () =>
      setPlayedSeconds(videoRef.current?.currentTime ?? 0),
    handleLoadedMetadata: () => {
      const total = videoRef.current?.duration ?? 0;
      setDuration(Number.isFinite(total) ? total : 0);
      setIsReady(true);
      setHasError(false);
      setIsBuffering(false);
    },
    handleCanPlay: () => {
      setIsReady(true);
      setIsBuffering(false);
      setHasError(false);
    },
    handleWaiting: () => setIsBuffering(true),
    handlePlaying: () => {
      setIsBuffering(false);
      setPlaying(true);
    },
    handlePause: () => {
      setPlaying(false);
      setIsBuffering(false);
    },
    handleEnded: () => {
      setPlaying(false);
      setPlayedSeconds(duration);
    },
    handleError: () => {
      setIsReady(false);
      setHasError(true);
      setPlaying(false);
      setIsBuffering(false);
    },
  };
};

export type UseVideoPlayerReturn = ReturnType<typeof useVideoPlayer>;
