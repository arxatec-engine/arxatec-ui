import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShinyText } from "@/components/shiny_text";

describe("ShinyText", () => {
  it("should render the provided children", () => {
    render(<ShinyText>Hola mundo</ShinyText>);

    expect(screen.getAllByText("Hola mundo")).toHaveLength(2);
  });

  it("should apply the custom className to the outer wrapper", () => {
    const { container } = render(
      <ShinyText className="custom-wrapper">Texto</ShinyText>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("custom-wrapper");
  });

  it("should apply the textClassName to the visible text layer", () => {
    render(<ShinyText textClassName="custom-text">Texto</ShinyText>);

    const layers = screen.getAllByText("Texto");
    const visibleLayer = layers.find((node) =>
      node.className.includes("custom-text"),
    );
    expect(visibleLayer).toBeDefined();
  });

  it("should mark the overlay layer as aria-hidden", () => {
    render(<ShinyText>Texto</ShinyText>);

    const overlay = screen
      .getAllByText("Texto")
      .find((node) => node.getAttribute("aria-hidden") !== null);
    expect(overlay).toBeDefined();
  });
});
