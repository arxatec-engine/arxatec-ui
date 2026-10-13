import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InlineMarkdownField } from "@/components/inline_markdown_field";

describe("InlineMarkdownField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should stay open when it is not collapsible", () => {
    render(<InlineMarkdownField value="" onCommit={vi.fn()} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should read an empty collapsible field as the action that fills it", () => {
    render(
      <InlineMarkdownField
        collapsible
        value=""
        emptyText="Añadir notas para el cliente"
        onCommit={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Añadir notas para el cliente"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should show the current text instead of an empty box when there is content", () => {
    render(
      <InlineMarkdownField
        collapsible
        value="Pago a 30 días"
        emptyText="Añadir notas"
        onCommit={vi.fn()}
      />,
    );

    expect(screen.getByText("Pago a 30 días")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should open the editor when the collapsed field is pressed", () => {
    render(
      <InlineMarkdownField
        collapsible
        testId="notes"
        value=""
        emptyText="Añadir notas"
        onCommit={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("notes"));

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should commit and collapse again when the focus leaves the editor", () => {
    const onCommit = vi.fn();
    render(
      <InlineMarkdownField
        collapsible
        testId="notes"
        value=""
        emptyText="Añadir notas"
        onCommit={onCommit}
      />,
    );

    fireEvent.click(screen.getByTestId("notes"));
    const editor = screen.getByRole("textbox");
    fireEvent.focus(editor);
    fireEvent.change(editor, { target: { value: "Pago a 30 días" } });
    fireEvent.blur(screen.getByTestId("notes"));

    expect(onCommit).toHaveBeenCalledWith("Pago a 30 días");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should not commit when nothing changed", () => {
    const onCommit = vi.fn();
    render(
      <InlineMarkdownField
        collapsible
        testId="notes"
        value="Pago a 30 días"
        onCommit={onCommit}
      />,
    );

    fireEvent.click(screen.getByTestId("notes"));
    fireEvent.blur(screen.getByTestId("notes"));

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should keep the server value out of the way while the editor has focus", () => {
    const { rerender } = render(
      <InlineMarkdownField
        collapsible
        testId="notes"
        value="Original"
        onCommit={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("notes"));
    const editor = screen.getByRole("textbox");
    fireEvent.focus(editor);
    fireEvent.change(editor, { target: { value: "Lo que estoy escribiendo" } });

    rerender(
      <InlineMarkdownField
        collapsible
        testId="notes"
        value="Llegó del servidor"
        onCommit={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox")).toHaveValue("Lo que estoy escribiendo");
  });
});
