import { Loader2 } from "lucide-react";
import { cn } from "@/utilities/class";

export interface FileViewLoadingStateProps {
  className?: string;
  label?: string;
}

export const FileViewLoadingState = ({
  className,
  label = "Cargando archivo",
}: FileViewLoadingStateProps) => (
  <div
    className={cn(
      "flex h-full min-h-[240px] w-full items-center justify-center",
      className,
    )}
    role="status"
    aria-label={label}
  >
    <Loader2 className="size-8 animate-spin text-muted-foreground" />
  </div>
);
