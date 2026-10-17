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

import { ComponentPreview } from "../../../component_preview";

export const CompositionExamples = () => (
  <>
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
