import { Skeleton } from "@/components/skeleton";

import { ComponentPreview } from "../../../component_preview";

export const LoadingExamples = () => {
  return (
    <>
      <ComponentPreview
        title="Skeleton"
        description="Anticipa la estructura mientras llega el contenido. Mantener el espacio reservado reduce saltos y hace la espera más predecible."
      >
        <div
          className="flex w-full max-w-sm items-center gap-4 rounded-md border bg-background p-5"
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
    </>
  );
};
