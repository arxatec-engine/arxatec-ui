import { CalendarCheck2, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/badge";
import { StatusMessage } from "@/components/status_message";

import { ComponentPreview } from "../../../component_preview";

export const FeedbackExamples = () => (
  <>
    <ComponentPreview
      title="Badge"
      description="Añade un estado o una categoría cerca del contenido."
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge>Activo</Badge>
        <Badge variant="secondary">En revisión</Badge>
        <Badge variant="outline">Borrador</Badge>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="StatusMessage"
      description="Explica lo que está pasando con un icono, un título y una descripción, sin depender solo del color."
    >
      <div className="w-full max-w-sm space-y-3">
        <StatusMessage
          size="sm"
          title="Todo al día"
          description="Los cambios se guardaron correctamente."
          color="white"
          icon={CalendarCheck2}
        />
        <StatusMessage
          size="sm"
          title="Revisa la conexión"
          description="Hay cambios pendientes de sincronizar."
          color="rose"
          icon={TriangleAlert}
        />
      </div>
    </ComponentPreview>
  </>
);
