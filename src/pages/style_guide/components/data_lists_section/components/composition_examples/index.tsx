import { ChevronDown, Layers } from "lucide-react";

import { Button } from "@/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable";
import { ScrollArea } from "@/components/scroll_area";

import { ComponentPreview } from "../../../component_preview";

export const CompositionExamples = () => (
  <>
    <ComponentPreview
      title="ScrollArea"
      description="Permite recorrer contenido extenso dentro de un espacio acotado. La página mantiene su estructura mientras la lista se desplaza."
    >
      <ScrollArea
        className="h-44 w-full max-w-sm rounded-md border bg-background"
        aria-label="Actividad reciente"
        tabIndex={0}
      >
        <div className="divide-y px-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 py-4 text-sm"
            >
              <span>Actualización {index + 1}</span>
              <span className="text-muted-foreground">
                Hace {index + 1} min
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </ComponentPreview>
    <ComponentPreview
      title="Collapsible"
      description="Oculta detalles que no hacen falta de entrada. El usuario decide cuándo ampliar la información sin cambiar de vista."
    >
      <Collapsible className="w-full max-w-sm rounded-md border bg-background">
        <CollapsibleTrigger asChild>
          <Button size="sm" variant="ghost" className="w-full justify-between px-5">
            Detalles del proyecto <ChevronDown aria-hidden="true" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Creado por María García. Última actualización hoy. El equipo puede
          editar y comentar.
        </CollapsibleContent>
      </Collapsible>
    </ComponentPreview>
    <ComponentPreview
      title="Resizable"
      description="Deja que cada persona distribuya el espacio según su tarea. Arrastra el separador o enfócalo y usa las flechas."
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-36 w-full rounded-md border bg-background"
      >
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex h-full min-h-36 items-center justify-center text-sm text-muted-foreground">
            Lista
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          aria-label="Ajustar tamaño de los paneles"
        />
        <ResizablePanel defaultSize={60} minSize={25}>
          <div className="flex h-full min-h-36 items-center justify-center bg-muted/40 text-sm text-muted-foreground">
            Detalle
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ComponentPreview>
    <ComponentPreview
      title="Carousel"
      description="Recorre una secuencia de elementos con el mismo peso. Úsalo para vistas previas donde ver un elemento a la vez tenga sentido."
    >
      <div className="w-full max-w-sm px-9">
        <Carousel>
          <CarouselContent>
            {["Boceto", "Propuesta", "Resultado"].map((item) => (
              <CarouselItem key={item}>
                <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-md border bg-background">
                  <Layers
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-sm">{item}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            size="sm"
            className="-left-9 size-8 p-0"
            aria-label="Vista anterior"
          />
          <CarouselNext
            size="sm"
            className="-right-9 size-8 p-0"
            aria-label="Vista siguiente"
          />
        </Carousel>
      </div>
    </ComponentPreview>
  </>
);
