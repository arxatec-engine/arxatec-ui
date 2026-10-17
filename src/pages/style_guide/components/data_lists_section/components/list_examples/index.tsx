import { FilePlus, Search, Settings } from "lucide-react";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command";

import { ComponentPreview } from "../../../component_preview";

export const ListExamples = () => {
  const [action, setAction] = useState("Ninguna todavía");

  return (
    <>
      <ComponentPreview
        title="Command"
        description="Encuentra y ejecuta acciones escribiendo su nombre. La navegación con flechas y Enter agiliza las tareas frecuentes."
      >
        <div className="w-full max-w-sm space-y-3">
          <Command className="rounded-md border bg-background">
            <CommandInput
              placeholder="Busca una acción…"
              aria-label="Buscar una acción"
            />
            <CommandList>
              <CommandEmpty>Sin resultados.</CommandEmpty>
              <CommandGroup heading="Acciones rápidas">
                <CommandItem onSelect={() => setAction("Crear proyecto")}>
                  <FilePlus aria-hidden="true" />
                  Crear proyecto
                </CommandItem>
                <CommandItem onSelect={() => setAction("Buscar archivos")}>
                  <Search aria-hidden="true" />
                  Buscar archivos
                </CommandItem>
                <CommandItem onSelect={() => setAction("Abrir ajustes")}>
                  <Settings aria-hidden="true" />
                  Abrir ajustes
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Acción: {action}
          </p>
        </div>
      </ComponentPreview>
    </>
  );
};
