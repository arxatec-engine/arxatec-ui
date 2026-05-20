import { useRef } from "react";
import { toast } from "sonner";
import { downloadFileFromUrl } from "@/utilities/download";
import { useHeicConversion } from "../use_heic_conversion";
import { useImageLoadingState } from "../use_image_loading_state";
import { useImageTransforms } from "../use_image_transforms";
import { useImageDrag } from "../use_image_drag";
import { useContainerSize } from "../use_container_size";

export interface UseFileImageViewerParams {
  url: string | undefined;
  mimeType?: string;
  fileId?: string;
  fileName?: string;
  onDownload?: () => void | Promise<void>;
  isPending?: boolean;
  isError?: boolean;
}

export const useFileImageViewer = ({
  url,
  mimeType,
  fileName,
  onDownload,
  isPending = false,
  isError = false,
}: UseFileImageViewerParams) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { imageUrl, isConverting } = useHeicConversion({
    imageUrl: url,
    mimeType,
  });

  const { containerSize, containerRef } = useContainerSize();

  const { imageLoaded, imageSize, isLoading, onImageLoad } = useImageLoadingState({
    imageUrl,
    isPending,
    isConverting,
  });

  const { scale, rotation, position, zoomIn, zoomOut, rotate, reset, onWheel, updatePosition } =
    useImageTransforms({
      imageSize,
      containerSize,
    });

  const {
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  } = useImageDrag({
    position,
    isImageLoaded: imageLoaded,
    isPending,
    isError,
    updatePosition,
  });

  const download = async () => {
    try {
      if (onDownload) {
        await onDownload();
        return;
      }
      if (!url) return;
      await downloadFileFromUrl(url, fileName);
    } catch (err) {
      console.error(err);
      toast.error("Error downloading image");
    }
  };

  const setImageRef = (img: HTMLImageElement | null) => {
    imageRef.current = img;
  };

  return {
    data: imageUrl,
    isPending: isPending || isConverting,
    isError,
    isLoading,
    containerRef,
    imageRef: setImageRef,
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
  };
};
