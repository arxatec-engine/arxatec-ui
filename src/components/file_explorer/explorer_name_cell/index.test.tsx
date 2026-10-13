import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExplorerNameCell } from "./index";

vi.mock("@/components/table", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/table")>()),
  TableCell: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="cell" className={className}>
      {children}
    </div>
  ),
}));

const PATH = "Casos / Expediente 42 / Anexos";

describe("ExplorerNameCell", () => {
  it("should render only the name when there is no path", () => {
    render(
      <ExplorerNameCell
        name="Demanda_laboral_v3.docx"
        icon={<span data-testid="icon" />}
      />,
    );

    expect(screen.getByText("Demanda_laboral_v3.docx")).toBeInTheDocument();
    expect(screen.queryByText(PATH)).not.toBeInTheDocument();
  });

  it("should render the ancestor path under the name when a deep search provides one", () => {
    render(
      <ExplorerNameCell
        name="Demanda_laboral_v3.docx"
        icon={<span data-testid="icon" />}
        path={PATH}
      />,
    );

    expect(screen.getByText(PATH)).toBeInTheDocument();
  });

  it("should expose the full path as a title so a truncated route stays readable", () => {
    render(
      <ExplorerNameCell
        name="Demanda_laboral_v3.docx"
        icon={<span data-testid="icon" />}
        path={PATH}
      />,
    );

    expect(screen.getByText(PATH)).toHaveAttribute("title", PATH);
  });

  it("should not render the path row for an item that lives at the module root", () => {
    render(
      <ExplorerNameCell
        name="Demanda_laboral_v3.docx"
        icon={<span data-testid="icon" />}
        path=""
      />,
    );

    expect(screen.getByTestId("cell").querySelectorAll("p")).toHaveLength(1);
  });
});
