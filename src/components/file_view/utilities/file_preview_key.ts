export function getFilePreviewKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
