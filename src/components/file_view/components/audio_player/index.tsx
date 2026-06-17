import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { downloadFileFromUrl } from "@/utilities/download";
import { FileViewErrorState } from "../error_state";
import { Button } from "@/components/button";
import { Slider } from "@/components/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import {
  Download,
  Pause,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Headphones,
} from "lucide-react";

const formatTime = (seconds: number) => {
  if (Number.isNaN(seconds) || !Number.isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export interface FileAudioPlayerProps {
  url: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
}

const FileAudioPlayerContent: React.FC<FileAudioPlayerProps> = ({
  url,
  fileName,
  onDownload,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDownloadFile = async () => {
    try {
      if (onDownload) {
        await onDownload();
        return;
      }
      await downloadFileFromUrl(url, fileName);
    } catch {
      toast.error("No se pudo descargar el audio");
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime || 0);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error(error);
          setHasError(true);
          toast.error("No se pudo reproducir el audio");
        });
    }
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const [val] = value;
    const newTime = (val / 100) * (duration || 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const [val] = value;
    const newVolume = val / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      handlePlayPause();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
  };

  const handleAudioError = () => {
    setHasError(true);
    toast.error("Ha ocurrido un error al cargar el audio");
  };

  if (hasError) return <FileViewErrorState />;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm">
        <div className="flex flex-col min-w-0" />

        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={handleDownloadFile}
              variant="ghost"
              size="icon"
              aria-label="Descargar audio"
            >
              <Download className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Descargar audio</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 flex-col gap-4">
        <div className="w-full h-full p-4 rounded-md flex items-center justify-center bg-card">
          <Headphones className="size-10 text-muted-foreground" />
        </div>
        <div className="w-full bg-card border border-border rounded-md p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              className="rounded-md size-11"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause fill="currentColor" className="size-5" />
              ) : (
                <Play fill="currentColor" className="size-5 translate-x-px" />
              )}
            </Button>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {fileName || "Pista de audio"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-md"
                    onClick={handleRestart}
                    aria-label="Reiniciar"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reiniciar</TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-2 w-32">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-md"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  aria-label="Volumen"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              max={100}
              step={0.5}
              onValueChange={handleSeek}
              aria-label="Progreso"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleAudioError}
      />
    </div>
  );
};

export const FileAudioPlayer: React.FC<FileAudioPlayerProps> = (props) => {
  if (!props.url) return <FileViewErrorState />;

  return <FileAudioPlayerContent key={props.url} {...props} />;
};
