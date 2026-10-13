import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TableOptionField } from "@/components/table_option_field";

const options = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
];

function setup(value: string | null = "pending", disabled = false) {
  const onChange = vi.fn();
  const onRowClick = vi.fn();
  render(
    <div onClick={onRowClick}>
      <TableOptionField
        value={value}
        options={options}
        ariaLabel="Estado"
        clearLabel="Sin estado"
        onChange={onChange}
        disabled={disabled}
        renderOption={(option) => option.label}
      >
        Estado actual
      </TableOptionField>
    </div>,
  );
  return { onChange, onRowClick };
}

describe("TableOptionField", () => {
  it("opens the selector without activating its row and commits the selected value", () => {
    const { onChange, onRowClick } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Estado" }));
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("option", { name: "Pagado" }));
    expect(onChange).toHaveBeenCalledWith("paid");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes without committing the current value", () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Estado" }));
    fireEvent.click(screen.getByRole("option", { name: "Pendiente" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clears an optional value", () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Estado" }));
    fireEvent.click(screen.getByRole("option", { name: "Sin estado" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("blocks the selector while disabled", () => {
    const { onChange } = setup("pending", true);
    const trigger = screen.getByRole("button", { name: "Estado" });
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
