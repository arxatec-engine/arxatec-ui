import { useCallback } from "react";

import { downloadFromUrl } from "../../utilities/download_from_url";

interface Options {
  file?: File;
  url?: string;
  fileName: string;
  onDownload?: () => void | Promise<void>;
  onError?: (error: Error) => void;
}

export const useFilePreviewDownload = ({
  file,
  url,
  fileName,
  onDownload,
  onError,
}: Options) =>
  useCallback(async () => {
    const objectUrl =
      !onDownload && file ? URL.createObjectURL(file) : undefined;
    try {
      if (onDownload) await onDownload();
      else if (objectUrl ?? url)
        await downloadFromUrl((objectUrl ?? url)!, fileName);
    } catch (cause) {
      onError?.(
        cause instanceof Error ? cause : new Error("File download failed"),
      );
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [file, url, fileName, onDownload, onError]);
