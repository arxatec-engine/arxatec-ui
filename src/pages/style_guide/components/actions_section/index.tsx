import { Bold, Italic, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/button_group";
import { InfoTooltip } from "@/components/info_tooltip";
import { Kbd, KbdGroup } from "@/components/kbd";
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
        <Button onClick={() => toast.success("Proyecto creado")}>
          <Plus aria-hidden="true" />
          Crear proyecto
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Cambios descartados")}
        >
          Cancelar
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.info("Aquí puedes consultar los detalles")}
        >
          Ver detalles
        </Button>
        <Button disabled>Pendiente</Button>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="ButtonGroup"
      description="Agrupa acciones relacionadas para que se perciban como una sola herramienta. Útil en barras de edición."
    >
      <div className="flex justify-center">
        <ButtonGroup aria-label="Acciones del documento">
          <Button
            variant="outline"
            onClick={() => toast.success("Borrador guardado")}
          >
            Guardar
          </Button>
          <ButtonGroupSeparator />
          <Button
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
        <Toggle variant="outline" aria-label="Activar negrita">
          <Bold aria-hidden="true" />
        </Toggle>
        <Toggle variant="outline" aria-label="Activar cursiva">
          <Italic aria-hidden="true" />
        </Toggle>
        <span className="ml-2 text-sm text-muted-foreground">
          Prueba a activarlos
        </span>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="Kbd · InfoTooltip"
      description="Los atajos ayudan a descubrir formas más rápidas de trabajar. La ayuda contextual explica un control justo donde hace falta."
    >
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground">
          Buscar en la aplicación
        </span>
        <KbdGroup aria-label="Atajo Control K">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <InfoTooltip info="Este es un ejemplo visual de cómo presentar un atajo de teclado." />
      </div>
    </ComponentPreview>
  </ShowcaseBlock>
);
