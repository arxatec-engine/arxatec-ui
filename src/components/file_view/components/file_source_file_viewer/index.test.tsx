import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileSourceFileViewer } from "./index";

describe("FileSourceFileViewer", () => {
  it("renders untrusted TXT markup as text and completes loading", async () => {
    const content =
      '<img src=x onerror="alert(document.cookie)"><script>alert(1)</script>';
    const file = new File([content], "documento.txt", { type: "text/plain" });
    // JSDOM's File lacks Blob.text(); retain the real viewer and renderer.
    Object.defineProperty(file, "text", { value: () => Promise.resolve(content) });
    const onLoadingChange = vi.fn();
    const { container } = render(
      <FileSourceFileViewer file={file} onLoadingChange={onLoadingChange} />,
    );

    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    await waitFor(() =>
      expect(container.querySelector("code")).toHaveTextContent(content),
    );
    expect(container.querySelector("img, script, iframe")).toBeNull();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("shows a read error and clears loading when the TXT cannot be read", async () => {
    const file = new File([], "documento.txt", { type: "text/plain" });
    Object.defineProperty(file, "text", {
      value: () => Promise.reject(new Error("File read failed")),
    });
    const onLoadingChange = vi.fn();
    render(<FileSourceFileViewer file={file} onLoadingChange={onLoadingChange} />);

    expect(
      await screen.findByText("No se pudo cargar el código"),
    ).toBeInTheDocument();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });
});
