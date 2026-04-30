import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string, file: File) => void;
  uploadFn: (file: File) => Promise<string>;
}

export function useImageUpload({ onUpload, uploadFn }: UseImageUploadProps) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      setFileName(file.name);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      previewRef.current = localUrl;
      setUploading(true);
      setError(null);

      try {
        const uploadedUrl = await uploadFn(file);
        onUpload?.(uploadedUrl, file);
      } catch (err) {
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        setFileName(null);
        const errorMessage = err instanceof Error ? err.message : "Error al subir la imagen";
        setError(errorMessage);
        console.error(err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, uploadFn],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        void processFile(file);
      }
    },
    [processFile],
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    processFile,
    handleRemove,
    uploading,
    error,
  };
}
