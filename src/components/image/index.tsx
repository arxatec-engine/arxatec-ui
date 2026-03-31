import { cn } from "@/utilities";
import React, { useEffect, useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  errorImage?: string;
  onImageError?: () => void;
  onImageLoaded?: () => void;
  classNameImage?: string;
}

export const Image: React.FC<Props> = ({
  src,
  alt = "",
  errorImage = "/image_error.png",
  onImageError,
  onImageLoaded,
  className = "",
  classNameImage = "",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onImageError) {
      onImageError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (onImageLoaded) {
      onImageLoaded();
    }
  };

  useEffect(() => {
    if (src?.trim().length === 0) {
      setHasError(true);
    }
  }, [src]);

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent animate-pulse">
          <span className="sr-only">Cargando imagen...</span>
        </div>
      )}

      <img
        src={hasError ? errorImage : src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "transition-opacity duration-300 w-full h-full object-cover",
          isLoading ? "opacity-0" : "opacity-100",
          classNameImage
        )}
        {...props}
      />
    </div>
  );
};
