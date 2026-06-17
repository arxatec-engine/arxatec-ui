import { useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";
import { FileSimplePreviewRender } from "../file_simple_preview_render";

export interface FileSimplePreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
}

export const FileSimplePreviewSheet: React.FC<FileSimplePreviewSheetProps> = ({
  open,
  onOpenChange,
  file,
}) => {
  const url = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[95vw] w-full p-0 flex flex-col gap-0 overflow-hidden">
        <SheetHeader className="px-6 flex flex-row items-center justify-between space-y-0 border-b bg-background relative z-10">
          <SheetTitle className="line-clamp-1 flex-1 mr-4">
            {file?.name || "Vista previa del archivo"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 relative min-h-0 bg-background">
          {file && url && (
            <div className="absolute inset-0 overflow-hidden min-w-0">
              <FileSimplePreviewRender file={file} url={url} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
