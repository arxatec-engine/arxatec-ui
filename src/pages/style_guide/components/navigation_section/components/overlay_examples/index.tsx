import { Button } from "@/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";

import { ComponentPreview } from "../../../component_preview";

export const OverlayExamples = () => (
  <ComponentPreview
    title="Dialog"
    description="Centra la atención en una tarea puntual y permite volver al punto de partida al terminar."
  >
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mx-auto flex">
          Abrir diálogo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Un momento para enfocarse</DialogTitle>
          <DialogDescription>
            Un diálogo mantiene la atención en una sola tarea y permite volver
            al punto de partida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm">Entendido</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </ComponentPreview>
);
