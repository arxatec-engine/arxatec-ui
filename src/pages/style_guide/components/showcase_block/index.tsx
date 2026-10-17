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
    <header className="mb-8 flex items-start justify-center text-center gap-5">
      <div className="min-w-0 space-y-2">
        <h2
          id={id + "-title"}
          className="text-2xl font-semibold tracking-tight"
        >
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
    <div className="flex min-w-0 flex-col gap-5">{children}</div>
  </section>
);
