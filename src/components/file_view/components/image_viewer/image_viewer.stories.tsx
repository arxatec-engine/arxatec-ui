import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileImageViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_IMAGE = "https://picsum.photos/seed/arxatec-fileview/1200/800";

const meta = {
  title: "FileView/ImageViewer",
  component: FileImageViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visor de imágenes con zoom, arrastre y barra de herramientas.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    url: SAMPLE_IMAGE,
    mimeType: "image/jpeg",
    fileName: "foto-ejemplo.jpg",
    onDownload: () => {},
  },
  argTypes: {
    isPending: { control: "boolean" },
    isError: { control: "boolean" },
    onDownload: { table: { disable: true } },
  },
} satisfies Meta<typeof FileImageViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: SAMPLE_IMAGE,
    mimeType: "image/jpeg",
    fileName: "foto-ejemplo.jpg",
    fileId: "demo-image",
    onDownload: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-[480px] w-full">
        <Story />
      </div>
    ),
  ],
};

export const Cargando: Story = {
  args: {
    url: SAMPLE_IMAGE,
    mimeType: "image/jpeg",
    fileName: "foto-ejemplo.jpg",
    isPending: true,
  },
  decorators: [
    (Story) => (
      <div className="h-[480px] w-full">
        <Story />
      </div>
    ),
  ],
};

export const Error: Story = {
  args: {
    url: SAMPLE_IMAGE,
    mimeType: "image/jpeg",
    fileName: "foto-ejemplo.jpg",
    isError: true,
  },
  decorators: [
    (Story) => (
      <div className="h-[480px] w-full">
        <Story />
      </div>
    ),
  ],
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    url: SAMPLE_IMAGE,
    mimeType: "image/jpeg",
    fileName: "foto-ejemplo.jpg",
    onDownload: () => {},
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
      accept="image/*"
      defaultUrl={SAMPLE_IMAGE}
      hint="Sube una imagen local o pega la URL de una imagen."
    >
      {({ url, fileName, mimeType }) => (
        <FileImageViewer
          url={url}
          mimeType={mimeType}
          fileName={fileName}
          fileId={url}
          onDownload={() => {}}
        />
      )}
    </FilePreviewPlayground>
  ),
};
