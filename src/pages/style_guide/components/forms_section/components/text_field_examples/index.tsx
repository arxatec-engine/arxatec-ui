import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/text_area";

import { ComponentPreview } from "../../../component_preview";

export const TextFieldExamples = () => (
  <ComponentPreview
    title="Input · Textarea"
    description="Un campo breve para el nombre y uno amplio para la descripción. Las etiquetas mantienen visible el contexto."
  >
    <div className="w-full max-w-sm space-y-5">
      <div className="space-y-3">
        <Label htmlFor="guide-name">Nombre del proyecto</Label>
        <Input size="sm" id="guide-name" placeholder="Ej. Rediseño de la web" />
      </div>
      <div className="space-y-3">
        <Label htmlFor="guide-description">Descripción</Label>
        <Textarea
          id="guide-description"
          rows={3}
          placeholder="Cuéntanos un poco más sobre el proyecto…"
        />
      </div>
    </div>
  </ComponentPreview>
);
