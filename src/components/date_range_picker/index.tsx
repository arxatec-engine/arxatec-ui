import { ArrowRight, CalendarCheck, CalendarPlus } from "lucide-react";
import { DateDisplay, DatePanel } from "./components";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";

interface Props {
  startDate?: Date;
  dueDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onDueDateChange: (date: Date | undefined) => void;
  errorMessage?: string;
  label?: string;
  optional?: boolean;
}

export const DateRangePicker = ({
  startDate,
  dueDate,
  onStartDateChange,
  onDueDateChange,
  errorMessage,
  label = "Fecha",
  optional = false,
}: Props) => {
  return (
    <div>
      <Label className="mb-2 flex items-center gap-2">
        {label}
        {optional && (
          <span className="text-xs text-muted-foreground">(Opcional)</span>
        )}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="justify-start text-left font-normal w-full bg-card"
          >
            <DateDisplay
              value={startDate}
              icon={startDate ? CalendarCheck : CalendarPlus}
              label="Inicio"
            />
            <ArrowRight className="size-3" />
            <DateDisplay
              value={dueDate}
              icon={dueDate ? CalendarCheck : CalendarPlus}
              label="Final"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
          <DatePanel
            startDate={startDate}
            dueDate={dueDate}
            onStartDateChange={onStartDateChange}
            onDueDateChange={onDueDateChange}
          />
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="text-sm text-destructive mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
