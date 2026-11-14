import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FileSimplePreviewRender } from "../file_simple_preview_render";
import { FileUrlPreviewRender } from "../file_url_preview_render";
import { FilePublicPreviewRender } from "../file_public_preview_render";
import { resolveFileViewKind } from "../../utilities/resolve_file_view_kind";

vi.mock("./index", () => ({
  FilePptxPreviewViewer: ({ file, url }: { file?: File; url?: string }) => (
    <div data-testid="ppt-source">{file?.name ?? url}</div>
  ),
}));

describe("presentation preview adapters", () => {
  it.each(["pptx", "ppt"])(
    "accepts a local %s with generic MIME",
    async (extension) => {
      const file = new File(["bytes"], `Informe.${extension}`, {
        type: "application/octet-stream",
      });
      render(<FileSimplePreviewRender file={file} url="blob:local" />);
      expect(await screen.findByTestId("ppt-source")).toHaveTextContent(
        file.name,
      );
    },
  );

  it("recognizes a presentation name on an extensionless signed URL", async () => {
    const url = "https://files.test/download?id=7&token=a+b";
    render(<FileUrlPreviewRender url={url} fileName="Informe.pptx" />);
    expect(await screen.findByTestId("ppt-source")).toHaveTextContent(url);
  });

  it("recognizes a presentation URL when the display name has no extension", async () => {
    const url = "https://files.test/Informe.ppt?token=a+b";
    render(<FileUrlPreviewRender url={url} fileName="Informe" />);
    expect(await screen.findByTestId("ppt-source")).toHaveTextContent(url);
  });

  it("prefers authorized local bytes in public presentations", async () => {
    render(
      <FilePublicPreviewRender
        fileName="Informe.pptx"
        mimeType="application/octet-stream"
        objectUrl="blob:authorized"
        signedUrl="https://files.test/Informe.pptx"
      />,
    );
    expect(await screen.findByTestId("ppt-source")).toHaveTextContent(
      "blob:authorized",
    );
  });

  it("accepts MIME-only public presentations and does not require a public URL", async () => {
    render(
      <FilePublicPreviewRender
        fileName="Informe"
        mimeType="application/vnd.ms-powerpoint"
        objectUrl="blob:authorized"
        signedUrl={null}
      />,
    );
    expect(await screen.findByTestId("ppt-source")).toHaveTextContent(
      "blob:authorized",
    );
  });

  it("routes generic and blank MIME presentations to Office", () => {
    expect(
      resolveFileViewKind("application/octet-stream", "Informe.pptx"),
    ).toBe("office");
    expect(resolveFileViewKind("", "Informe.PPT")).toBe("office");
  });
});
