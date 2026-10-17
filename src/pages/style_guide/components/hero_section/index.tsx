export const HeroSection = () => (
  <section
    id="fundamentos"
    aria-labelledby="guide-title"
    className="guide-anchor w-full min-w-0"
  >
    <div className="max-w-2xl py-4 text-left ">

      <h1
        id="guide-title"
        className="text-2xl leading-7"
      >
        Una interfaz.
        <br />
        <span className="text-muted-foreground">Un mismo lenguaje.</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted-foreground">
        Una vista rápida de los fundamentos y componentes esenciales de Arxatec.
      </p>
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <article className="w-full min-w-0 rounded-md bg-card border ">
        <div className="mb-4 flex items-start justify-between gap-4 px-3 pt-3">
          <h2 className="text-sm">Tipografía</h2>
          <span className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
            Sans · 1.1×
          </span>
        </div>
        <div className="flex items-end justify-between gap-4 px-3">
          <p
            className="text-6xl font-medium"
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
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-3 text-sm px-3">
          <span className="font-normal">Regular</span>
          <span className="font-medium">Medium</span>
          <span className="font-semibold">Semibold</span>
        </div>
        <p className="mt-1 px-3 pb-3 text-sm leading-relaxed text-muted-foreground">
          Una sola familia. Los tamaños y los pesos crean la jerarquía sin
          añadir ruido.
        </p>
      </article>
      <article className="w-full min-w-0 rounded-md bg-card border p-3">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-sm">Color con intención</h2>
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

      </article>
    </div>
  </section>
);
