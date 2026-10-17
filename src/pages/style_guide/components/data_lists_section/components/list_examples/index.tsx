import { FilePlus, Search, Settings } from "lucide-react";
import { useState } from "react";

import { AsyncCommandList } from "@/components/async_command_list";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command";

import { DEMO_PROJECTS } from "../../../../constants";
import { ComponentPreview } from "../../../component_preview";

export const ListExamples = () => {
  const [action, setAction] = useState("Ninguna todavía");
  const [project, setProject] = useState<string>();

  return (
    <>
      <ComponentPreview
        title="Command"
        description="Encuentra y ejecuta acciones escribiendo su nombre. La navegación con flechas y Enter agiliza las tareas frecuentes."
      >
        <div className="space-y-3">
          <Command className="rounded-lg border bg-background">
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
      <ComponentPreview
        title="AsyncCommandList"
        description="Presenta resultados dinámicos con los mismos patrones de selección. Incluye estados de espera y lista vacía."
      >
        <div className="space-y-3">
          <Command className="rounded-lg border bg-background">
            <AsyncCommandList
              data={DEMO_PROJECTS}
              isLoading={false}
              getKey={(item) => item.id}
              renderItem={(item) => <span>{item.name}</span>}
              onSelect={setProject}
              emptyMessage="Sin proyectos"
            />
          </Command>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Proyecto:{" "}
            {DEMO_PROJECTS.find((item) => item.id === project)?.name ??
              "Selecciona uno"}
          </p>
        </div>
      </ComponentPreview>
    </>
  );
};
