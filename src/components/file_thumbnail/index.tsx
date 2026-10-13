import {
  forwardRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "../../utilities/class";
import { Skeleton } from "../skeleton";

export interface FileThumbnailProps extends ComponentProps<"div"> {
  source?: string | null;
  isLoading?: boolean;
  isError?: boolean;
  fallback: ReactNode;
  alt?: string;
  imageClassName?: string;
  onImageError?: ComponentProps<"img">["onError"];
}

interface ThumbnailImageProps {
  source: string;
  alt: string;
  fallback: ReactNode;
  className?: string;
  onError?: ComponentProps<"img">["onError"];
}

function ThumbnailImage({
  source,
  alt,
  fallback,
  className,
  onError,
}: ThumbnailImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;

  return (
    <img
      src={source}
      alt={alt}
      loading="lazy"
      className={cn("size-full object-cover object-top", className)}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}

/** Displays a supplied thumbnail URL; fetching and rendering previews belong to the consumer. */
export const FileThumbnail = forwardRef<HTMLDivElement, FileThumbnailProps>(
  function FileThumbnail(
    {
      source,
      isLoading = false,
      isError = false,
      fallback,
      alt = "",
      imageClassName,
      onImageError,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex size-full items-center justify-center overflow-hidden",
          className,
        )}
        {...props}
      >
        {isError ? (
          fallback
        ) : isLoading ? (
          <Skeleton className="size-full rounded-none" />
        ) : source ? (
          <ThumbnailImage
            key={source}
            source={source}
            alt={alt}
            fallback={fallback}
            className={imageClassName}
            onError={onImageError}
          />
        ) : (
          fallback
        )}
      </div>
    );
  },
);
