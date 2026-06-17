import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  playing: boolean;
  played: number;
  playedSeconds: number;
  duration: number;
  volume: number;
  muted: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  isHovering: boolean;
  isReady: boolean;
  isBuffering: boolean;
  hasError: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handlePlayPause: () => void;
  handleSeekChange: (value: number[]) => void;
  handleVolumeChange: (value: number[]) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  resetControlsTimeout: () => void;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  handleCanPlay: () => void;
  handleWaiting: () => void;
  handlePlaying: () => void;
  handlePause: () => void;
  handleEnded: () => void;
  handleError: () => void;
}

export const useVideoPlayer = (url: string): UseVideoPlayerReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showControls = isHovering || !playing || !controlsHidden;

  const clearControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = undefined;
    }
  }, []);

  const resetControlsTimeout = useCallback(() => {
    clearControlsTimeout();
    setControlsHidden(false);
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsHidden(true);
    }, 3000);
  }, [clearControlsTimeout]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setControlsHidden(false);
    clearControlsTimeout();
  }, [clearControlsTimeout]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    loadTimeoutRef.current = setTimeout(() => {
      setIsReady((currentReady) => {
        if (!currentReady) {
          console.warn("El video no se cargó en 10 segundos, verificando URL:", url);
          setHasError(true);
        }
        return currentReady;
      });
    }, 10000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      clearControlsTimeout();
    };
  }, [url, clearControlsTimeout]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing && video.paused) {
      video.play().catch((error) => {
        console.error("Error al reproducir:", error);
      });
    } else if (!playing && !video.paused) {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error("Error al reproducir:", error);
        toast.error("Error al reproducir el video");
      });
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    const total = video.duration;
    if (total > 0) {
      setPlayed(current / total);
      setPlayedSeconds(current);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setDuration(video.duration);
    setIsReady(true);
    setIsBuffering(false);
    setHasError(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };

  const handleCanPlay = () => {
    setIsReady(true);
    setIsBuffering(false);
    setHasError(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
    setPlaying(true);
    resetControlsTimeout();
  };

  const handlePause = () => {
    setPlaying(false);
    setControlsHidden(false);
    clearControlsTimeout();
  };

  const handleEnded = () => {
    setPlaying(false);
    setPlayed(0);
    setPlayedSeconds(0);
    setControlsHidden(false);
    clearControlsTimeout();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleError = () => {
    console.error("Error en el reproductor de video");
    console.error("URL del video:", url);
    setIsReady(false);
    setHasError(true);
    setIsBuffering(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    toast.error("Error al reproducir el video");
  };

  const handleSeekChange = (value: number[]) => {
    const newValue = value[0] / 100;
    setPlayed(newValue);
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = newValue * duration;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (newVolume > 0) {
      setMuted(false);
    }
  };

  const toggleMute = () => {
    setMuted((current) => !current);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return {
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
  };
};
