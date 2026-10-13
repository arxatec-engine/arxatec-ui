import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HexColorPickerPopover } from "@/components/hex_color_picker/hex_color_picker_popover";

vi.mock("@/components/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/components/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));
vi.mock("@/components/separator", () => ({
  Separator: () => <hr />,
}));
vi.mock("@/components/color_picker", () => ({
  ColorPickerPanel: ({
    onColorChange,
  }: {
    onColorChange: (next: string) => void;
  }) => (
    <button
      type="button"
      data-testid="emit-color"
      onClick={() => onColorChange("00ff00")}
    >
      emit
    </button>
  ),
}));

describe("HexColorPickerPopover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should label the trigger with the current color when a valid value is present", () => {
    render(<HexColorPickerPopover value="#FF0000" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Cambiar color (actual #FF0000)" }),
    ).toBeInTheDocument();
  });

  it("should use the default 'select color' label when value is not a valid color", () => {
    render(<HexColorPickerPopover value="" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Seleccionar color" }),
    ).toBeInTheDocument();
  });

  it("should prefer the provided triggerAriaLabel over the derived one", () => {
    render(
      <HexColorPickerPopover
        value="#FF0000"
        onChange={vi.fn()}
        triggerAriaLabel="Color de la columna"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Color de la columna" }),
    ).toBeInTheDocument();
  });

  it("should disable the trigger when disabled is true", () => {
    render(
      <HexColorPickerPopover value="#FF0000" onChange={vi.fn()} disabled />,
    );

    expect(
      screen.getByRole("button", { name: "Cambiar color (actual #FF0000)" }),
    ).toBeDisabled();
  });

  it("should set the trigger background to the normalized color", () => {
    render(<HexColorPickerPopover value="#FF0000" onChange={vi.fn()} />);

    const trigger = screen.getByRole("button", {
      name: "Cambiar color (actual #FF0000)",
    });
    expect(trigger).toHaveStyle({ backgroundColor: "#FF0000" });
  });

  it("should forward onChange from the inner content when a color is emitted", () => {
    const onChange = vi.fn();
    render(<HexColorPickerPopover value="#FF0000" onChange={onChange} />);

    fireEvent.click(screen.getByTestId("emit-color"));

    expect(onChange).toHaveBeenCalledWith("#00FF00");
  });

  it("should clear the color (onChange with empty string) when the clear action runs", () => {
    const onChange = vi.fn();
    render(<HexColorPickerPopover value="#FF0000" onChange={onChange} />);

    fireEvent.click(screen.getByText("Quitar color"));

    expect(onChange).toHaveBeenCalledWith("");
  });
});
