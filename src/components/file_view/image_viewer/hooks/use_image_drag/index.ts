import { useState, useRef } from "react";

interface UseImageDragParams {
  position: { x: number; y: number };
  isImageLoaded: boolean;
  isPending: boolean;
  isError: boolean;
  updatePosition: (x: number, y: number) => void;
}

export const useImageDrag = ({
  position,
  isImageLoaded,
  isPending,
  isError,
  updatePosition,
}: UseImageDragParams) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPending || isError || !isImageLoaded) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    updatePosition(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
};
