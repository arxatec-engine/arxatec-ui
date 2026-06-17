import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FileSimplePreviewSheet } from "./index";

const meta = {
  title: "FileView/SimplePreviewSheet",
  component: FileSimplePreviewSheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Sheet que previsualiza un archivo local seleccionado.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: () => {},
    file: null,
  },
  argTypes: {
    onOpenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FileSimplePreviewSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

function SheetDemo() {
  const [open, setOpen] = useState(true);
  const file = new File(
    ['{"hola": "mundo"}'],
    "datos.json",
    { type: "application/json" },
  );

  return (
    <>
      <button
        type="button"
        className="m-4 rounded-md border border-border px-3 py-1.5 text-sm"
        onClick={() => setOpen(true)}
      >
        Abrir sheet
      </button>
      <FileSimplePreviewSheet
        open={open}
        onOpenChange={setOpen}
        file={file}
      />
    </>
  );
}

export const Json: Story = {
  render: () => <SheetDemo />,
};

function PlaygroundDemo() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-3 p-4">
      <label className="text-sm font-medium">Selecciona un archivo local</label>
      <input
        type="file"
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          setFile(selected);
          if (selected) setOpen(true);
        }}
        className="block w-full max-w-md text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
      />
      <p className="text-xs text-muted-foreground">
        El sheet se abre automáticamente al elegir un archivo.
      </p>
      <FileSimplePreviewSheet open={open} onOpenChange={setOpen} file={file} />
    </div>
  );
}

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PlaygroundDemo />,
};
