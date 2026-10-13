import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HexColorPickerContent } from "@/components/hex_color_picker/hex_color_picker_content";

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
  Separator: () => <hr data-testid="separator" />,
}));
vi.mock("@/components/color_picker", () => ({
  ColorPickerPanel: ({
    pickerValue,
    onColorChange,
  }: {
    pickerValue: string;
    onColorChange: (next: string) => void;
  }) => (
    <div data-testid="color-picker-panel" data-picker-value={pickerValue}>
      <button
        type="button"
        data-testid="emit-color"
        onClick={() => onColorChange("00ff00")}
      >
        emit
      </button>
      <button
        type="button"
        data-testid="emit-invalid"
        onClick={() => onColorChange("zzz")}
      >
        emit invalid
      </button>
    </div>
  ),
}));

describe("HexColorPickerContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the color picker panel with the normalized picker value", () => {
    render(<HexColorPickerContent value="ff0000" onChange={vi.fn()} />);

    expect(screen.getByTestId("color-picker-panel")).toHaveAttribute(
      "data-picker-value",
      "#FF0000",
    );
  });

  it("should call onChange with a normalized color when the panel emits a valid color", () => {
    const onChange = vi.fn();
    render(<HexColorPickerContent value="#FF0000" onChange={onChange} />);

    fireEvent.click(screen.getByTestId("emit-color"));

    expect(onChange).toHaveBeenCalledWith("#00FF00");
  });

  it("should not call onChange when the panel emits an invalid color", () => {
    const onChange = vi.fn();
    render(<HexColorPickerContent value="#FF0000" onChange={onChange} />);

    fireEvent.click(screen.getByTestId("emit-invalid"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should not render the clear button when onClear is missing", () => {
    render(<HexColorPickerContent value="#FF0000" onChange={vi.fn()} />);

    expect(screen.queryByText("Quitar color")).not.toBeInTheDocument();
  });

  it("should render the clear button only when there is a normalized value and onClear", () => {
    render(
      <HexColorPickerContent
        value="#FF0000"
        onChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByText("Quitar color")).toBeInTheDocument();
  });

  it("should not render the clear button when value is not a valid color even with onClear", () => {
    render(
      <HexColorPickerContent
        value="invalid"
        onChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.queryByText("Quitar color")).not.toBeInTheDocument();
  });

  it("should call onClear when the clear button is clicked", () => {
    const onClear = vi.fn();
    render(
      <HexColorPickerContent
        value="#FF0000"
        onChange={vi.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByText("Quitar color"));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("should render the accept button with a custom label and call onAccept on click", () => {
    const onAccept = vi.fn();
    render(
      <HexColorPickerContent
        value="#FF0000"
        onChange={vi.fn()}
        onAccept={onAccept}
        acceptLabel="Confirmar"
      />,
    );

    fireEvent.click(screen.getByText("Confirmar"));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("should disable the accept button when acceptDisabled is true", () => {
    render(
      <HexColorPickerContent
        value="#FF0000"
        onChange={vi.fn()}
        onAccept={vi.fn()}
        acceptDisabled
      />,
    );

    expect(screen.getByText("Aceptar")).toBeDisabled();
  });

  it("should not render the actions section when neither accept nor clear apply", () => {
    render(<HexColorPickerContent value="invalid" onChange={vi.fn()} />);

    expect(screen.queryByTestId("separator")).not.toBeInTheDocument();
  });
});
