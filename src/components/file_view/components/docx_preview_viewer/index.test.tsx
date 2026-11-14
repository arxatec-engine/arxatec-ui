import { StrictMode } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderAsync } from "docx-preview";

import { FileDocxPreviewViewer } from "./index";
import type { FileWordDocumentConverter } from "./types";
import { resolveWordDocumentFormat } from "../../utilities/word_document_format";

vi.mock("docx-preview", () => ({ renderAsync: vi.fn() }));

const DOCX =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const localFile = (name = "Contrato.docx") =>
  new File(["document bytes"], name, { type: DOCX });
const previewText = (container: HTMLElement) =>
  container.querySelector("[data-document-preview]")?.shadowRoot?.textContent;

describe("FileDocxPreviewViewer", () => {
  beforeEach(() => {
    vi.mocked(renderAsync).mockReset();
    vi.mocked(renderAsync).mockImplementation(async (_blob, target) => {
      target.textContent = "Contrato de prueba";
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("document bytes", { headers: { "Content-Type": DOCX } }),
    );
  });
  afterEach(() => vi.restoreAllMocks());

  it("renders a local DOCX with one loader until rendering settles", async () => {
    const file = localFile();
    const onLoadingChange = vi.fn();
    const { container } = render(
      <FileDocxPreviewViewer file={file} onLoadingChange={onLoadingChange} />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    await waitFor(() =>
      expect(onLoadingChange).toHaveBeenLastCalledWith(false),
    );
    expect(renderAsync).toHaveBeenCalledWith(
      file,
      expect.any(HTMLElement),
      undefined,
      expect.objectContaining({ renderAltChunks: false }),
    );
    expect(previewText(container)).toContain("Contrato de prueba");
    expect(screen.queryByRole("status")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("downloads a signed URL intact and uses the same local renderer", async () => {
    const url = "https://files.example.com/download?id=1&signature=a%2Bb";
    render(<FileDocxPreviewViewer url={url} fileName="Contrato.docx" />);
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    expect(fetch).toHaveBeenCalledWith(url, {
      signal: expect.any(AbortSignal),
    });
    expect(renderAsync).toHaveBeenCalledOnce();
    expect(vi.mocked(renderAsync).mock.calls[0][0]).toMatchObject({
      name: "Contrato.docx",
    });
  });

  it.each(["doc", "odt"])(
    "converts %s before rendering and downloads the original",
    async (extension) => {
      const file = localFile(`Contrato.${extension}`);
      const converted = new Blob(["converted docx"], { type: DOCX });
      const convertToDocx = vi.fn().mockResolvedValue(converted);
      const onDownload = vi.fn();
      render(
        <FileDocxPreviewViewer
          file={file}
          convertToDocx={convertToDocx}
          onDownload={onDownload}
        />,
      );
      await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
      expect(convertToDocx).toHaveBeenCalledWith(file, {
        signal: expect.any(AbortSignal),
      });
      expect(vi.mocked(renderAsync).mock.calls[0][0]).toBe(converted);
      fireEvent.click(
        screen.getByRole("button", { name: "Descargar documento" }),
      );
      expect(onDownload).toHaveBeenCalledOnce();
    },
  );

  it("shows an actionable error if conversion is unavailable", async () => {
    render(<FileDocxPreviewViewer file={localFile("Contrato.odt")} />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo abrir el documento",
    );
    expect(renderAsync).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Descargar original" }),
    ).toBeEnabled();
  });

  it("supplies an extension to the converter for a MIME-only remote document", async () => {
    const convertToDocx = vi
      .fn()
      .mockResolvedValue(new Blob(["converted docx"]));
    render(
      <FileDocxPreviewViewer
        url="https://files.example.com/download?id=1"
        fileName="Contrato"
        mimeType="application/msword"
        convertToDocx={convertToDocx}
      />,
    );
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    expect(convertToDocx.mock.calls[0][0].name).toBe("Contrato.doc");
  });

  it("keeps the current preview when only a callback identity changes", async () => {
    const file = localFile("Contrato.doc");
    const converter = vi.fn().mockResolvedValue(new Blob(["converted docx"]));
    const { rerender } = render(
      <FileDocxPreviewViewer file={file} convertToDocx={converter} />,
    );
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    const nextConverter = vi.fn();
    rerender(
      <FileDocxPreviewViewer file={file} convertToDocx={nextConverter} />,
    );
    expect(screen.queryByRole("status")).toBeNull();
    expect(nextConverter).not.toHaveBeenCalled();
    expect(renderAsync).toHaveBeenCalledOnce();
  });

  it.each([403, 404, 500])(
    "handles HTTP %s before attempting to parse and can retry",
    async (status) => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response("error", { status }));
      const onError = vi.fn();
      render(
        <FileDocxPreviewViewer
          url="https://files.example.com/file.docx"
          onError={onError}
        />,
      );
      await screen.findByRole("alert");
      expect(renderAsync).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledOnce();
      fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
      await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
      await waitFor(() => expect(renderAsync).toHaveBeenCalledOnce());
    },
  );

  it("ends the loader on a corrupt document and preserves a custom overlay", async () => {
    vi.mocked(renderAsync).mockRejectedValueOnce(new Error("Invalid ZIP"));
    const onLoadingChange = vi.fn();
    render(
      <FileDocxPreviewViewer
        file={localFile()}
        loadingOverlay={<span>Preparando documento</span>}
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(screen.getByText("Preparando documento")).toBeInTheDocument();
    await screen.findByRole("alert");
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByText("Preparando documento")).toBeNull();
  });

  it("aborts the old URL and ignores its late response after a source change", async () => {
    let resolveOld!: (response: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    const { rerender, container } = render(
      <FileDocxPreviewViewer url="https://files.example.com/old.docx" />,
    );
    const signal = vi.mocked(fetch).mock.calls[0][1]?.signal;
    rerender(<FileDocxPreviewViewer file={localFile("Nuevo.docx")} />);
    await waitFor(() =>
      expect(previewText(container)).toContain("Contrato de prueba"),
    );
    expect(signal?.aborted).toBe(true);
    await act(async () => resolveOld(new Response("old bytes")));
    expect(renderAsync).toHaveBeenCalledOnce();
  });

  it("prevents an old renderer from replacing the new document", async () => {
    let finishOld!: () => void;
    vi.mocked(renderAsync).mockImplementationOnce(async (_blob, target) => {
      await new Promise<void>((resolve) => {
        finishOld = resolve;
      });
      target.textContent = "Documento anterior";
    });
    const { rerender, container } = render(
      <FileDocxPreviewViewer file={localFile("Anterior.docx")} />,
    );
    rerender(<FileDocxPreviewViewer file={localFile("Nuevo.docx")} />);
    await waitFor(() =>
      expect(previewText(container)).toContain("Contrato de prueba"),
    );
    await act(async () => finishOld());
    expect(previewText(container)).not.toContain("Documento anterior");
  });

  it("cancels a conversion and clears loading when closed", async () => {
    const convertToDocx = vi.fn<FileWordDocumentConverter>(
      () => new Promise<Blob>(() => {}),
    );
    const onLoadingChange = vi.fn();
    const { unmount } = render(
      <FileDocxPreviewViewer
        file={localFile("Contrato.doc")}
        convertToDocx={convertToDocx}
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(convertToDocx).toHaveBeenCalledOnce();
    const options = convertToDocx.mock.calls[0];
    expect(options[1].signal.aborted).toBe(false);
    unmount();
    expect(options[1].signal.aborted).toBe(true);
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    expect(renderAsync).not.toHaveBeenCalled();
  });

  it("isolates document styles and strips active hyperlink schemes", async () => {
    vi.mocked(renderAsync).mockImplementationOnce(async (_blob, target) => {
      target.innerHTML =
        '<style data-document-style>body { display: none; }</style><a href="javascript:alert(1)">Unsafe</a><a href="https://example.com">Safe</a>';
    });
    const { container } = render(<FileDocxPreviewViewer file={localFile()} />);
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    const root = container.querySelector("[data-document-preview]")?.shadowRoot;
    expect(container.querySelector("[data-document-style]")).toBeNull();
    expect(root?.querySelector("[data-document-style]")).toHaveTextContent(
      "body { display: none; }",
    );
    expect(root?.querySelector("a")?.hasAttribute("href")).toBe(false);
    expect(root?.querySelectorAll("a")[1].getAttribute("rel")).toContain(
      "noopener",
    );
  });

  it("renders correctly under StrictMode", async () => {
    const { container } = render(
      <StrictMode>
        <FileDocxPreviewViewer file={localFile()} />
      </StrictMode>,
    );
    await waitFor(() =>
      expect(previewText(container)).toContain("Contrato de prueba"),
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("navigates footnotes inside the isolated document without changing the application URL", async () => {
    vi.mocked(renderAsync).mockImplementationOnce(async (_blob, target) => {
      target.innerHTML =
        '<a href="#footnote-1">Nota</a><p id="footnote-1">Texto de la nota</p>';
    });
    const { container } = render(<FileDocxPreviewViewer file={localFile()} />);
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    const root = container.querySelector("[data-document-preview]")?.shadowRoot;
    const note = root?.querySelector<HTMLElement>("#footnote-1");
    const link = root?.querySelector("a");
    if (!note || !link) throw new Error("Missing footnote fixture");
    note.scrollIntoView = vi.fn();
    const hash = window.location.hash;
    fireEvent.click(link);
    expect(note.scrollIntoView).toHaveBeenCalledWith({ block: "start" });
    expect(window.location.hash).toBe(hash);
  });
});

describe("Word format routing", () => {
  it.each([
    ["Contrato.DOCX", undefined, "docx"],
    ["Contrato.odt", "application/octet-stream", "odt"],
    ["Sin extensión", "application/msword; charset=binary", "doc"],
    ["Sin extensión", "application/vnd.oasis.opendocument.text", "odt"],
    ["Libro.xlsx", "application/vnd.ms-excel", null],
  ])("resolves %s with MIME %s", (name, mime, expected) => {
    expect(resolveWordDocumentFormat(name, mime)).toBe(expected);
  });
});
