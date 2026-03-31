import { Bell } from "lucide-react";

export function StyleGuideFooter() {
  return (
    <footer className="min-w-0 max-w-full rounded-xl border border-border/60 bg-card/70 p-5">
      <p className="text-sm text-muted-foreground">
        Style Guide tecnico orientado a UX visual: contraste, ritmo, jerarquia
        tipografica y demostraciones de componentes en contexto.
      </p>
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <Bell className="size-3" />
        <span>Componentes cubiertos: base + custom de `src/components`.</span>
      </div>
    </footer>
  );
}
