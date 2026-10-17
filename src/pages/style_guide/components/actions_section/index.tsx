import { Bold, Italic, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/button_group";
import { Toggle } from "@/components/toggle";

import { ComponentPreview } from "../component_preview";
import { ShowcaseBlock } from "../showcase_block";

export const ActionsSection = () => (
  <ShowcaseBlock
    id="acciones"
    title="Acciones"
    description="Una jerarquía clara para saber qué hacer, sin tener que pensarlo."
  >
    <ComponentPreview
      title="Button"
      description="La acción principal lleva más peso visual. Las variantes outline y ghost acompañan sin competir."
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm" onClick={() => toast.success("Proyecto creado")}>
          <Plus aria-hidden="true" />
          Crear proyecto
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info("Cambios descartados")}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => toast.info("Aquí puedes consultar los detalles")}
        >
          Ver detalles
        </Button>
        <Button size="sm" disabled>Pendiente</Button>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="ButtonGroup"
      description="Agrupa acciones relacionadas para que se perciban como una sola herramienta. Útil en barras de edición."
    >
      <div className="flex justify-center">
        <ButtonGroup aria-label="Acciones del documento">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Borrador guardado")}
          >
            Guardar
          </Button>
          <ButtonGroupSeparator />
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Documento publicado")}
          >
            Publicar
          </Button>
        </ButtonGroup>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="Toggle"
      description="Activa o desactiva una opción sin salir del contexto. Su estado visual muestra si la opción está aplicada."
    >
      <div className="flex items-center justify-center gap-3">
        <Toggle size="sm" variant="outline" aria-label="Activar negrita">
          <Bold aria-hidden="true" />
        </Toggle>
        <Toggle size="sm" variant="outline" aria-label="Activar cursiva">
          <Italic aria-hidden="true" />
        </Toggle>
        <span className="ml-2 text-sm text-muted-foreground">
          Prueba a activarlos
        </span>
      </div>
    </ComponentPreview>
  </ShowcaseBlock>
);
