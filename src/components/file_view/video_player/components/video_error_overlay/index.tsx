import React from "react";
import { Button } from "@/components/button";

interface Props {
  onDownload: () => void;
}

export const VideoErrorOverlay: React.FC<Props> = ({ onDownload }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="flex flex-col items-center gap-3">
        <p className="text-white text-sm text-center px-4">
          No se pudo cargar el video. Por favor, intenta descargarlo.
        </p>
        <Button onClick={onDownload} variant="default" size="sm">
          Descargar video
        </Button>
      </div>
    </div>
  );
};
