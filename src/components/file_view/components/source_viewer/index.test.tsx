import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";

import { FileSourceViewer } from "./index";

const source = {
  content: '<script>alert("hola")</script>\nconst file = "áéíóú";\n',
  fileName: "ejemplo.ts",
  mimeType: "text/typescript",
};

afterEach(() => vi.restoreAllMocks());

describe("source preview actions", () => {
  it("copies the original text without executing markup and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const { container } = render(<FileSourceViewer {...source} />);
    expect(container.querySelector("script")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(source.content));
    expect(
      await screen.findByRole("button", { name: "Código copiado" }),
    ).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent("Código copiado");
  });

  it("keeps the copy action usable when the clipboard rejects the request", async () => {
    const error = vi.spyOn(toast, "error").mockImplementation(() => "error");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(
      <FileSourceViewer
        {...source}
        labels={{ copyError: "Clipboard unavailable" }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    await waitFor(() =>
      expect(error).toHaveBeenCalledWith("Clipboard unavailable"),
    );
    expect(screen.getByRole("button", { name: "Copiar código" })).toBeEnabled();
  });

  it("discards a pending copy after the file changes", async () => {
    let finish: (() => void) | undefined;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((resolve) => {
            finish = resolve;
          }),
      },
    });
    const { rerender } = render(<FileSourceViewer {...source} />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    rerender(
      <FileSourceViewer {...source} fileName="otro.ts" content="export {};" />,
    );
    await act(async () => finish?.());
    expect(screen.getByRole("button", { name: "Copiar código" })).toBeEnabled();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("uses the consumer's download callback and labels", async () => {
    const onDownload = vi.fn().mockResolvedValue(undefined);
    render(
      <FileSourceViewer
        {...source}
        onDownload={onDownload}
        labels={{ download: "Download source" }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Download source" }));
    await waitFor(() => expect(onDownload).toHaveBeenCalledOnce());
  });

  it("previews empty text and releases parent loading on error and unmount", () => {
    const onLoadingChange = vi.fn();
    const { rerender, unmount } = render(
      <FileSourceViewer
        {...source}
        isPending
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    rerender(
      <FileSourceViewer
        {...source}
        isPending
        isError
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText("No se pudo cargar el código")).toBeInTheDocument();
    rerender(
      <FileSourceViewer
        {...source}
        content=""
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(
      screen.getByRole("toolbar", { name: "Controles del visor de código" }),
    ).toBeInTheDocument();
    unmount();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });
});
