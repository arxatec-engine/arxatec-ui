import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/text_area";

import { ComponentPreview } from "../../../component_preview";

export const TextFieldExamples = () => (
  <>
    <ComponentPreview
      title="Input · Label"
      description="Para respuestas breves y concretas. Una etiqueta visible mantiene el contexto cuando el usuario empieza a escribir."
    >
      <div className="space-y-3">
        <Label htmlFor="guide-name">Nombre del proyecto</Label>
        <Input id="guide-name" placeholder="Ej. Rediseño de la web" />
        <p className="text-sm text-muted-foreground">
          Elige un nombre fácil de reconocer.
        </p>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="Textarea"
      description="Da espacio a ideas que necesitan más de una línea. Úsalo para descripciones, notas y mensajes."
    >
      <div className="space-y-3">
        <Label htmlFor="guide-description">Descripción</Label>
        <Textarea
          id="guide-description"
          rows={3}
          placeholder="Cuéntanos un poco más sobre el proyecto…"
        />
      </div>
    </ComponentPreview>
  </>
);
