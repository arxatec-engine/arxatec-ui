import { useState } from "react";
import {
  zoomIn,
  zoomOut,
  rotate,
  calculateWheelZoom,
  constrainPosition,
} from "../../utils/transformations";

interface UseImageTransformsParams {
  imageSize: { width: number; height: number };
  containerSize: { width: number; height: number };
}

export const useImageTransforms = ({ imageSize, containerSize }: UseImageTransformsParams) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((current) => zoomIn(current));
  };

  const handleZoomOut = () => {
    setScale((current) => zoomOut(current));
  };

  const handleRotate = () => {
    setRotation((current) => rotate(current));
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;

    e.preventDefault();
    setScale((current) => calculateWheelZoom(current, e.deltaY));
  };

  const updatePosition = (x: number, y: number) => {
    setPosition(
      constrainPosition({
        x,
        y,
        scale,
        imageSize,
        containerSize,
      }),
    );
  };

  return {
    scale,
    rotation,
    position,
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    rotate: handleRotate,
    reset: handleReset,
    onWheel: handleWheel,
    updatePosition,
  };
};
