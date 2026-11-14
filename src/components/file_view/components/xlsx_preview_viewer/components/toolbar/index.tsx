import { Check, Copy, Download, ZoomIn, ZoomOut } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/button";
import { cn } from "@/utilities/class";

import {
  ViewerFloatingBar,
  ViewerFloatingBarValue,
} from "../../../viewer_floating_bar";
import { selectionLabel } from "../../utilities/selection";
import type { useSpreadsheetClipboard } from "../../hooks/use_spreadsheet_clipboard";
import type { FileXlsxPreviewViewerLabels } from "../../types";

interface Props {
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  clipboard: ReturnType<typeof useSpreadsheetClipboard>;
  labels: FileXlsxPreviewViewerLabels;
  onDownload: () => void;
  className?: string;
}

export const SpreadsheetToolbar = ({
  scale,
  setScale,
  clipboard,
  labels,
  onDownload,
  className,
}: Props) => {
  const { selection, copyNotice, selectedRange, copySelection } = clipboard;
  return (
    <ViewerFloatingBar
      ariaLabel={labels.toolbar}
      data-slot="spreadsheet-toolbar"
      className={cn("mb-10", className)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.zoomOut}
        disabled={scale <= 0.5}
        onClick={() =>
          setScale((value) =>
            Math.max(0.5, Math.round((value - 0.2) * 10) / 10),
          )
        }
      >
        <ZoomOut className="size-4" />
      </Button>
      <ViewerFloatingBarValue>
        {Math.round(scale * 100)}%
      </ViewerFloatingBarValue>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.zoomIn}
        disabled={scale >= 3}
        onClick={() =>
          setScale((value) => Math.min(3, Math.round((value + 0.2) * 10) / 10))
        }
      >
        <ZoomIn className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.copy}
        title={labels.copyShortcut}
        disabled={!selection}
        onClick={() => void copySelection()}
      >
        {copyNotice?.success ? (
          <Check className="size-4" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
      {selectedRange && (
        <ViewerFloatingBarValue>
          <span
            className="block max-w-40 truncate"
            title={copyNotice?.message ?? selectionLabel(selectedRange)}
          >
            {copyNotice?.message ?? selectionLabel(selectedRange)}
          </span>
        </ViewerFloatingBarValue>
      )}
      <span className="sr-only" aria-live="polite">
        {copyNotice?.message}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.download}
        onClick={onDownload}
      >
        <Download className="size-4" />
      </Button>
    </ViewerFloatingBar>
  );
};
