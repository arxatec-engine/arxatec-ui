import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FileViewErrorState } from "./index";

describe("FileViewErrorState", () => {
  it("shows the shared error surface with format-specific copy and actions", () => {
    const retry = vi.fn();
    render(
      <FileViewErrorState
        title="No se pudo abrir el documento"
        description="Prueba otra vez."
        actions={<button onClick={retry}>Reintentar</button>}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("No se pudo abrir el documento");
    expect(alert).toHaveTextContent("Prueba otra vez.");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
