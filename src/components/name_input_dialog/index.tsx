import { useId, type ReactNode, type ComponentProps } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
export interface NameInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  descriptionHidden?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onConfirm: () => void | Promise<void>;
  placeholder?: string;
  inputLabel?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  buttonSize?: ComponentProps<typeof Button>["size"];
  pending?: boolean;
  className?: string;
}
export function NameInputDialog({
  open,
  onOpenChange,
  title,
  description,
  descriptionHidden = true,
  value,
  onValueChange,
  onConfirm,
  placeholder,
  inputLabel,
  confirmLabel,
  cancelLabel,
  buttonSize = "sm",
  pending = false,
  className,
}: NameInputDialogProps) {
  const id = useId();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription
            className={descriptionHidden ? "sr-only" : undefined}
          >
            {description ?? title}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          {inputLabel ? <Label htmlFor={id}>{inputLabel}</Label> : null}
          <Input
            id={id}
            aria-label={
              typeof inputLabel === "string" ? inputLabel : placeholder
            }
            placeholder={placeholder}
            value={value}
            size="sm"
            disabled={pending}
            autoFocus
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.nativeEvent.isComposing &&
                value.trim() &&
                !pending
              ) {
                event.preventDefault();
                void onConfirm();
              }
            }}
          />
        </div>
        <DialogFooter className="mt-2">
          <Button
            size={buttonSize}
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            size={buttonSize}
            disabled={pending || !value.trim()}
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
