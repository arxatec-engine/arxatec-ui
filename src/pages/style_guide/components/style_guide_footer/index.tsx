import { ArrowUp } from "lucide-react";

export const StyleGuideFooter = () => (
  <footer className="flex w-full flex-wrap items-center justify-center gap-5 text-center text-sm text-muted-foreground">
    <p>
      Arxatec UI{" "}
      <span className="mx-2" aria-hidden="true">
        /
      </span>{" "}
      Diseñado para construir con claridad.
    </p>
    <a
      href="#fundamentos"
      className="inline-flex min-h-9 items-center gap-2 rounded-md hover:text-foreground"
    >
      Volver al inicio <ArrowUp className="size-4" aria-hidden="true" />
    </a>
  </footer>
);
