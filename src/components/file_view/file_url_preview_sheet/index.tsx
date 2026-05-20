import { FileX } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";
import { FileUrlPreviewRender } from "../file_url_preview_render";
import { getFileNameFromUrl } from "../utilities/get_extension_from_url";

export interface FileUrlPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | null;
  fileName?: string;
  isPending?: boolean;
  isError?: boolean;
}

export const FileUrlPreviewSheet: React.FC<FileUrlPreviewSheetProps> = ({
  open,
  onOpenChange,
  url,
  fileName,
  isPending = false,
  isError = false,
}) => {
  const displayName =
    fileName ?? (url ? getFileNameFromUrl(url) : "Vista previa");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[95vw] w-full p-0 flex flex-col gap-0 overflow-hidden">
        <SheetHeader className="px-6 flex flex-row items-center justify-between space-y-0 border-b bg-background relative z-10">
          <SheetTitle className="line-clamp-1 flex-1 mr-4">
            {displayName}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Vista previa del archivo.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 relative min-h-0 bg-background overflow-hidden">
          {isPending && (
            <div className="p-4">
              <Skeleton className="h-48 w-full rounded-md" />
            </div>
          )}

          {isError && (
            <div className="p-4">
              <StatusMessage
                title="Error al cargar el documento"
                description="Vuelve a intentarlo en unos minutos. Si el error persiste, contacta con soporte."
                icon={FileX}
              />
            </div>
          )}

          {!isPending && !isError && url && (
            <FileUrlPreviewRender url={url} fileName={displayName} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
