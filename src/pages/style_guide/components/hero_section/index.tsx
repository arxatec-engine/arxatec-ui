import { ArrowDown } from "lucide-react";

import { Button } from "@/components/button";

export const HeroSection = () => (
  <section
    id="fundamentos"
    aria-labelledby="guide-title"
    className="guide-anchor w-full min-w-0"
  >
    <div className="mx-auto max-w-2xl pb-12 pt-3 text-center lg:pt-5">
      <p className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <span
          className="size-1.5 rounded-md bg-foreground"
          aria-hidden="true"
        />
        Guía de estilos
      </p>
      <h1
        id="guide-title"
        className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
      >
        Una interfaz.
        <br />
        <span className="text-muted-foreground">Un mismo lenguaje.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Una vista rápida de los fundamentos y componentes esenciales de Arxatec.
      </p>
      <Button size="sm" asChild variant="outline" className="mt-8 gap-3">
        <a href="#acciones">
          Explorar componentes{" "}
          <ArrowDown className="size-4" aria-hidden="true" />
        </a>
      </Button>
    </div>
    <div className="flex min-w-0 flex-col gap-5">
      <article className="w-full min-w-0 rounded-md border p-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="text-sm font-medium">Tipografía</h2>
          <span className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
            Sans · 1.1×
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p
            className="text-6xl font-medium leading-none tracking-tight"
            aria-hidden="true"
          >
            Aa
          </p>
          <p className="text-right text-sm leading-relaxed text-muted-foreground">
            Arxatec Sans
            <br />
            BlinkMacSystemFont
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-sm">
          <span className="font-normal">Regular</span>
          <span className="font-medium">Medium</span>
          <span className="font-semibold">Semibold</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Una sola familia. Los tamaños y los pesos crean la jerarquía sin
          añadir ruido.
        </p>
      </article>
      <article className="w-full min-w-0 rounded-md border p-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="text-sm font-medium">Color con intención</h2>
          <span className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
            Claro y oscuro
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Fondo", color: "bg-background" },
            { label: "Superficie", color: "bg-muted" },
            { label: "Borde", color: "bg-border" },
            { label: "Principal", color: "bg-primary" },
          ].map(({ label, color }) => (
            <div key={label} className="min-w-0 space-y-3">
              <div className={"h-20 rounded-md border " + color} />
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t pt-5 text-sm leading-relaxed text-muted-foreground">
          Neutros para dar espacio al contenido. El color comunica acciones y
          estados, y se adapta al tema.
        </p>
      </article>
    </div>
  </section>
);
