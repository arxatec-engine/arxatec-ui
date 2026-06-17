import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import * as XLSX from "xlsx";

import { FileXlsxPreviewViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const DEFAULT_FILE = new File([], "inventario.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

const meta = {
  title: "FileView/XlsxPreviewViewer",
  component: FileXlsxPreviewViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Previsualización local de hojas de cálculo .xlsx.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    file: DEFAULT_FILE,
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileXlsxPreviewViewer>;

export default meta;

type Story = StoryObj<typeof FileXlsxPreviewViewer>;

function createSampleXlsxFile() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["Producto", "Cantidad", "Precio"],
    ["Widget A", 10, 25.5],
    ["Widget B", 5, 42],
    ["Widget C", 20, 12.75],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");
  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new File([buffer], "inventario.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function WithXlsxFile() {
  const file = useMemo(() => createSampleXlsxFile(), []);
  return <FileXlsxPreviewViewer file={file} />;
}

export const Default: Story = {
  render: () => <WithXlsxFile />,
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    file: DEFAULT_FILE,
  },
  render: () => (
    <FilePreviewPlayground
      accept=".xlsx,.xls"
      requireFile
      hint="Sube un .xlsx local o pega la URL de una hoja de cálculo accesible (CORS)."
    >
      {({ file }) => (file ? <FileXlsxPreviewViewer file={file} /> : null)}
    </FilePreviewPlayground>
  ),
};
