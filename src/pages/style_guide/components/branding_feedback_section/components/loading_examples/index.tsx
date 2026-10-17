import { useState } from "react";

import { AsyncBoundary } from "@/components/async_boundary";
import { Button } from "@/components/button";
import { LoaderSplash } from "@/components/loader_splash";
import { Skeleton } from "@/components/skeleton";

import { ComponentPreview } from "../../../component_preview";

export const LoadingExamples = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <ComponentPreview
        title="Skeleton"
        description="Anticipa la estructura mientras llega el contenido. Mantener el espacio reservado reduce saltos y hace la espera más predecible."
      >
        <div
          className="flex items-center gap-4 rounded-md border bg-background p-5"
          role="status"
          aria-label="Ejemplo de contenido cargando"
        >
          <Skeleton className="size-12 shrink-0 rounded-md" />
          <div className="w-full space-y-3">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="LoaderSplash"
        description="Acompaña una carga inicial que ocupa toda la experiencia. Úsalo al arrancar, antes de que exista una estructura de contenido."
      >
        <div className="guide-loader">
          <LoaderSplash size={2.5} />
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="AsyncBoundary"
        description="Da a una vista un lugar consistente para carga, error y contenido. Prueba a alternar entre los estados de esta demostración."
      >
        <div className="space-y-5">
          <div className="min-h-12 rounded-md border bg-background p-4">
            <AsyncBoundary
              isLoading={loading}
              isError={false}
              data={{ message: "El contenido está listo." }}
              LoadingComponent={<Skeleton className="h-5 w-3/4" />}
              ErrorComponent={<p>No se pudo cargar el contenido.</p>}
            >
              {(data: { message: string }) => (
                <p className="text-sm">{data.message}</p>
              )}
            </AsyncBoundary>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLoading(!loading)}
          >
            {loading ? "Mostrar contenido" : "Mostrar carga"}
          </Button>
        </div>
      </ComponentPreview>
    </>
  );
};
