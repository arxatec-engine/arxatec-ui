import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
  isBuffering: boolean;
}

export const VideoLoadingOverlay: React.FC<Props> = ({ isBuffering }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-white" />
        <p className="text-white text-sm">
          {isBuffering ? "Cargando..." : "Preparando video..."}
        </p>
      </div>
    </div>
  );
};
