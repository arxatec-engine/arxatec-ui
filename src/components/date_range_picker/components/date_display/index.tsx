import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import type { CalendarCheck, CalendarPlus } from "lucide-react";

interface Props {
  value: Date | undefined;
  icon: typeof CalendarCheck | typeof CalendarPlus;
  label: string;
}

export const DateDisplay: React.FC<Props> = ({ value, icon: Icon, label }) => (
  <span
    className={`text-sm flex items-center gap-1 ${
      value ? "text-foreground" : "text-muted-foreground"
    }`}
  >
    <Icon className="size-3" />
    {value ? format(value, "dd/MM/yyyy", { locale: es }) : label}
  </span>
);
