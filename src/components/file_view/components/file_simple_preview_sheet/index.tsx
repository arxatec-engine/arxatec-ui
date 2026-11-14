import { useEffect, useMemo } from "react";

import { cn } from "@/utilities/class";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";

import { FileSimplePreviewRender } from "../file_simple_preview_render";
import type { FileViewLoadingChangeHandler } from "../../types";
import type { FileWordDocumentConverter } from "../docx_preview_viewer/types";
import type { FileSpreadsheetConverter } from "../xlsx_preview_viewer/types";

export interface FileSimplePreviewSheetProps {
  className?: string;
  previewLabel?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  isLoading?: boolean;
  loadingOverlay?: React.ReactNode;
  onLoadingChange?: FileViewLoadingChangeHandler;
  convertToDocx?: FileWordDocumentConverter;
  convertToXlsx?: FileSpreadsheetConverter;
}

export const FileSimplePreviewSheet = ({
  className,
  previewLabel = "Vista previa del archivo",
  open,
  onOpenChange,
  file,
  isLoading = false,
  loadingOverlay,
  onLoadingChange,
  convertToDocx,
  convertToXlsx,
}: FileSimplePreviewSheetProps) => {
  const url = useMemo(() => {
    if (!open || !file) return null;
    return URL.createObjectURL(file);
  }, [file, open]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-slot="file-simple-preview-sheet"
        className={cn(
          "sm:max-w-[95vw] w-full p-0 flex flex-col gap-0 overflow-hidden",
          className,
        )}
      >
        <SheetHeader className="px-6 flex flex-row items-center justify-between space-y-0 border-b bg-background relative z-10">
          <SheetTitle className="line-clamp-1 flex-1 mr-4">
            {file?.name || previewLabel}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 relative min-h-0 bg-background">
          {file && url && (
            <div className="absolute inset-0 overflow-hidden min-w-0">
              <FileSimplePreviewRender
                file={file}
                url={url}
                onLoadingChange={onLoadingChange}
                convertToDocx={convertToDocx}
                convertToXlsx={convertToXlsx}
              />
            </div>
          )}
          {isLoading && loadingOverlay ? (
            <div className="absolute inset-0 z-50 bg-background">
              {loadingOverlay}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};
