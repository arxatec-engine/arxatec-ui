import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "../../utilities/class";

export interface PanelStatusProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const PanelStatus = ({
  icon: Icon,
  title,
  description,
  action,
  loading = false,
  className,
}: PanelStatusProps) => (
  <div
    className={cn(
      "flex h-full flex-col items-center justify-center px-6 py-16",
      className,
    )}
  >
    <div className="relative flex size-14 items-center justify-center">
      {loading ? (
        <span
          className="absolute inset-0 animate-ping rounded-2xl bg-primary/10"
          aria-hidden
        />
      ) : null}
      <span className="relative flex size-14 items-center justify-center rounded-2xl border bg-background text-muted-foreground shadow-sm">
        {loading ? (
          <Loader2 className="size-5 animate-spin text-primary" />
        ) : (
          <Icon className="size-5" />
        )}
      </span>
    </div>

    <p className="mt-4 text-sm font-normal text-foreground">{title}</p>
    {description ? (
      <p className="mt-1.5 max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    ) : null}
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
