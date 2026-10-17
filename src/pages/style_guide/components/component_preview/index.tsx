import { useId, type ReactNode } from "react";

import { cn } from "@/utilities";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export const ComponentPreview = ({
  title,
  description,
  children,
  className,
}: Props) => {
  const titleId = useId();

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-background",
        className,
      )}
    >
      <div className="guide-preview flex min-h-48 min-w-0 flex-1 items-center justify-center p-6 sm:p-8">
        <div className="w-full min-w-0">{children}</div>
      </div>
      <div className="space-y-2 border-t px-6 py-5">
        <h3 id={titleId} className="text-base font-medium tracking-tight">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
};
