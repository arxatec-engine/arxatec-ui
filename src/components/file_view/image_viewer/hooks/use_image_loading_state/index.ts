import { useState } from "react";

interface UseImageLoadingStateParams {
  imageUrl: string | undefined;
  isPending: boolean;
  isConverting: boolean;
}

export const useImageLoadingState = ({
  imageUrl,
  isPending,
  isConverting,
}: UseImageLoadingStateParams) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const isLoading = isPending || isConverting || !imageUrl || !imageLoaded;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageLoaded(true);
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  return {
    imageLoaded,
    imageSize,
    isLoading,
    onImageLoad: handleImageLoad,
  };
};
