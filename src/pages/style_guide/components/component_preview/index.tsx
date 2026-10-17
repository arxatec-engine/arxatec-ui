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
        "flex w-full min-w-0 flex-col overflow-hidden rounded-md border bg-card",
        className,
      )}
    >
      <div className="guide-preview flex min-h-48 min-w-0 flex-1 items-center justify-center p-3">
        <div className="mx-auto flex w-full min-w-0 max-w-sm flex-col items-center justify-center [&>*]:max-w-full">
          {children}
        </div>
      </div>
      <div className="bg-muted/70 border-t p-3 text-left">
        <h3 id={titleId} className="text-sm">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
};
