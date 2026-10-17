import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export const ShowcaseBlock = ({ id, title, description, children }: Props) => (
  <section
    id={id}
    aria-labelledby={id + "-title"}
    className="guide-anchor w-full min-w-0"
  >
    <header className="mb-4 flex items-start text-left gap-4">
      <div className="min-w-0">
        <h2
          id={id + "-title"}
          className="text-base"
        >
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
    <div className="flex min-w-0 flex-col gap-2">{children}</div>
  </section>
);
