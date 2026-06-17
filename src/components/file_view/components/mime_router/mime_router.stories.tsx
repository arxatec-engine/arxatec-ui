import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileMimeRouter } from "./index";

const meta = {
  title: "FileView/MimeRouter",
  component: FileMimeRouter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Router por tipo MIME que delega el renderizado a slots según el tipo de archivo.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mimeType: { control: "text" },
    fileName: { control: "text" },
  },
} satisfies Meta<typeof FileMimeRouter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pdf: Story = {
  args: {
    mimeType: "application/pdf",
    fileName: "documento.pdf",
    renderPdf: (
      <div className="rounded-md border border-border bg-muted px-4 py-2 text-sm">
        Slot PDF
      </div>
    ),
  },
};

export const Imagen: Story = {
  args: {
    mimeType: "image/png",
    fileName: "foto.png",
    renderImage: (
      <div className="rounded-md border border-border bg-muted px-4 py-2 text-sm">
        Slot Imagen
      </div>
    ),
  },
};

export const Desconocido: Story = {
  args: {
    mimeType: "application/octet-stream",
    fileName: "archivo.bin",
    renderUnknown: (
      <div className="rounded-md border border-border bg-muted px-4 py-2 text-sm">
        Slot Desconocido
      </div>
    ),
  },
};
