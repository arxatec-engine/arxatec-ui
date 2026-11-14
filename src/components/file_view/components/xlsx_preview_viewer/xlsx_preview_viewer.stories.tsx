import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import { Textarea } from "@/components/text_area";

import { FileXlsxPreviewViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE = new URL("./fixtures/budget.xlsx", import.meta.url).href;
const LEGACY = new URL("./fixtures/budget.xls", import.meta.url).href;
const LARGE = new URL("./fixtures/large.xlsx", import.meta.url).href;
const EMPTY = new URL("./fixtures/empty.xlsx", import.meta.url).href;
const DEFAULT_FILE = new File([], "Presupuesto.xlsx");

const meta = {
  title: "FileView/XlsxPreviewViewer",
  component: FileXlsxPreviewViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Un único visor Excel para File y URL, con formato de celdas y conversión XLS proporcionada por el consumidor.",
      },
    },
  },
  tags: ["autodocs"],
  args: { file: DEFAULT_FILE },
  decorators: [
    (Story) => (
      <div className="h-screen w-full overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileXlsxPreviewViewer>;
export default meta;
type Story = StoryObj<typeof meta>;

function LocalFile({ url = SAMPLE }: { url?: string }) {
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(url, { signal: controller.signal })
      .then((response) => response.blob())
      .then((blob) => {
        if (!controller.signal.aborted)
          setFile(new File([blob], "Presupuesto.xlsx", { type: blob.type }));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [url]);
  return file ? <FileXlsxPreviewViewer file={file} /> : null;
}

export const Default: Story = { render: () => <LocalFile /> };
export const Url: Story = {
  args: { file: undefined, url: SAMPLE, fileName: "Presupuesto.xlsx" },
};
export const MismaFuente: Story = {
  render: () => (
    <div className="grid h-full grid-cols-1 md:grid-cols-2">
      <LocalFile />
      <FileXlsxPreviewViewer url={SAMPLE} fileName="Presupuesto.xlsx" />
    </div>
  ),
};
export const Xls: Story = {
  args: { file: undefined, url: LEGACY, fileName: "Presupuesto.xls" },
};
export const XlsConConversor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Conversor simulado con el fixture XLSX equivalente. La conversión real con LibreOffice se verifica en el servicio.",
      },
    },
  },
  args: {
    file: undefined,
    url: LEGACY,
    fileName: "Presupuesto.xls",
    convertToXlsx: async (_file, { signal }) =>
      (await fetch(SAMPLE, { signal })).blob(),
  },
};
export const Grande: Story = {
  args: { file: undefined, url: LARGE, fileName: "Datos.xlsx" },
};
export const Vacia: Story = {
  args: { file: undefined, url: EMPTY, fileName: "Libro-vacio.xlsx" },
};
export const CopiarYPegar: Story = {
  render: () => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <LocalFile />
      </div>
      <div className="shrink-0 border-t border-border bg-background p-3">
        <Textarea
          aria-label="Pegar celdas copiadas"
          placeholder="Selecciona celdas del visor, cópialas y pega aquí."
          className="h-24 resize-none"
        />
      </div>
    </div>
  ),
};
export const Loading: Story = { args: { file: DEFAULT_FILE, isPending: true } };
export const InvalidDocument: Story = {
  args: { file: new File(["invalid zip"], "Libro.xlsx") },
};
export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FilePreviewPlayground
      accept=".xlsx,.xls"
      defaultUrl={SAMPLE}
      hint="Abre un Excel local o una URL accesible desde el navegador (CORS)."
    >
      {({ file, url, fileName }) =>
        file ? (
          <FileXlsxPreviewViewer file={file} />
        ) : (
          <FileXlsxPreviewViewer url={url} fileName={fileName} />
        )
      }
    </FilePreviewPlayground>
  ),
};
