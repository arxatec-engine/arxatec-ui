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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";

import { ComponentPreview } from "../../../component_preview";

export const OverlayExamples = () => (
  <>
    <ComponentPreview
      title="Dialog"
      description="Centra la atención en una decisión puntual. Úsalo cuando la tarea necesita una respuesta antes de continuar."
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mx-auto flex">
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
              <Button>Entendido</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ComponentPreview>
    <ComponentPreview
      title="Sheet"
      description="Abre detalles o ajustes en un panel lateral. Conserva parte de la vista original para mantener la orientación."
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mx-auto flex">
            Abrir panel lateral
          </Button>
        </SheetTrigger>
        <SheetContent className="rounded-md">
          <SheetHeader>
            <SheetTitle>Detalles del proyecto</SheetTitle>
            <SheetDescription>
              Un espacio para información complementaria sin abandonar la vista
              actual.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cerrar panel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </ComponentPreview>
    <ComponentPreview
      title="Drawer"
      description="Presenta una tarea desde el borde de la pantalla. Su gesto de arrastre resulta natural en dispositivos táctiles."
    >
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="mx-auto flex">
            Abrir panel inferior
          </Button>
        </DrawerTrigger>
        <DrawerContent className="rounded-md">
          <div className="mx-auto w-full max-w-md p-6">
            <DrawerHeader>
              <DrawerTitle>Todo a mano</DrawerTitle>
              <DrawerDescription>
                Contenido accesible desde un panel que puedes cerrar al
                terminar.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </ComponentPreview>
  </>
);
