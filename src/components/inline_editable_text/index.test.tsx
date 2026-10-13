import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InlineEditableText } from "@/components/inline_editable_text";

function renderField(
  props: Partial<React.ComponentProps<typeof InlineEditableText>> = {},
) {
  const onCommit = props.onCommit ?? vi.fn();
  const utils = render(
    <InlineEditableText
      value="Juan Perez"
      ariaLabel="Nombre"
      testId="field"
      {...props}
      onCommit={onCommit}
    />,
  );
  return { ...utils, onCommit };
}

describe("InlineEditableText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should read as plain text until it is clicked", () => {
    renderField();

    const trigger = screen.getByTestId("field");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveTextContent("Juan Perez");
  });

  it("should turn into an input on click, focused and with the current value", () => {
    renderField();

    fireEvent.click(screen.getByTestId("field"));

    const input = screen.getByTestId("field");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveValue("Juan Perez");
    expect(input).toHaveFocus();
  });

  it("should leave the caret at the end by default", () => {
    renderField();

    fireEvent.click(screen.getByTestId("field"));

    const input = screen.getByTestId<HTMLInputElement>("field");
    expect(input.selectionStart).toBe("Juan Perez".length);
  });

  it("should select the whole value when asked to", () => {
    renderField({ selectOnEdit: true });

    fireEvent.click(screen.getByTestId("field"));

    const input = screen.getByTestId<HTMLInputElement>("field");
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe("Juan Perez".length);
  });

  it("should commit on Enter and go back to text", () => {
    const { onCommit } = renderField();
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Juana Perez" },
    });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(onCommit).toHaveBeenCalledExactlyOnceWith("Juana Perez");
    expect(screen.getByTestId("field").tagName).toBe("BUTTON");
  });

  it("should commit on blur", () => {
    const { onCommit } = renderField();
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Juana Perez" },
    });
    fireEvent.blur(screen.getByTestId("field"));

    expect(onCommit).toHaveBeenCalledExactlyOnceWith("Juana Perez");
  });

  it("should trim the value before committing", () => {
    const { onCommit } = renderField();
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "  Juana Perez  " },
    });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(onCommit).toHaveBeenCalledExactlyOnceWith("Juana Perez");
  });

  it("should not commit when nothing changed", () => {
    const { onCommit } = renderField();
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByTestId("field").tagName).toBe("BUTTON");
  });

  it("should discard the edit on Escape without committing", () => {
    const { onCommit } = renderField();
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Otra cosa" },
    });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Escape" });

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByTestId("field")).toHaveTextContent("Juan Perez");
  });

  it("should keep Escape from reaching the dialog that contains it", () => {
    const onParentKeyDown = vi.fn();
    render(
      <div onKeyDown={onParentKeyDown}>
        <InlineEditableText
          value="Juan Perez"
          ariaLabel="Nombre"
          testId="nested"
          onCommit={vi.fn()}
        />
      </div>,
    );
    fireEvent.click(screen.getByTestId("nested"));

    fireEvent.keyDown(screen.getByTestId("nested"), { key: "Escape" });

    expect(onParentKeyDown).not.toHaveBeenCalled();
  });

  it("should show the placeholder when there is no value", () => {
    renderField({ value: "", placeholder: "Añadir teléfono" });

    expect(screen.getByTestId("field")).toHaveTextContent("Añadir teléfono");
  });

  it("should fall back to the shared empty copy when there is no placeholder", () => {
    renderField({ value: "" });

    expect(screen.getByTestId("field")).toHaveTextContent("Añadir…");
  });

  it("should block the commit and stay in edit mode when validation fails", () => {
    const { onCommit } = renderField({
      validate: (next: string) => (next.length < 2 ? "Demasiado corto" : null),
    });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), { target: { value: "J" } });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByTestId("field").tagName).toBe("INPUT");
    expect(screen.getByTestId("field")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Demasiado corto")).toBeInTheDocument();
  });

  it("should not loop when the blur that fails validation gives the focus back", () => {
    const { onCommit } = renderField({
      validate: (next: string) => (next.length < 2 ? "Demasiado corto" : null),
    });
    fireEvent.click(screen.getByTestId("field"));
    fireEvent.change(screen.getByTestId("field"), { target: { value: "J" } });

    fireEvent.blur(screen.getByTestId("field"));
    fireEvent.blur(screen.getByTestId("field"));

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByTestId("field").tagName).toBe("INPUT");
  });

  it("should let Enter add a newline in multiline mode", () => {
    const { onCommit } = renderField({ multiline: true, value: "Nota" });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByTestId("field").tagName).toBe("TEXTAREA");
  });

  it("should commit multiline with meta+Enter", () => {
    const { onCommit } = renderField({ multiline: true, value: "Nota" });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Nota larga" },
    });
    fireEvent.keyDown(screen.getByTestId("field"), {
      key: "Enter",
      metaKey: true,
    });

    expect(onCommit).toHaveBeenCalledExactlyOnceWith("Nota larga");
  });

  it("should not open the editor when disabled", () => {
    renderField({ disabled: true });

    fireEvent.click(screen.getByTestId("field"));

    expect(screen.getByTestId("field").tagName).toBe("BUTTON");
  });

  it("should follow a new value coming from the outside", () => {
    const { rerender } = renderField();

    rerender(
      <InlineEditableText
        value="Otro contacto"
        ariaLabel="Nombre"
        testId="field"
        onCommit={vi.fn()}
      />,
    );

    expect(screen.getByTestId("field")).toHaveTextContent("Otro contacto");
  });

  it("should report every keystroke through onChange for whoever autosaves", () => {
    const onChange = vi.fn();
    renderField({ onChange });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Juana " },
    });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("Juana ");
  });

  it("should tell the consumer to drop what it had queued on Escape", () => {
    const onCancel = vi.fn();
    renderField({ onCancel });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Otra cosa" },
    });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Escape" });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should not call onCancel when the edit is committed", () => {
    const onCancel = vi.fn();
    renderField({ onCancel });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), {
      target: { value: "Juana Perez" },
    });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(onCancel).not.toHaveBeenCalled();
  });

  it("should tag the validation message with the testId so tests do not chase copy", () => {
    renderField({
      validate: (next: string) => (next.length < 2 ? "Demasiado corto" : null),
    });
    fireEvent.click(screen.getByTestId("field"));

    fireEvent.change(screen.getByTestId("field"), { target: { value: "J" } });
    fireEvent.keyDown(screen.getByTestId("field"), { key: "Enter" });

    expect(screen.getByTestId("field-error")).toHaveTextContent(
      "Demasiado corto",
    );
  });

  it("should expose the accessible name it was given", () => {
    renderField({ ariaLabel: "Correo electrónico" });

    expect(
      screen.getByRole("button", { name: "Correo electrónico" }),
    ).toBeInTheDocument();
    act(() => screen.getByTestId("field").click());
    expect(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
    ).toBeInTheDocument();
  });
});
