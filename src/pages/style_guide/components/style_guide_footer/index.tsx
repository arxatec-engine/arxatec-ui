import { Logo } from "@/components/logo";

export const StyleGuideFooter = () => (
  <footer className="flex w-full items-center justify-between flex-wrap gap-4 text-center text-sm">
    <p role="img" aria-label="Arxatec Design">
      <Logo variant="design" className="w-44 text-foreground h-auto" />
    </p>
    <a
      href="#fundamentos"
      className="inline-flex items-center gap-2 rounded-md hover:text-foreground"
    >
      Diseñado para construir con claridad.
    </a>
  </footer>
);
