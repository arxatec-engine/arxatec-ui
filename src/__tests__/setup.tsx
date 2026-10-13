import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React, { type ReactNode, type ReactElement } from "react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  configurable: true,
  value: vi.fn(),
});
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

// Exercise each field's behavior without depending on portal layout or editor engines.
vi.mock("@/components/popover", () => {
  const Context = React.createContext<{
    open: boolean;
    change: (open: boolean) => void;
  }>({
    open: false,
    change: () => {},
  });
  return {
    Popover: ({
      children,
      open,
      onOpenChange,
    }: {
      children?: ReactNode;
      open?: boolean;
      onOpenChange?: (value: boolean) => void;
    }) => {
      const [local, setLocal] = React.useState(false);
      return (
        <Context.Provider
          value={{ open: open ?? local, change: onOpenChange ?? setLocal }}
        >
          {children}
        </Context.Provider>
      );
    },
    PopoverTrigger: ({
      children,
    }: {
      children: ReactElement<{ onClick?: (event: React.MouseEvent) => void }>;
    }) => {
      const { open, change } = React.useContext(Context);
      return React.cloneElement(children, {
        onClick: (event: React.MouseEvent) => {
          children.props.onClick?.(event);
          change(!open);
        },
      });
    },
    PopoverContent: React.forwardRef<HTMLDivElement, { children?: ReactNode }>(
      function MockPopoverContent({ children }, ref) {
        const { open } = React.useContext(Context);
        return open ? <div ref={ref}>{children}</div> : null;
      },
    ),
  };
});

vi.mock("@/components/command", () => ({
  Command: React.forwardRef<HTMLDivElement, { children?: ReactNode }>(
    function MockCommand({ children }, ref) {
      return (
        <div tabIndex={0} ref={ref}>
          {children}
        </div>
      );
    },
  ),
  CommandList: ({ children }: { children?: ReactNode }) => (
    <div role="listbox">{children}</div>
  ),
  CommandItem: ({
    children,
    onSelect,
  }: {
    children?: ReactNode;
    onSelect?: () => void;
  }) => (
    <div role="option" aria-selected={false} onClick={onSelect}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/calendar", () => ({
  Calendar: ({
    selected,
    defaultMonth,
    onSelect,
  }: {
    selected?: Date;
    defaultMonth?: Date;
    onSelect?: (date: Date) => void;
  }) => {
    const month = defaultMonth ?? selected ?? new Date(2026, 0, 1);
    return (
      <div>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <button
            type="button"
            key={day}
            data-testid={`calendar-day-${day}`}
            onClick={() =>
              onSelect?.(new Date(month.getFullYear(), month.getMonth(), day))
            }
          >
            {day}
          </button>
        ))}
      </div>
    );
  },
}));

vi.mock("@/components/description_markdown_editor", () => ({
  DescriptionMarkdownEditor: ({
    value,
    onChange,
    onSubmit,
    onEscape,
    placeholder,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    onEscape?: () => void;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSubmit?.();
        if (event.key === "Escape") onEscape?.();
      }}
    />
  ),
}));
