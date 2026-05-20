export function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split(".").pop()?.toLowerCase() ?? "";
  } catch {
    return url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  }
}

export function getFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").pop() ?? "Vista previa";
  } catch {
    return url.split("?")[0].split("/").pop() ?? "Vista previa";
  }
}
