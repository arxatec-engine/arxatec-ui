/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { cn } from "@/utilities";
import type { ReactNode } from "react";
import {
  type Control,
  type FieldErrors,
  type FieldValues,
  useController,
} from "react-hook-form";

interface FormSelectProps {
  name: string;
  label: string;
  control: Control<any & FieldValues>;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  errors?: FieldErrors<any & FieldValues>;
  renderItem?: (option: { value: string; label: string }) => ReactNode;
  children?: (option: { value: string; label: string }) => ReactNode;
  size?: "default" | "sm";
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  control,
  options = [],
  placeholder = "Selecciona una opción",
  className,
  errors,
  renderItem,
  children,
  size = "default",
}) => {
  const renderOption = renderItem ?? children;
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });

  return (
    <div className={`grid gap-2 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <Select
        key={`${name}-${
          typeof field.value === "string" ? field.value : "empty"
        }`}
        value={
          typeof field.value === "string" &&
          options.some((o) => o.value === field.value)
            ? field.value
            : undefined
        }
        onValueChange={field.onChange}
      >
        <SelectTrigger
          size={size}
          className={cn(
            "w-full",
            errors?.[name] && "border-rose-500/10 border"
          )}
          aria-invalid={Boolean(errors?.[name])}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="w-full"
            >
              {renderOption ? renderOption(option) : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors?.[name] && (
        <p className="text-sm text-rose-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
