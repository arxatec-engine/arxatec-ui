import { StrictMode } from "react";
import { File as NodeFile, Blob as NodeBlob } from "node:buffer";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { FileXlsxPreviewViewer } from "./index";
import { FileSimplePreviewRender } from "../file_simple_preview_render";
import { FileUrlPreviewRender } from "../file_url_preview_render";
import { FileOfficeViewer } from "../office_viewer";
import { FilePublicPreviewRender } from "../file_public_preview_render";
import { readWorkbook } from "./utilities/read_workbook";
import type { SpreadsheetSheet, SpreadsheetWorkbook } from "./types";
import type { SpreadsheetGridProps } from "./components/spreadsheet_grid";

vi.mock("./utilities/read_workbook", () => ({ readWorkbook: vi.fn() }));
vi.mock("./components/spreadsheet_grid", () => ({
  SpreadsheetGrid: ({ sheet, onSelectionChange }: SpreadsheetGridProps) => (
    <div data-testid="sheet-grid">
      {sheet.name}: {sheet.cells["0:0"]?.text}
      <button
        type="button"
        onClick={() =>
          onSelectionChange({
            anchor: { row: 0, column: 0 },
            focus: { row: 0, column: 0 },
          })
        }
      >
        Seleccionar A1
      </button>
    </div>
  ),
}));
const MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const bytes = new Uint8Array([80, 75, 3, 4, 1, 2, 3]);
const sourceUrl =
  "https://files.example.com/download?signature=a%2Bb&name=Libro.xlsx";
const sheet: SpreadsheetSheet = {
  name: "Datos",
  cells: { "0:0": { text: "Contenido", style: {} } },
  rowCount: 1,
  columnCount: 1,
  rows: {},
  columns: {},
  merges: [],
  defaultRowHeight: 20,
  defaultColumnWidth: 96,
};
const book: SpreadsheetWorkbook = {
  basic: false,
  sheets: [sheet, { ...sheet, name: "Segunda" }],
};
const sourceFile = (name = "Libro.xlsx", type = MIME) =>
  new File([bytes], name, { type, lastModified: 1 });
const originalFile = globalThis.File;
const originalBlob = globalThis.Blob;
beforeAll(() => {
  vi.stubGlobal("File", NodeFile);
  vi.stubGlobal("Blob", NodeBlob);
});
afterAll(() => {
  vi.stubGlobal("File", originalFile);
  vi.stubGlobal("Blob", originalBlob);
});
beforeEach(() => {
  vi.mocked(readWorkbook).mockReset().mockResolvedValue(book);
  vi.spyOn(globalThis, "fetch")
    .mockReset()
    .mockResolvedValue(
      new Response(bytes, { headers: { "Content-Type": MIME } }),
    );
});

