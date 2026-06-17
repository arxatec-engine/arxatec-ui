interface ConstrainPositionParams {
  x: number;
  y: number;
  scale: number;
  imageSize: { width: number; height: number };
  containerSize: { width: number; height: number };
}

export const constrainPosition = ({
  x,
  y,
  scale,
  imageSize,
  containerSize,
}: ConstrainPositionParams): { x: number; y: number } => {
  if (!containerSize.width || !imageSize.width) {
    return { x, y };
  }

  const scaledWidth = imageSize.width * scale;
  const scaledHeight = imageSize.height * scale;

  const maxX = Math.max(0, (scaledWidth - containerSize.width) / 2 + 100);
  const maxY = Math.max(0, (scaledHeight - containerSize.height) / 2 + 100);

  return {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxY, Math.min(maxY, y)),
  };
};

export const zoomIn = (currentScale: number, step: number = 0.25): number => {
  return Math.min(currentScale + step, 4);
};

export const zoomOut = (currentScale: number, step: number = 0.25): number => {
  return Math.max(currentScale - step, 0.25);
};

export const rotate = (currentRotation: number, step: number = 90): number => {
  return (currentRotation + step) % 360;
};

export const calculateWheelZoom = (
  currentScale: number,
  deltaY: number,
  sensitivity: number = 0.01,
): number => {
  const delta = -deltaY * sensitivity;
  return Math.max(0.25, Math.min(4, currentScale + delta * 0.25));
};
