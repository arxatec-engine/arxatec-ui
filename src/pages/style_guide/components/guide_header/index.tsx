import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/button";
import { Isotype } from "@/components/isotype";
import { Logo } from "@/components/logo";

interface Props {
  isDark: boolean;
  onDarkChange: (value: boolean) => void;
}

export const GuideHeader = ({ isDark, onDarkChange }: Props) => (
  <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
    <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-5 px-5 sm:px-10">
      <a
        href="#fundamentos"
        aria-label="Arxatec, inicio de la guía"
        className="flex items-center gap-3 rounded-sm"
      >
        <Isotype className="size-7" aria-hidden="true" />
        <Logo className="h-5 w-auto" aria-hidden="true" />
        <span className="ml-4 hidden border-l pl-5 text-sm text-muted-foreground sm:block">
          Sistema de diseño
        </span>
      </a>
      <Button
        variant="ghost"
        size="sm"
        aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
        onClick={() => onDarkChange(!isDark)}
        className="gap-2"
      >
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        <span className="hidden sm:inline">
          {isDark ? "Tema claro" : "Tema oscuro"}
        </span>
      </Button>
    </div>
  </header>
);
