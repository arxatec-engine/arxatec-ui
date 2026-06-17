import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FileUrlPreviewSheet } from "./index";

const SAMPLE_PDF =
  "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf";

const meta = {
  title: "FileView/UrlPreviewSheet",
  component: FileUrlPreviewSheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Sheet que previsualiza un archivo remoto por URL.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: () => {},
    url: null,
  },
  argTypes: {
    isPending: { control: "boolean" },
    isError: { control: "boolean" },
    onOpenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FileUrlPreviewSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

function SheetDemo(
  props: Omit<
    React.ComponentProps<typeof FileUrlPreviewSheet>,
    "open" | "onOpenChange"
  >,
) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button
        type="button"
        className="m-4 rounded-md border border-border px-3 py-1.5 text-sm"
        onClick={() => setOpen(true)}
      >
        Abrir sheet
      </button>
      <FileUrlPreviewSheet
        {...props}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export const Pdf: Story = {
  render: () => (
    <SheetDemo url={SAMPLE_PDF} fileName="tabla-ejemplo.pdf" />
  ),
};

export const Cargando: Story = {
  render: () => (
    <SheetDemo
      url={SAMPLE_PDF}
      fileName="tabla-ejemplo.pdf"
      isPending
    />
  ),
};

export const Error: Story = {
  render: () => (
    <SheetDemo
      url={SAMPLE_PDF}
      fileName="tabla-ejemplo.pdf"
      isError
    />
  ),
};

function PlaygroundDemo() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(SAMPLE_PDF);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 p-4">
      <label className="text-sm font-medium">URL del archivo remoto</label>
      <form
        className="flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!url.trim()) return;
          setSubmittedUrl(url.trim());
          setOpen(true);
        }}
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://ejemplo.com/archivo.pdf"
          className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Mostrar
        </button>
      </form>
      <p className="text-xs text-muted-foreground">
        El sheet se abre con la URL introducida (debe ser accesible / CORS).
      </p>
      <FileUrlPreviewSheet
        open={open}
        onOpenChange={setOpen}
        url={submittedUrl}
      />
    </div>
  );
}

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PlaygroundDemo />,
};
