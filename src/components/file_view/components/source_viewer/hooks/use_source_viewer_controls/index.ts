import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { downloadFromUrl } from "../../../../utilities/download_from_url";
import type { FileSourceViewerLabels } from "../../types";

export const useSourceViewerControls = (
  content: string,
  fileName: string,
  labels: FileSourceViewerLabels,
  onDownload?: () => void | Promise<void>,
) => {
  const [fontSize, setFontSize] = useState(14);
  const [wrapLines, setWrapLines] = useState(true);
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const copyRequest = useRef(0);

  useEffect(
    () => () => {
      copyRequest.current += 1;
      clearTimeout(copyTimeout.current);
    },
    [content, fileName],
  );

  const copy = async () => {
    const request = ++copyRequest.current;
    try {
      await navigator.clipboard.writeText(content);
      if (request !== copyRequest.current) return;
      setCopiedContent(content);
      clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopiedContent(null), 2000);
    } catch {
      if (request === copyRequest.current) toast.error(labels.copyError);
    }
  };

  const download = async () => {
    try {
      if (onDownload) {
        await onDownload();
        return;
      }
      const url = URL.createObjectURL(
        new Blob([content], { type: "text/plain;charset=utf-8" }),
      );
      try {
        await downloadFromUrl(url, fileName);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      toast.error(labels.downloadError);
    }
  };

  return {
    fontSize,
    wrapLines,
    copied: copiedContent === content,
    zoomOut: () => setFontSize((size) => Math.max(10, size - 2)),
    zoomIn: () => setFontSize((size) => Math.min(24, size + 2)),
    toggleWrap: () => setWrapLines((value) => !value),
    copy,
    download,
  };
};
