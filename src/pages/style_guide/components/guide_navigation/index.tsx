import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/utilities";

import { GUIDE_SECTIONS } from "../../constants";

export const GuideNavigation = () => {
  const [activeId, setActiveId] = useState("fundamentos");

  useEffect(() => {
    const updateActiveSection = () => {
      const current = [...GUIDE_SECTIONS]
        .reverse()
        .find(
          ({ id }) =>
            (document.getElementById(id)?.getBoundingClientRect().top ??
              Infinity) <= 160,
        );
      setActiveId(current?.id ?? "fundamentos");
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  return (
    <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <nav aria-label="Secciones de la guía">
        <p className="mb-5 hidden px-3 text-sm font-medium text-muted-foreground lg:block">
          En esta guía
        </p>
        <ol className="flex gap-2 overflow-x-auto pb-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {GUIDE_SECTIONS.map(({ id, label, number }) => (
            <li key={id} className="shrink-0">
              <a
                href={"#" + id}
                aria-current={activeId === id ? "location" : undefined}
                onClick={() => setActiveId(id)}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground",
                  activeId === id
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <span className="text-xs tabular-nums text-muted-foreground">
                  {number}
                </span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-12 hidden border-t px-3 pt-6 lg:block">
        <p className="text-sm font-medium">
          Menos ruido.
          <br />
          Más claridad.
        </p>
        <a
          href="#acciones"
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Explorar componentes{" "}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
};
