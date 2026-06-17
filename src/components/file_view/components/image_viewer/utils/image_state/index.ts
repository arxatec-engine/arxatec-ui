export const isImageLoaded = (
  imageElement: HTMLImageElement | null,
  expectedSrc: string,
): boolean => {
  return (
    imageElement !== null &&
    imageElement.src === expectedSrc &&
    imageElement.complete &&
    imageElement.naturalWidth > 0
  );
};

export const getImageDimensions = (
  imageElement: HTMLImageElement | null,
): { width: number; height: number } | null => {
  if (!imageElement || !imageElement.complete || imageElement.naturalWidth === 0) {
    return null;
  }

  return {
    width: imageElement.naturalWidth,
    height: imageElement.naturalHeight,
  };
};
