import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { cn } from "@/utilities";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface Props<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
  size?: "default" | "sm";
}

export function FormInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  className,
  optional = false,
  disabled = false,
  size = "default",
}: Props<T>) {
  const error = errors[name];

  return (
    <div>
      {label && (
        <Label className="mb-2 flex items-center gap-2" htmlFor={name}>
          {label}
          {optional && (
            <span className="text-xs text-muted-foreground"> (Opcional)</span>
          )}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        disabled={disabled}
        className={cn(error && "border-rose-500/10 border", className)}
        size={size}
      />
      {error && (
        <p className="text-sm text-rose-500 mt-2" data-testid={`${name}-error`}>
          {error.message as string}
        </p>
      )}
    </div>
  );
}
