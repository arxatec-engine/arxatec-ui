import { Label } from "@/components/label";
import { Textarea } from "@/components/text_area";
import { cn } from "@/utilities";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface Props<T extends FieldValues>
  extends React.ComponentProps<"textarea"> {
  label?: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  className?: string;
  optional?: boolean;
  autoFocus?: boolean;
}

export function FormTextarea<T extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  errors,
  className,
  optional = false,
  autoFocus = false,
  ...props
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
      <Textarea
        id={name}
        placeholder={placeholder}
        {...register(name)}
        className={cn(error && "border-rose-500/10 border", className)}
        autoFocus={autoFocus ?? false}
        {...props}
      />
      {error && (
        <p className="text-sm text-rose-500 mt-2" data-testid={`${name}-error`}>
          {error.message as string}
        </p>
      )}
    </div>
  );
}
