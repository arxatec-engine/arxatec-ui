import { Loader2 } from "lucide-react";
import { cn } from "@/utilities/class";

interface FileViewLoadingStateProps {
  className?: string;
}

export const FileViewLoadingState = ({
  className,
}: FileViewLoadingStateProps) => (
  <div
    className={cn(
      "flex h-full min-h-[240px] w-full items-center justify-center",
      className,
    )}
    role="status"
    aria-label="Cargando archivo"
  >
    <Loader2 className="size-8 animate-spin text-muted-foreground" />
  </div>
);
