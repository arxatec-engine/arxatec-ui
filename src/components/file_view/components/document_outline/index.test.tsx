import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocumentOutline, type DocumentOutlineItem } from "./index";
import { getWordHeadingLevel } from "./utilities/word_headings";

describe("Word outline levels", () => {
  it.each([
    ["docx-preview-container_title", 0],
    ["docx-preview-container_subtitle", 1],
    ["docx-preview-container_heading1", 1],
    ["docx-preview-container_heading-2", 2],
    ["docx-preview-container_heading3", 3],
    ["docx-preview-container_normal", null],
  ])("reads %s as level %s", (className, expected) => {
    const paragraph = document.createElement("p");
    paragraph.className = className;
    expect(getWordHeadingLevel(paragraph)).toBe(expected);
  });
});

describe("DocumentOutline", () => {
  it("indents nested entries and emphasizes only the active heading", () => {
    let secondPosition = 400;
    const items: DocumentOutlineItem[] = [
      { title: "Título", level: 0, position: () => -100, navigate: vi.fn() },
      { title: "Subtítulo", level: 1, position: () => secondPosition, navigate: vi.fn() },
    ];
    render(<DocumentOutline items={items} />);

    expect(screen.getAllByRole("button", { name: /título/i })).toHaveLength(2);
    fireEvent.mouseEnter(screen.getByRole("navigation", { name: "Índice del documento" }));
    const title = screen.getAllByRole("button", { name: "Título" }).at(-1)!;
    const subtitle = screen.getAllByRole("button", { name: "Subtítulo" }).at(-1)!;
    expect(title).toHaveStyle({ paddingLeft: "12px" });
    expect(subtitle).toHaveStyle({ paddingLeft: "28px" });
    expect(title).toHaveClass("font-medium");
    expect(subtitle).not.toHaveClass("font-medium");

    secondPosition = 20;
    fireEvent.scroll(document);
    expect(subtitle).toHaveClass("font-medium");
    expect(title).not.toHaveClass("font-medium");
  });
});
