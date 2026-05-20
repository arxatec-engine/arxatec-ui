import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";

export interface FileViewUnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDiscard: () => void;
  title?: string;
  description?: React.ReactNode;
}

export const FileViewUnsavedChangesDialog: React.FC<
  FileViewUnsavedChangesDialogProps
> = ({
  open,
  onOpenChange,
  onConfirmDiscard,
  title = "Cambios sin guardar",
  description = (
    <>
      Tienes cambios en la pestaña <strong>Editar</strong>. Si sales ahora, los
      cambios se perderán.
    </>
  ),
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirmDiscard}>
          Salir sin guardar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
