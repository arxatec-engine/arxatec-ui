import { Input } from "@/components/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";

interface Props {
  value: Date | undefined;
  placeholder: string;
  onClick: () => void;
  onClear: () => void;
}

export const DateInput: React.FC<Props> = ({
  value,
  placeholder,
  onClick,
  onClear,
}) => (
  <div className="relative">
    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      size="sm"
      placeholder={placeholder}
      value={value ? format(value, "dd/MM/yyyy", { locale: es }) : ""}
      readOnly
      className="pl-9 bg-muted/50"
      onClick={onClick}
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-4 hover:bg-border transition cursor-pointer rounded-full"
      >
        <X className="size-3" />
      </button>
    )}
  </div>
);