describe("one Excel viewer for every source", () => {
  it.each([
    "file",
    "url",
    "local adapter",
    "url adapter",
    "office adapter",
    "public blob",
  ])("uses the same model for %s", async (source) => {
    const file = sourceFile();
    const { container } = render(
      source === "file" ? (
        <FileXlsxPreviewViewer file={file} />
      ) : source === "url" ? (
        <FileXlsxPreviewViewer url={sourceUrl} fileName="Libro.xlsx" />
      ) : source === "local adapter" ? (
        <FileSimplePreviewRender file={file} url="blob:local-file" />
      ) : source === "url adapter" ? (
        <FileUrlPreviewRender url={sourceUrl} fileName="Libro.xlsx" />
      ) : source === "office adapter" ? (
        <FileOfficeViewer url={sourceUrl} fileName="Libro.xlsx" />
      ) : (
        <FilePublicPreviewRender
          fileName="Libro.xlsx"
          objectUrl="blob:authorized"
          signedUrl={sourceUrl}
        />
      ),
    );
    await waitFor(() =>
      expect(screen.getByTestId("sheet-grid")).toHaveTextContent(
        "Datos: Contenido",
      ),
    );
    expect(
      container.querySelectorAll("[data-spreadsheet-preview]"),
    ).toHaveLength(1);
    expect(container.querySelector("iframe")).toBeNull();
    expect(new Uint8Array(vi.mocked(readWorkbook).mock.calls[0][0])).toEqual(
      bytes,
    );
    expect(vi.mocked(readWorkbook).mock.calls[0][1]).toBe("xlsx");
    if (source === "file" || source === "local adapter")
      expect(fetch).not.toHaveBeenCalled();
    else
      expect(fetch).toHaveBeenCalledWith(
        source === "public blob" ? "blob:authorized" : sourceUrl,
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
  });

  it.each(["", "application/octet-stream", "text/plain"])(
    "uses the same Excel routing for a local MIME %s",
    async (mimeType) => {
      render(
        <FileSimplePreviewRender
          file={sourceFile("Libro.xlsx", mimeType)}
          url="blob:local"
        />,
      );
      await screen.findByTestId("sheet-grid");
      expect(readWorkbook).toHaveBeenCalledOnce();
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("uses the same controls for source, sheet changes and zoom", async () => {
    const onDownload = vi.fn();
    render(
      <FileXlsxPreviewViewer
        url={sourceUrl}
        fileName="Libro.xlsx"
        onDownload={onDownload}
      />,
    );
    await screen.findByTestId("sheet-grid");
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Segunda" }), {
      button: 0,
      ctrlKey: false,
    });
    await waitFor(() =>
      expect(screen.getByTestId("sheet-grid")).toHaveTextContent("Segunda"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Aumentar zoom" }));
    expect(screen.getByText("120%")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Descargar original" }));
    expect(onDownload).toHaveBeenCalledOnce();
    expect(readWorkbook).toHaveBeenCalledOnce();
  });

  it.each(["file", "url"])(
    "converts XLS from %s and keeps the original download",
    async (source) => {
      const convertToXlsx = vi.fn().mockResolvedValue(new Blob([bytes]));
      const onDownload = vi.fn();
      render(
        source === "file" ? (
          <FileXlsxPreviewViewer
            file={sourceFile("Libro.xls", "application/vnd.ms-excel")}
            convertToXlsx={convertToXlsx}
            onDownload={onDownload}
          />
        ) : (
          <FileXlsxPreviewViewer
            url={sourceUrl}
            fileName="Libro.xls"
            convertToXlsx={convertToXlsx}
            onDownload={onDownload}
          />
        ),
      );
      await screen.findByTestId("sheet-grid");
      expect(convertToXlsx).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Libro.xls" }),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
      expect(vi.mocked(readWorkbook).mock.calls[0][1]).toBe("xlsx");
      fireEvent.click(
        screen.getByRole("button", { name: "Descargar original" }),
      );
      expect(onDownload).toHaveBeenCalledOnce();
    },
  );

  it("keeps XLS compatibility in the same viewer when no converter is supplied", async () => {
    vi.mocked(readWorkbook).mockResolvedValueOnce({ ...book, basic: true });
    render(
      <FileXlsxPreviewViewer
        file={sourceFile("Libro.xls", "application/vnd.ms-excel")}
      />,
    );
    await screen.findByTestId("sheet-grid");
    expect(vi.mocked(readWorkbook).mock.calls[0][1]).toBe("xls");
    expect(screen.getByText(/Vista básica/)).toBeInTheDocument();
  });

  it("retries a failed URL without changing its signature", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("denied", { status: 403 }),
    );
    const onLoadingChange = vi.fn();
    render(
      <FileXlsxPreviewViewer
        url={sourceUrl}
        fileName="Libro.xlsx"
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("HTTP 403");
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await screen.findByTestId("sheet-grid");
    expect(vi.mocked(fetch).mock.calls.map(([url]) => url)).toEqual([
      sourceUrl,
      sourceUrl,
    ]);
  });

  it("reports conversion failures without falling back to another renderer", async () => {
    const onError = vi.fn();
    const convertToXlsx = vi
      .fn()
      .mockRejectedValue(new Error("Conversión no disponible"));
    const { container } = render(
      <FileXlsxPreviewViewer
        file={sourceFile("Libro.xls")}
        convertToXlsx={convertToXlsx}
        onError={onError}
      />,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Conversión no disponible",
    );
    expect(readWorkbook).not.toHaveBeenCalled();
    expect(container.querySelector("iframe")).toBeNull();
    expect(onError).toHaveBeenCalledOnce();
  });

  it("aborts processing and clears parent loading when closed", async () => {
    vi.mocked(readWorkbook).mockImplementationOnce(
      async (_buffer, _format, signal) =>
        new Promise((_resolve, reject) =>
          signal.addEventListener(
            "abort",
            () => reject(new Error("cancelled")),
            { once: true },
          ),
        ),
    );
    const onLoadingChange = vi.fn();
    const onError = vi.fn();
    const { unmount } = render(
      <FileXlsxPreviewViewer
        file={sourceFile()}
        onLoadingChange={onLoadingChange}
        onError={onError}
      />,
    );
    await waitFor(() => expect(readWorkbook).toHaveBeenCalledOnce());
    const signal = vi.mocked(readWorkbook).mock.calls[0][2];
    unmount();
    expect(signal.aborted).toBe(true);
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    expect(onError).not.toHaveBeenCalled();
  });

  it("discards late results when two files have identical metadata", async () => {
    let complete!: (workbook: SpreadsheetWorkbook) => void;
    vi.mocked(readWorkbook).mockReturnValueOnce(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { rerender } = render(<FileXlsxPreviewViewer file={sourceFile()} />);
    await waitFor(() => expect(readWorkbook).toHaveBeenCalledOnce());
    rerender(<FileXlsxPreviewViewer file={sourceFile()} />);
    await screen.findByTestId("sheet-grid");
    await act(async () =>
      complete({ basic: false, sheets: [{ ...sheet, name: "Anterior" }] }),
    );
    expect(screen.getByTestId("sheet-grid")).toHaveTextContent("Datos");
    expect(readWorkbook).toHaveBeenCalledTimes(2);
  });

  it("renders the same grid for a worksheet with no populated cells", async () => {
    vi.mocked(readWorkbook).mockResolvedValueOnce({
      basic: false,
      sheets: [{ ...sheet, cells: {}, rowCount: 0, columnCount: 0 }],
    });
    render(<FileXlsxPreviewViewer file={sourceFile()} />);
    await screen.findByTestId("sheet-grid");
    expect(screen.getByRole("tab", { name: "Datos" })).toBeInTheDocument();
    expect(screen.queryByText("Hoja vacía")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("waits for parent pending and reports its error without fetching", async () => {
    const { rerender } = render(
      <FileXlsxPreviewViewer url={sourceUrl} isPending />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    rerender(<FileXlsxPreviewViewer url={sourceUrl} isError />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("copies the selection and clears it when changing sheets or source", async () => {
    const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    try {
      const { rerender } = render(
        <FileXlsxPreviewViewer file={sourceFile()} />,
      );
      await screen.findByTestId("sheet-grid");
      expect(
        screen.getByRole("button", { name: "Copiar selección" }),
      ).toBeDisabled();
      fireEvent.click(screen.getByRole("button", { name: "Seleccionar A1" }));
      fireEvent.click(screen.getByRole("button", { name: "Copiar selección" }));
      await waitFor(() => expect(writeText).toHaveBeenCalledWith("Contenido"));
      fireEvent.mouseDown(screen.getByRole("tab", { name: "Segunda" }), {
        button: 0,
        ctrlKey: false,
      });
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Copiar selección" }),
        ).toBeDisabled(),
      );
      fireEvent.click(screen.getByRole("button", { name: "Seleccionar A1" }));
      expect(
        screen.getByRole("button", { name: "Copiar selección" }),
      ).toBeEnabled();
      rerender(<FileXlsxPreviewViewer file={sourceFile("Nuevo.xlsx")} />);
      await screen.findByTestId("sheet-grid");
      expect(
        screen.getByRole("button", { name: "Copiar selección" }),
      ).toBeDisabled();
    } finally {
      if (original) Object.defineProperty(navigator, "clipboard", original);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  });

  it("settles in StrictMode with one visible viewer", async () => {
    const { container } = render(
      <StrictMode>
        <FileXlsxPreviewViewer file={sourceFile()} />
      </StrictMode>,
    );
    await screen.findByTestId("sheet-grid");
    expect(
      container.querySelectorAll("[data-spreadsheet-preview]"),
    ).toHaveLength(1);
    expect(screen.queryByRole("status")).toBeNull();
  });
});

it("forwards consumer copy and styling through the workbook workspace", async () => {
  const { container } = render(
    <FileXlsxPreviewViewer
      url={sourceUrl}
      className="consumer-preview"
      labels={{
        toolbar: "Workbook controls",
        copy: "Copy cells",
        download: "Download workbook",
        sheets: "Workbook sheets",
      }}
    />,
  );
  expect(
    await screen.findByRole("toolbar", { name: "Workbook controls" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copy cells" })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "Download workbook" }),
  ).toBeEnabled();
  expect(
    screen.getByRole("tablist", { name: "Workbook sheets" }),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-slot="file-xlsx-preview-viewer"]'),
  ).toHaveClass("consumer-preview");
});
