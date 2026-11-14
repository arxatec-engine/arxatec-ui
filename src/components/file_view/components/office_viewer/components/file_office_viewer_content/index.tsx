import { useRef } from "react";

import { cn } from "@/utilities/class";

import { useFileViewLoadingChange } from "../../../../hooks";
import { OFFICE_EMBED_IFRAME_ID } from "../../constants";
import { useOfficeEmbedOverlay } from "../../hooks";
import type { FileOfficeViewerProps } from "../../types";
import { FileOfficeViewerToolbar } from "../toolbar";

const FileOfficeViewerContent = ({
  className,
  documentLabel = "Documento Office",
  url,
  fileName,
  onDownload,
  onLoadingChange,
}: Omit<FileOfficeViewerProps, "isPending" | "isError">) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isEmbedPending = useOfficeEmbedOverlay(rootRef, url);
  useFileViewLoadingChange(isEmbedPending, onLoadingChange);

  return (
    <div
      ref={rootRef}
      data-slot="file-office-viewer"
      className={cn(
        "relative flex min-h-0 h-full w-full flex-col bg-background",
        className,
      )}
    >
      <div className="h-full flex-1 overflow-hidden">
        <div id="msdoc-renderer" className="h-full w-full bg-white">
          <iframe
            id={OFFICE_EMBED_IFRAME_ID}
            title={fileName || documentLabel}
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
            className="h-full w-full border-0"
          />
        </div>
      </div>
      <FileOfficeViewerToolbar onDownload={onDownload} />
    </div>
  );
};

export { FileOfficeViewerContent };
