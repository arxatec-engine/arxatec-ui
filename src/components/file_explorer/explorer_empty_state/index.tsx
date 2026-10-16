import { FolderPlus, type LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../../utilities/class";

export interface ExplorerEmptyStateProps extends ComponentProps<"div"> {
  variant?: "panel" | "picker";
  title: string;
  description: string;
  icon?: LucideIcon;
  isDragging?: boolean;
}

export const ExplorerEmptyState = ({
  variant = "panel",
  title,
  description,
  icon: Icon = FolderPlus,
  isDragging = false,
  className,
  ...rest
}: ExplorerEmptyStateProps) => {
  if (variant === "picker")
    return (
      <div
        className={cn(
          "flex h-full min-h-0 w-full bg-status-card-background-empty rounded-md transition-colors",
          className,
        )}
        {...rest}
      >
        <div className="w-full flex min-h-0 flex-1 items-center justify-center pointer-events-none">
          <div className="max-w-sm w-full mx-auto flex flex-col items-center justify-center px-4 py-8">
            <div className="size-14 rounded-md bg-status-card-background-icon-empty flex items-center justify-center">
              <Icon className="size-7 text-muted-foreground" />
            </div>
            <h2 className="text-base font-normal text-foreground text-center mt-4">
              {title}
            </h2>
            <p className="text-base text-muted-foreground text-center">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-80px)]! bg-status-card-background-empty w-full rounded-md transition-colors cursor-pointer border border-border",
        isDragging && "bg-border",
        className,
      )}
      {...rest}
    >
      <div className="w-full flex items-center justify-center pointer-events-none">
        <div className="max-w-sm w-full mx-auto items-center justify-center flex-col flex">
          <div
            className={cn(
              "size-12 rounded-md bg-status-card-background-icon-empty flex items-center justify-center transition",
              isDragging && "rotate-12",
            )}
          >
            <Icon className="size-6" />
          </div>

          <h2 className="text-base font-normal text-foreground text-center mt-4">
            {title}
          </h2>

          <p className="text-sm text-muted-foreground text-center">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
