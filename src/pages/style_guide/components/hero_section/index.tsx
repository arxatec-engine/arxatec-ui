import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/exports";

interface Props {
  isDark: boolean;
  onDarkChange: (value: boolean) => void;
}

export function HeroSection({ isDark, onDarkChange }: Props) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-md border border-border/60 bg-card/70 p-8  backdrop-blur-sm">
      <div className="mb-8 flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="relative isolate pt-8">
            <p className="pointer-events-none absolute top-4 left-0 max-w-full truncate font-serif text-5xl text-foreground/8 sm:text-6xl font-black">
              Style Guide
            </p>
            <h1 className="relative font-serif text-4xl leading-none sm:text-5xl font-black">
              Style Guide
            </h1>
          </div>
          <p className="max-w-3xl text-base text-muted-foreground">
            Una vitrina visual y tecnica para validar consistencia UI/UX con{" "}
            <br />
            todos los componentes base y custom del proyecto.
          </p>
        </div>
        <Toggle
          variant="outline"
          pressed={isDark}
          onPressedChange={onDarkChange}
          aria-label="Cambiar tema"
          size="sm"
          className="cursor-pointer"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          {isDark ? "Tema oscuro" : "Tema claro"}
        </Toggle>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif text-3xl font-black">Tipografia</h2>
          <div className="min-w-0 rounded-md border border-border/60 bg-background/60 p-6">
            <div className="space-y-6">
              <div>
                <p className="font-serif text-xl">Cormorant Garamond</p>
                <p className="font-serif text-6xl font-bold">Aa</p>
                <p className="text-muted-foreground text-sm">
                  Semibold / Medium
                </p>
              </div>
              <div>
                <p className="text-lg">Source Sans 3</p>
                <p className="text-6xl font-bold">Aa</p>
                <p className="text-muted-foreground text-sm">
                  Semibold / Medium
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-3xl font-black">Colores</h2>
          <div className="min-w-0 rounded-md border border-border/60 bg-background/60 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex h-28 items-center justify-center rounded-md bg-black text-sm font-semibold text-white">
                #0A0908
              </div>
              <div className="flex h-28 items-center justify-center rounded-md bg-white text-sm font-semibold text-black">
                #FFFFFF
              </div>
              <div className="flex h-28 items-center justify-center rounded-md bg-zinc-400 text-sm font-semibold text-black">
                #B5B5B5
              </div>
              <div className="flex h-28 items-center justify-center rounded-md bg-zinc-200 text-sm font-semibold text-black">
                #E4E4E4
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
