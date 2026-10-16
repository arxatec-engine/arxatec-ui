export const getFilePreviewMimeType = (
  fileName: string,
  mimeType?: string | null,
): string => {
  if (mimeType) return mimeType.toLowerCase();

  const normalizedName = fileName.toLowerCase();

  if (normalizedName.endsWith(".pdf")) return "application/pdf";
  if (normalizedName.endsWith(".png")) return "image/png";
  if (normalizedName.endsWith(".jpg") || normalizedName.endsWith(".jpeg"))
    return "image/jpeg";
  if (normalizedName.endsWith(".webp")) return "image/webp";
  if (normalizedName.endsWith(".gif")) return "image/gif";
  if (normalizedName.endsWith(".mp4")) return "video/mp4";
  if (normalizedName.endsWith(".mp3")) return "audio/mpeg";
  if (normalizedName.endsWith(".wav")) return "audio/wav";

  if (normalizedName.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (normalizedName.endsWith(".xlsx")) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }

  if (normalizedName.endsWith(".pptx")) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }

  return "application/octet-stream";
};
