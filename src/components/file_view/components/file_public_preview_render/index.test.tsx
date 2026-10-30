import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilePublicPreviewRender } from "./index";

vi.mock("../office_viewer", () => ({
  FileOfficeViewer: ({ url }: { url: string }) => (
    <div data-testid="office-source">{url}</div>
  ),
}));

describe("public Office preview sources", () => {
  it.each(["docx", "doc", "odt"])(
    "accepts the authorized local bytes for %s",
    async (extension) => {
      render(
        <FilePublicPreviewRender
          fileName={`Contrato.${extension}`}
          mimeType="application/octet-stream"
          objectUrl="blob:local-document"
          signedUrl={null}
          convertToDocx={vi.fn()}
        />,
      );
      await waitFor(() =>
        expect(screen.getByTestId("office-source")).toHaveTextContent(
          "blob:local-document",
        ),
      );
    },
  );

  it("keeps the public signed URL for the Excel embed even when an object URL exists", async () => {
    render(
      <FilePublicPreviewRender
        fileName="Libro.xlsx"
        objectUrl="blob:local-document"
        signedUrl="https://example.com/Libro.xlsx"
      />,
    );
    await waitFor(() =>
      expect(screen.getByTestId("office-source")).toHaveTextContent(
        "https://example.com/Libro.xlsx",
      ),
    );
  });
});
