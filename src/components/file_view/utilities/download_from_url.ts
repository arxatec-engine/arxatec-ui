import { downloadFileFromUrl } from "@/utilities/download";

export async function downloadFromUrl(url: string, fileName?: string): Promise<void> {
  if (url.startsWith("blob:")) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "archivo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  await downloadFileFromUrl(url, fileName);
}
