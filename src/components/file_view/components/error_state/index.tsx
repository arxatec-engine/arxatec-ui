import { FileX } from "lucide-react";
import type { ElementType, ReactNode } from "react";

import { StatusMessage } from "@/components/status_message";
import { cn } from "@/utilities/class";

export interface FileViewErrorStateProps {
  title?: string;
  description?: string;
  icon?: ElementType;
  actions?: ReactNode;
  className?: string;
}

export const FileViewErrorState = ({
  title = "No se pudo abrir la vista previa",
  description = "Vuelve a intentarlo en unos momentos.",
  icon = FileX,
  actions,
  className,
}: FileViewErrorStateProps) => (
  <div
    data-slot="file-view-error-state"
    role="alert"
    className={cn(
      "flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 bg-background p-6",
      className,
    )}
  >
    <StatusMessage
      title={title}
      description={description}
      icon={icon}
      color="white"
      appearance="plain"
      classNameCard="w-full max-w-md flex-col items-center text-center"
    />
    {actions && (
      <div className="flex flex-wrap justify-center gap-2">{actions}</div>
    )}
  </div>
);
