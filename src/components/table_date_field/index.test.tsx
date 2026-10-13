import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TableDateField } from "@/components/table_date_field";

const value = new Date(2026, 0, 10).toISOString();

const setup = (date: string | null = value, disabled = false) => {
  const onChange = vi.fn();
  const onRowClick = vi.fn();
  render(
    <div onClick={onRowClick}>
      <TableDateField
        value={date}
        onChange={onChange}
        ariaLabel="Fecha"
        clearLabel="Sin vencimiento"
        disabled={disabled}
      />
    </div>,
  );
  return { onChange, onRowClick };
};

describe("TableDateField", () => {
  it("opens without activating its row and sends the chosen date in ISO format", () => {
    const { onChange, onRowClick } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Fecha" }));
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("calendar-day-15"));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 15).toISOString());
    expect(screen.queryByTestId("calendar-day-15")).not.toBeInTheDocument();
  });

  it("does not commit the same date twice", () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Fecha" }));
    fireEvent.click(screen.getByTestId("calendar-day-10"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not change the same calendar day when the server date contains a time", () => {
    const { onChange } = setup(new Date(2026, 0, 10, 13, 30).toISOString());
    fireEvent.click(screen.getByRole("button", { name: "Fecha" }));
    fireEvent.click(screen.getByTestId("calendar-day-10"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears the optional date and closes the calendar", () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Fecha" }));
    fireEvent.click(screen.getByRole("button", { name: "Sin vencimiento" }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.queryByTestId("calendar-day-10")).not.toBeInTheDocument();
  });

  it("does not save when an empty date is cleared again", () => {
    const { onChange } = setup(null);
    fireEvent.click(screen.getByRole("button", { name: "Fecha" }));
    fireEvent.click(screen.getByRole("button", { name: "Sin vencimiento" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables the trigger while saving", () => {
    setup(value, true);
    expect(screen.getByRole("button", { name: "Fecha" })).toBeDisabled();
  });
});
