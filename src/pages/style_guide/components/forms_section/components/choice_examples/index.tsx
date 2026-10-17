import { useState } from "react";

import { AsyncSelect } from "@/components/async_select";
import { Checkbox } from "@/components/checkbox";
import { Label } from "@/components/label";
import { RadioGroup, RadioGroupItem } from "@/components/radio_group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

import { DEMO_PROJECTS } from "../../../../constants";
import { ComponentPreview } from "../../../component_preview";

export const ChoiceExamples = () => {
  const [project, setProject] = useState<string>();

  return (
    <>
      <ComponentPreview
        title="Checkbox"
        description="Permite elegir opciones independientes. Cada casilla representa una decisión que puede activarse por separado."
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Checkbox id="guide-notifications" defaultChecked />
            <Label htmlFor="guide-notifications">
              Recibir actualizaciones por correo
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="guide-summary" />
            <Label htmlFor="guide-summary">Incluir un resumen semanal</Label>
          </div>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="RadioGroup"
        description="Muestra alternativas cuando solo se puede elegir una. Ideal para pocas opciones que conviene comparar de un vistazo."
      >
        <RadioGroup
          defaultValue="team"
          aria-label="Visibilidad del proyecto"
          className="gap-5"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem id="guide-team" value="team" />
            <Label htmlFor="guide-team">Visible para el equipo</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem id="guide-private" value="private" />
            <Label htmlFor="guide-private">Solo para mí</Label>
          </div>
        </RadioGroup>
      </ComponentPreview>
      <ComponentPreview
        title="Select"
        description="Presenta una lista de opciones conocidas sin ocupar espacio permanente. Úsalo para una selección simple."
      >
        <div className="w-full max-w-sm space-y-3">
          <Label htmlFor="guide-country">País</Label>
          <Select defaultValue="pe">
            <SelectTrigger size="sm" id="guide-country" className="w-full">
              <SelectValue placeholder="Selecciona un país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pe">Perú</SelectItem>
              <SelectItem value="mx">México</SelectItem>
              <SelectItem value="co">Colombia</SelectItem>
              <SelectItem value="es">España</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="AsyncSelect"
        description="Resuelve selección, carga y error en un mismo control cuando las opciones llegan desde una fuente de datos."
      >
        <div className="w-full max-w-sm">
          <AsyncSelect
            size="sm"
            label="Proyecto"
            value={project}
            onChange={setProject}
            options={DEMO_PROJECTS}
            placeholder="Selecciona un proyecto"
            allLabel="Todos los proyectos"
            className="w-full"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Esta demostración usa opciones locales.
          </p>
        </div>
      </ComponentPreview>
    </>
  );
};
