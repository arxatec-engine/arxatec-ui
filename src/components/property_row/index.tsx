import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface PropertyRowProps {
  icon: LucideIcon;
  label: string;
  stacked?: boolean;
  status?: ReactNode;
  children: ReactNode;
}

export const PropertyRow = ({
  icon: Icon,
  label,
  stacked,
  status,
  children,
}: PropertyRowProps) => {
  const name = (
    <span
      title={label}
      className="flex h-8 shrink-0 items-center gap-2 text-sm text-muted-foreground"
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );

  const slot = (
    <span
      aria-hidden
      className="flex h-8 w-3.5 shrink-0 items-center text-muted-foreground"
    >
      {status}
    </span>
  );

  if (stacked) {
    return (
      <div className="flex flex-col py-0.5">
        <div className="flex items-center gap-2">
          {name}
          {slot}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className="w-32 shrink-0">{name}</span>
      <div className="min-w-0 flex-1">{children}</div>
      {slot}
    </div>
  );
};
