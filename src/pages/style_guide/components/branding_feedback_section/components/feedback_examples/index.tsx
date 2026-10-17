import { CalendarCheck2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { StatusMessage } from "@/components/status_message";

import { ComponentPreview } from "../../../component_preview";

export const FeedbackExamples = () => (
  <>
    <ComponentPreview
      title="Badge"
      description="Añade un estado o una categoría cerca del contenido. Su tamaño discreto permite leer la información sin interrumpir el recorrido."
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge>Activo</Badge>
        <Badge variant="secondary">En revisión</Badge>
        <Badge variant="outline">Borrador</Badge>
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="StatusMessage"
      description="Explica estados que necesitan contexto. El icono, el título y la descripción comunican el mensaje sin depender solo del color."
    >
      <div className="space-y-3">
        <StatusMessage
          title="Todo al día"
          description="Los cambios se guardaron correctamente."
          color="white"
          icon={CalendarCheck2}
        />
        <StatusMessage
          title="Revisa la conexión"
          description="Hay cambios pendientes de sincronizar."
          color="rose"
          icon={TriangleAlert}
        />
      </div>
    </ComponentPreview>
    <ComponentPreview
      title="Toast"
      description="Confirma el resultado de una acción sin bloquear el trabajo. Reserva los mensajes persistentes para información que necesite atención."
    >
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Cambios guardados", {
              description: "Tu proyecto está actualizado.",
            })
          }
        >
          Mostrar confirmación
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.info("Nueva actualización disponible")}
        >
          Mostrar aviso
        </Button>
      </div>
    </ComponentPreview>
  </>
);
