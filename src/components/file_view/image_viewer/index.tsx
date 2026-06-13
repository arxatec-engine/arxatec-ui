import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { FileViewerFloatingBar } from "../shared";
import { Home, RotateCw } from "lucide-react";
import { ErrorState, LoadingState } from "./components";
import { useFileImageViewer } from "./hooks";

export interface FileImageViewerProps {
  url: string | undefined;
  mimeType?: string;
  fileId?: string;
  fileName?: string;
  isPending?: boolean;
  isError?: boolean;
  onDownload?: () => void | Promise<void>;
}

const FileImageViewerContent: React.FC<FileImageViewerProps> = (props) => {
  const {
    data,
    isPending,
    isError,
    isLoading,
    containerRef,
    imageRef,
    scale,
    rotation,
    position,
    isDragging,
    zoomIn,
    zoomOut,
    rotate,
    reset,
    download,
    onImageLoad,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onWheel,
  } = useFileImageViewer(props);

  const controlsDisabled = isPending || isError;

  return (
    <div className="relative flex h-full w-full flex-col bg-background">
      <div
        ref={containerRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden p-6"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onWheel={onWheel}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : data ? (
          <div className="relative w-full h-full flex-col flex items-center justify-center">
            {isLoading && (
              <LoadingState className="absolute top-0 left-0 w-full h-full" />
            )}
            <img
              ref={imageRef}
              src={data}
              alt="Vista previa"
              className="max-w-full h-auto shadow-lg rounded-lg select-none transition-opacity duration-300"
              style={{
                transform: `
                  translate(${position.x}px, ${position.y}px)
                  scale(${scale})
                  rotate(${rotation}deg)
                `,
                transformOrigin: "center",
                transition: isDragging
                  ? "none"
                  : "transform 0.2s, opacity 0.3s",
                pointerEvents: "none",
                opacity: isLoading ? 0 : 1,
              }}
              onLoad={onImageLoad}
              draggable={false}
            />
          </div>
        ) : null}
        <FileViewerFloatingBar
          scale={scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          minScale={0.25}
          maxScale={4}
          zoomDisabled={controlsDisabled}
          onDownload={download}
          downloadLabel="Descargar imagen"
          downloadDisabled={controlsDisabled}
          ariaLabel="Controles del visor de imagen"
          extraActions={
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label="Rotar imagen"
                    onClick={rotate}
                    disabled={controlsDisabled}
                  >
                    <RotateCw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotar imagen</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label="Centrar imagen"
                    onClick={reset}
                    disabled={controlsDisabled}
                  >
                    <Home className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Centrar imagen</TooltipContent>
              </Tooltip>
            </>
          }
        />
      </div>
    </div>
  );
};

export const FileImageViewer: React.FC<FileImageViewerProps> = ({
  url,
  mimeType,
  fileId,
  fileName,
  isPending = false,
  isError = false,
  onDownload,
}) => {
  const sessionKey = `${fileId ?? "preview"}-${url ?? "empty"}`;

  return (
    <FileImageViewerContent
      key={sessionKey}
      url={url}
      mimeType={mimeType}
      fileId={fileId}
      fileName={fileName}
      isPending={isPending}
      isError={isError}
      onDownload={onDownload}
    />
  );
};
