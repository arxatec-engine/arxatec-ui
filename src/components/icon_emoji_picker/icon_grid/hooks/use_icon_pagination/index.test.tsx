import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PAGE_SIZE } from "@/components/icon_emoji_picker/icon_grid/constants";
import { useIconPagination } from "@/components/icon_emoji_picker/icon_grid/hooks";

const VIEWPORT_HEIGHT = 268;
const ICONS_PER_ROW = 12;
const ROW_HEIGHT = 24;

let scrollTop = 0;

const originalScrollTop = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollTop",
);

const stubLayout = () => {
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => VIEWPORT_HEIGHT,
  });
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get(this: HTMLElement) {
      const rows = Math.ceil(
        this.querySelectorAll("span").length / ICONS_PER_ROW,
      );
      return Math.max(VIEWPORT_HEIGHT, rows * ROW_HEIGHT);
    },
  });
  Object.defineProperty(HTMLElement.prototype, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (next: number) => {
      scrollTop = next;
    },
  });
};

const restoreLayout = () => {
  Reflect.deleteProperty(HTMLElement.prototype, "clientHeight");
  Reflect.deleteProperty(HTMLElement.prototype, "scrollHeight");
  Reflect.deleteProperty(HTMLElement.prototype, "scrollTop");
  if (originalScrollTop) {
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollTop",
      originalScrollTop,
    );
  }
};

const Harness = () => {
  const { query, search, visible, isEmpty, viewportRef } = useIconPagination();

  return (
    <div>
      <input
        aria-label="search"
        value={query}
        onChange={(event) => search(event.target.value)}
      />
      <div ref={viewportRef} data-testid="viewport">
        {visible.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <p data-testid="empty">{String(isEmpty)}</p>
    </div>
  );
};

const rendered = () =>
  screen.getByTestId("viewport").querySelectorAll("span").length;

const scrollToBottom = () => {
  const viewport = screen.getByTestId("viewport");
  viewport.scrollTop = viewport.scrollHeight - VIEWPORT_HEIGHT;
  fireEvent.scroll(viewport);
};

describe("useIconPagination", () => {
  beforeEach(() => {
    scrollTop = 0;
    stubLayout();
  });

  afterEach(restoreLayout);

  it("should keep loading pages until the icons overflow the viewport", () => {
    render(<Harness />);

    expect(rendered()).toBe(PAGE_SIZE * 2);
    expect(screen.getByTestId("viewport").scrollHeight).toBeGreaterThan(
      VIEWPORT_HEIGHT,
    );
  });

  it("should load the next page when the scroll reaches the bottom", () => {
    render(<Harness />);

    scrollToBottom();

    expect(rendered()).toBe(PAGE_SIZE * 3);
  });

  it("should filter the icons by the search term and start over on the first page", () => {
    render(<Harness />);
    scrollToBottom();

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "alarm" },
    });

    const names = [
      ...screen.getByTestId("viewport").querySelectorAll("span"),
    ].map((node) => node.textContent);
    expect(names.length).toBeLessThan(PAGE_SIZE);
    expect(names.every((name) => name?.includes("alarm"))).toBe(true);
  });

  it("should report an empty result when nothing matches", () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "zzzzzz" },
    });

    expect(screen.getByTestId("empty")).toHaveTextContent("true");
    expect(rendered()).toBe(0);
  });

  it("should ignore the case and the surrounding spaces of the search term", () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "  ALARM  " },
    });

    expect(rendered()).toBeGreaterThan(0);
    expect(screen.getByTestId("empty")).toHaveTextContent("false");
  });
});
