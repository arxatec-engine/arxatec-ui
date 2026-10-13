import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InlineDurationField } from "@/components/inline_duration_field";

vi.mock("@/components/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/components/scroll_area", () => ({
  ScrollArea: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div className={className}>
      <div data-slot="scroll-area-viewport">{children}</div>
    </div>
  ),
  ScrollBar: () => <div data-testid="scroll-bar" />,
}));

function renderField(
  props: Partial<React.ComponentProps<typeof InlineDurationField>> = {},
) {
  const onChange = props.onChange ?? vi.fn();
  const utils = render(
    <InlineDurationField
      value={0}
      ariaLabel="Duración"
      emptyText="Añade una duración"
      testId="duration"
      {...props}
      onChange={onChange}
    />,
  );
  return { ...utils, onChange };
}

describe("InlineDurationField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show the empty text when there is no duration", () => {
    renderField();

    expect(screen.getByTestId("duration")).toHaveTextContent(
      "Añade una duración",
    );
  });

  it("should show the formatted duration on the trigger", () => {
    renderField({ value: 5400 });

    expect(screen.getByTestId("duration")).toHaveTextContent("1h 30m");
  });

  it("should apply a preset and close the picker", () => {
    const { onChange } = renderField();

    fireEvent.click(screen.getByRole("button", { name: "30m" }));

    expect(onChange).toHaveBeenCalledWith(1800);
  });

  it("should keep the minutes when the hour wheel changes", () => {
    const { onChange } = renderField({ value: 1800 });
    const hours = screen.getByRole("listbox", { name: "Horas" });
    const two = [...hours.querySelectorAll('[role="option"]')].find(
      (option) => option.textContent === "02",
    );

    fireEvent.click(two!);

    expect(onChange).toHaveBeenCalledWith(2 * 3600 + 30 * 60);
  });

  it("should keep the hours when the minute wheel changes", () => {
    const { onChange } = renderField({ value: 3600 });
    const minuteOptions = screen.getByRole("listbox", { name: "Minutos" });
    const fifteen = [...minuteOptions.querySelectorAll('[role="option"]')].find(
      (option) => option.textContent === "15",
    );

    fireEvent.click(fifteen!);

    expect(onChange).toHaveBeenCalledWith(3600 + 15 * 60);
  });

  it("should disable the trigger when asked to", () => {
    renderField({ disabled: true });

    expect(screen.getByTestId("duration")).toBeDisabled();
  });

  it("should scroll the hour column with the mouse wheel", () => {
    renderField();
    const hours = screen.getByRole("listbox", { name: "Horas" });
    const viewport = hours.closest(
      "[data-slot=scroll-area-viewport]",
    ) as HTMLDivElement;
    let scrollTop = 0;
    Object.defineProperty(viewport, "scrollTop", {
      configurable: true,
      get: () => scrollTop,
      set: (next) => {
        scrollTop = next;
      },
    });

    fireEvent.wheel(viewport, { deltaY: 60 });

    expect(scrollTop).toBe(60);
  });
});
