import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

export interface FileDocumentExportDialogProps {
  labels?: {
    title?: string;
    nameLabel?: string;
    placeholder?: string;
    cancel?: string;
    confirm?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportType: "pdf" | "word";
  exportName: string;
  onExportNameChange: (name: string) => void;
  onConfirm: () => void;
}

export const FileDocumentExportDialog = ({
  labels,
  open,
  onOpenChange,
  exportType,
  exportName,
  onExportNameChange,
  onConfirm,
}: FileDocumentExportDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {labels?.title ?? `Exportar Documento (${exportType.toUpperCase()})`}
        </DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Label className="mb-2 block">
          {labels?.nameLabel ?? "Nombre del archivo"}
        </Label>
        <Input
          value={exportName}
          onChange={(e) => onExportNameChange(e.target.value)}
          placeholder={labels?.placeholder ?? "Nombre del archivo..."}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {labels?.cancel ?? "Cancelar"}
        </Button>
        <Button onClick={onConfirm}>
          {labels?.confirm ?? "Exportar y Guardar"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
