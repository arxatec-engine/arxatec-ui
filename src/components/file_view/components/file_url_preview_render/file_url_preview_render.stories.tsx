import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileUrlPreviewRender } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_PDF =
  "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf";
const SAMPLE_IMAGE = "https://picsum.photos/seed/arxatec-url-preview/800/600";

const meta = {
  title: "FileView/UrlPreviewRender",
  component: FileUrlPreviewRender,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Orquestador que enruta una URL remota al visor según la extensión del archivo.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    url: SAMPLE_PDF,
    fileName: "ejemplo.pdf",
  },
} satisfies Meta<typeof FileUrlPreviewRender>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pdf: Story = {
  args: {
    url: SAMPLE_PDF,
    fileName: "tabla-ejemplo.pdf",
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
};

export const Imagen: Story = {
  args: {
    url: SAMPLE_IMAGE,
    fileName: "foto.jpg",
  },
  decorators: [
    (Story) => (
      <div className="h-[480px] w-full">
        <Story />
      </div>
    ),
  ],
};

export const Desconocido: Story = {
  args: {
    url: "https://example.com/archivo.bin",
    fileName: "archivo.bin",
  },
  decorators: [
    (Story) => (
      <div className="h-80 w-full">
        <Story />
      </div>
    ),
  ],
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    url: SAMPLE_PDF,
    fileName: "ejemplo.pdf",
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FilePreviewPlayground
      defaultUrl={SAMPLE_PDF}
      hint="Pega la URL de un archivo (PDF, imagen, Office…) o sube uno local; se enruta por extensión."
    >
      {({ url, fileName }) => (
        <FileUrlPreviewRender url={url} fileName={fileName} />
      )}
    </FilePreviewPlayground>
  ),
};
