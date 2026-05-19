import { useState, useRef, useEffect } from "react";
import { isHeicFormat, convertHeicToJpeg } from "../../utils/heic";

interface UseHeicConversionParams {
  imageUrl: string | undefined;
  mimeType?: string;
}

export const useHeicConversion = ({ imageUrl, mimeType }: UseHeicConversionParams) => {
  const isHeic = isHeicFormat(mimeType);
  const needsConversion = isHeic && !!imageUrl;
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(needsConversion);
  const previousBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!needsConversion || !imageUrl) {
      return;
    }

    let cancelled = false;

    void convertHeicToJpeg(imageUrl).then((convertedUrl) => {
      if (cancelled) return;

      if (convertedUrl) {
        previousBlobUrlRef.current = convertedUrl;
        setConvertedImageUrl(convertedUrl);
      } else {
        setConvertedImageUrl(imageUrl);
      }
      setIsConverting(false);
    });

    return () => {
      cancelled = true;
      if (previousBlobUrlRef.current) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
        previousBlobUrlRef.current = null;
      }
    };
  }, [needsConversion, imageUrl]);

  const finalImageUrl = isHeic && convertedImageUrl ? convertedImageUrl : imageUrl;

  return {
    imageUrl: finalImageUrl,
    isConverting: needsConversion && isConverting,
  };
};
