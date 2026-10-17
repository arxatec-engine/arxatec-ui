import { Checkbox } from "@/components/checkbox";
import { Label } from "@/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

import { ComponentPreview } from "../../../component_preview";

export const ChoiceExamples = () => (
  <>
    <ComponentPreview
      title="Checkbox"
      description="Activa una opción independiente sin modificar las demás decisiones del formulario."
    >
      <div className="flex items-center gap-3">
        <Checkbox id="guide-notifications" defaultChecked />
        <Label htmlFor="guide-notifications">
          Recibir actualizaciones por correo
        </Label>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="Select"
      description="Presenta una lista de opciones conocidas para elegir un solo valor."
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
          </SelectContent>
        </Select>
      </div>
    </ComponentPreview>
  </>
);
