import { ErrorState, LoadingState, Toolbar } from "..";
import { useFileImageViewer } from "../../hooks";
import type { FileImageViewerProps } from "../../types";

const FileImageViewerContent = (props: FileImageViewerProps) => {
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

  return (
    <div className="relative flex flex-col bg-background h-full w-full">
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden p-6 flex items-center justify-center"
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
      </div>

      <Toolbar
        handleZoomOut={zoomOut}
        handleZoomIn={zoomIn}
        scale={scale}
        isPending={isPending}
        isError={isError}
        handleDownloadFile={download}
        handleRotate={rotate}
        handleReset={reset}
      />
    </div>
  );
};

export { FileImageViewerContent };
