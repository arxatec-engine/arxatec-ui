import type { ReactNode } from "react";

import { GUIDE_SECTIONS } from "../../constants";

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
    className="guide-anchor min-w-0"
  >
    <header className="mb-8 flex items-start gap-5 border-t pt-8">
      <span
        className="pt-1 text-sm tabular-nums text-muted-foreground"
        aria-hidden="true"
      >
        {GUIDE_SECTIONS.find((section) => section.id === id)?.number}
      </span>
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
