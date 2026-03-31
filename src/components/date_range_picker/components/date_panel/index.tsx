import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { DateInput } from "..";
import { QUICK_DATE_OPTIONS } from "../../constants";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

interface Props {
  startDate: Date | undefined;
  dueDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onDueDateChange: (date: Date | undefined) => void;
}

export const DatePanel: React.FC<Props> = ({
  startDate,
  dueDate,
  onStartDateChange,
  onDueDateChange,
}) => {
  const [selectionMode, setSelectionMode] = useState<"start" | "due" | "range">(
    "start"
  );

  const normalizeDate = (date: Date | undefined) => {
    if (!date) return undefined;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  useEffect(() => {
    if (startDate && dueDate) {
      setSelectionMode("range");
      return;
    }

    if (startDate && !dueDate) {
      setSelectionMode("due");
      return;
    }

    if (!startDate && dueDate) {
      setSelectionMode("start");
      return;
    }
  }, [startDate, dueDate]);

  const handleQuickDateSelect = (days: number) => {
    const date = addDays(normalizeDate(new Date())!, days);
    onDueDateChange(date);
    setSelectionMode(startDate ? "range" : "start");
  };

  const handleDateSelect = (date: Date | undefined) => {
    const normalizedDate = normalizeDate(date);
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedDueDate = normalizeDate(dueDate);

    if (selectionMode === "range") {
      return;
    }

    if (selectionMode === "start") {
      onStartDateChange(normalizedDate);
      if (
        normalizedDate &&
        normalizedDueDate &&
        normalizedDate > normalizedDueDate
      ) {
        onDueDateChange(undefined);
        setSelectionMode("due");
        return;
      }
      if (normalizedDate && normalizedDueDate) {
        setSelectionMode("range");
      }
      return;
    }

    if (selectionMode === "due") {
      onDueDateChange(normalizedDate);
      if (
        normalizedDate &&
        normalizedStartDate &&
        normalizedDate < normalizedStartDate
      ) {
        onStartDateChange(undefined);
        setSelectionMode("start");
        return;
      }
      if (normalizedDate && normalizedStartDate) {
        setSelectionMode("range");
      }
      return;
    }
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    onStartDateChange(normalizeDate(range?.from));
    onDueDateChange(normalizeDate(range?.to));
  };

  const isRangeMode =
    selectionMode === "range" && Boolean(startDate && dueDate);
  const selectedDate =
    selectionMode === "start"
      ? startDate
      : selectionMode === "due"
      ? dueDate
      : undefined;
  const selectedRange =
    startDate || dueDate ? { from: startDate, to: dueDate } : undefined;

  return (
    <div>
      <div className="p-2 border-b grid grid-cols-1 md:grid-cols-2 gap-2">
        <DateInput
          value={startDate}
          placeholder="Fecha de inicio"
          onClick={() => setSelectionMode("start")}
          onClear={() => {
            onStartDateChange(undefined);
            setSelectionMode("start");
          }}
        />
        <DateInput
          value={dueDate}
          placeholder="Fecha de vencimiento"
          onClick={() => setSelectionMode("due")}
          onClear={() => {
            onDueDateChange(undefined);
            setSelectionMode("due");
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="w-[280px] hidden md:block border-r p-2 bg-secondary">
          {QUICK_DATE_OPTIONS.map((option, index) => {
            const targetDate = addDays(new Date(), option.days);
            return (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                className="w-full justify-between px-3  py-2 font-normal hover:bg-border!"
                onClick={() => handleQuickDateSelect(option.days)}
              >
                <span className="text-sm">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {format(targetDate, "d MMM", { locale: es })}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-center">
          {isRangeMode ? (
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={handleRangeSelect}
              numberOfMonths={1}
            />
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};
