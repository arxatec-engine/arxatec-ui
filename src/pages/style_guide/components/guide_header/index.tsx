import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";

interface Props {
  isDark: boolean;
  onDarkChange: (value: boolean) => void;
}

export const GuideHeader = ({ isDark, onDarkChange }: Props) => (
  <header className="sticky top-0 z-40 border-b max-w-3xl mx-auto border-r border-l bg-background/95 backdrop-blur-md">
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-1">
      <a
        href="#fundamentos"
        aria-label="Arxatec, inicio de la guía"
        className="flex items-center gap-3 rounded-md"
      >
        <Logo className="h-auto w-44" variant="design" aria-hidden="true" />
      </a>
      <Button
        variant="ghost"
        size="sm"
        aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
        onClick={() => onDarkChange(!isDark)}
        className="gap-2"
      >
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        <span className="hidden sm:inline sr-only">
          {isDark ? "Tema claro" : "Tema oscuro"}
        </span>
      </Button>
    </div>
  </header>
);
