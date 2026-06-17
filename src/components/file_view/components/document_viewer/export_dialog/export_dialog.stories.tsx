import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FileDocumentExportDialog } from "./index";

const meta = {
  title: "FileView/DocumentExportDialog",
  component: FileDocumentExportDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Diálogo para exportar un documento a PDF o Word.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: () => {},
    exportType: "pdf",
    exportName: "documento-exportado",
    onExportNameChange: () => {},
    onConfirm: () => {},
  },
  argTypes: {
    exportType: { control: "select", options: ["pdf", "word"] },
    onConfirm: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    onExportNameChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FileDocumentExportDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function StatefulDialog(
  props: Omit<
    React.ComponentProps<typeof FileDocumentExportDialog>,
    "open" | "onOpenChange" | "exportName" | "onExportNameChange"
  > & { initialName?: string },
) {
  const [open, setOpen] = useState(true);
  const [exportName, setExportName] = useState(
    props.initialName ?? "documento-exportado",
  );

  return (
    <FileDocumentExportDialog
      {...props}
      open={open}
      onOpenChange={setOpen}
      exportName={exportName}
      onExportNameChange={setExportName}
    />
  );
}

export const Pdf: Story = {
  render: (args) => (
    <StatefulDialog
      {...args}
      exportType="pdf"
      onConfirm={() => {}}
      initialName="informe-mensual"
    />
  ),
};

export const Word: Story = {
  render: (args) => (
    <StatefulDialog
      {...args}
      exportType="word"
      onConfirm={() => {}}
      initialName="borrador-contrato"
    />
  ),
};
