import { fireEvent, render, screen } from "@testing-library/react";
import React, { type ReactNode, type Ref } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  IconEmoji,
  IconEmojiPicker,
  isEmojiIcon,
} from "@/components/icon_emoji_picker";

// Preserve the primitive mocks used by these tests before moving from the platform.
vi.mock("@/components/icon_picker/components/icon", () => ({
  Icon: ({
    name,
    className,
    ...rest
  }: {
    name: string;
    className?: string;
  }) => (
    <span
      data-testid="ui-icon"
      data-icon={name}
      className={className}
      {...rest}
    />
  ),
}));

vi.mock("@/components/scroll_area", () => ({
  ScrollArea: ({
    children,
    viewportRef,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement> & {
    viewportRef?: Ref<HTMLDivElement>;
  }) => (
    <div ref={viewportRef} {...rest}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/tabs", () => {
  const Context = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
  }>({});
  return {
    Tabs: ({
      children,
      value,
      onValueChange,
    }: {
      children: ReactNode;
      value: string;
      onValueChange: (value: string) => void;
    }) => (
      <Context.Provider value={{ value, onValueChange }}>
        {children}
      </Context.Provider>
    ),
    TabsList: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <div role="tablist" className={className}>
        {children}
      </div>
    ),
    TabsTrigger: ({
      children,
      value,
    }: {
      children: ReactNode;
      value: string;
    }) => {
      const context = React.useContext(Context);
      return (
        <button
          type="button"
          role="tab"
          aria-selected={context.value === value}
          onClick={() => context.onValueChange?.(value)}
        >
          {children}
        </button>
      );
    },
    TabsContent: ({
      children,
      value,
    }: {
      children: ReactNode;
      value: string;
    }) => {
      const context = React.useContext(Context);
      return context.value === value ? (
        <div role="tabpanel">{children}</div>
      ) : null;
    },
  };
});

vi.mock("@/components/emoji_picker", () => {
  const Context = React.createContext<{
    onEmojiSelect?: (value: { emoji: string }) => void;
  }>({});
  return {
    EmojiPicker: ({
      children,
      onEmojiSelect,
      className,
    }: {
      children: ReactNode;
      onEmojiSelect: (value: { emoji: string }) => void;
      className?: string;
    }) => (
      <Context.Provider value={{ onEmojiSelect }}>
        <div data-testid="emoji-picker" className={className}>
          {children}
        </div>
      </Context.Provider>
    ),
    EmojiPickerSearch: ({ placeholder }: { placeholder?: string }) => (
      <input aria-label={placeholder} placeholder={placeholder} />
    ),
    EmojiPickerContent: () => {
      const context = React.useContext(Context);
      return (
        <button
          type="button"
          data-testid="emoji-option"
          onClick={() => context.onEmojiSelect?.({ emoji: "🚀" })}
        >
          🚀
        </button>
      );
    },
    EmojiPickerFooter: () => <div />,
  };
});

const renderPicker = (value: string, onValueChange = vi.fn()) => {
  render(
    <IconEmojiPicker value={value} onValueChange={onValueChange}>
      <button type="button">trigger</button>
    </IconEmojiPicker>,
  );

  fireEvent.click(screen.getByRole("button", { name: "trigger" }));

  return { onValueChange };
};

describe("isEmojiIcon", () => {
  it("should treat a lucide name as an icon", () => {
    expect(isEmojiIcon("folder")).toBe(false);
    expect(isEmojiIcon("square-kanban")).toBe(false);
    expect(isEmojiIcon("a-arrow-down")).toBe(false);
  });

  it("should treat a glyph as an emoji", () => {
    expect(isEmojiIcon("🚀")).toBe(true);
    expect(isEmojiIcon("👩‍⚖️")).toBe(true);
  });

  it("should treat empty values as an icon so the fallback renders", () => {
    expect(isEmojiIcon("")).toBe(false);
    expect(isEmojiIcon(null)).toBe(false);
    expect(isEmojiIcon(undefined)).toBe(false);
  });
});

describe("IconEmoji", () => {
  it("should render the glyph when the value is an emoji", () => {
    render(<IconEmoji value="🚀" />);

    expect(screen.getByTestId("icon-emoji-glyph")).toHaveTextContent("🚀");
  });

  it("should render a lucide icon when the value is a name", () => {
    render(<IconEmoji value="folder" />);

    expect(screen.getByTestId("ui-icon")).toHaveAttribute(
      "data-icon",
      "folder",
    );
    expect(screen.queryByTestId("icon-emoji-glyph")).not.toBeInTheDocument();
  });

  it("should fall back to the folder icon when there is no value", () => {
    render(<IconEmoji value="" />);

    expect(screen.getByTestId("ui-icon")).toHaveAttribute(
      "data-icon",
      "folder",
    );
  });
});

describe("IconEmojiPicker", () => {
  it("should open on the icons tab when the value is a lucide name", () => {
    renderPicker("folder");

    expect(screen.getByRole("tab", { name: "Iconos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("icon-grid-scroll")).toBeInTheDocument();
  });

  it("should open on the emojis tab when the value is an emoji", () => {
    renderPicker("🚀");

    expect(screen.getByRole("tab", { name: "Emojis" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
  });

  it("should report the selected icon name", () => {
    const { onValueChange } = renderPicker("folder");

    fireEvent.click(screen.getByRole("button", { name: "accessibility" }));

    expect(onValueChange).toHaveBeenCalledWith("accessibility");
  });

  it("should report the selected emoji", () => {
    const { onValueChange } = renderPicker("folder");

    fireEvent.click(screen.getByRole("tab", { name: "Emojis" }));
    fireEvent.click(screen.getByTestId("emoji-option"));

    expect(onValueChange).toHaveBeenCalledWith("🚀");
  });

  it("should filter the icons by the search term", () => {
    renderPicker("folder");

    fireEvent.change(screen.getByPlaceholderText("Buscar un icono…"), {
      target: { value: "accessibility" },
    });

    expect(
      screen.getByRole("button", { name: "accessibility" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "a-arrow-down" }),
    ).not.toBeInTheDocument();
  });

  it("should show the empty state when nothing matches", () => {
    renderPicker("folder");

    fireEvent.change(screen.getByPlaceholderText("Buscar un icono…"), {
      target: { value: "zzzzzz" },
    });

    expect(
      screen.getByText("No se encontró ningún icono."),
    ).toBeInTheDocument();
  });
});
