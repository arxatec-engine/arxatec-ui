import heic2any from "heic2any";
import { toast } from "sonner";

export const isHeicFormat = (mimeType?: string): boolean => {
  if (!mimeType) return false;
  const lowerMimeType = mimeType.toLowerCase();
  return lowerMimeType === "image/heic" || lowerMimeType === "image/heif";
};

export const convertHeicToJpeg = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const convertedBlob = await heic2any({
      blob,
      toType: "image/jpeg",
      quality: 0.92,
    });

    const blobResult = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    return URL.createObjectURL(blobResult);
  } catch (error) {
    console.error("Error converting HEIC image:", error);
    toast.error("Error converting HEIC image");
    return null;
  }
};
