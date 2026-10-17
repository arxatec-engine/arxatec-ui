import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown_menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";

import { ComponentPreview } from "../../../component_preview";

export const ContextExamples = () => (
  <>
    <ComponentPreview
      title="DropdownMenu"
      description="Reúne acciones secundarias bajo un solo control. Mantiene limpia la interfaz y las opciones cerca del elemento al que pertenecen."
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="mx-auto flex">
            Opciones del proyecto <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>Proyecto</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            size="sm"
            onSelect={() => toast.info("Acción seleccionada: editar")}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            size="sm"
            onSelect={() => toast.success("Proyecto duplicado")}
          >
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem
            size="sm"
            onSelect={() => toast.success("Proyecto archivado")}
          >
            Archivar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ComponentPreview>
    <ComponentPreview
      title="Popover"
      description="Muestra información breve o ajustes junto al control que los abre. Úsalo cuando un diálogo completo sería demasiado."
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="mx-auto flex">
            Ver información
          </Button>
        </PopoverTrigger>
        <PopoverContent className="space-y-2">
          <p className="text-sm font-medium">Un poco más de contexto</p>
          <p className="text-sm text-muted-foreground">
            La información aparece junto a su origen para que no pierdas el
            hilo.
          </p>
        </PopoverContent>
      </Popover>
    </ComponentPreview>
    <ComponentPreview
      title="Tooltip"
      description="Aclara un control al pasar el cursor o enfocarlo con el teclado. Su contenido debe ser complementario y breve."
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline" className="mx-auto flex">
            Pasa el cursor o enfoca
          </Button>
        </TooltipTrigger>
        <TooltipContent>Una pequeña ayuda, justo aquí.</TooltipContent>
      </Tooltip>
    </ComponentPreview>
  </>
);
