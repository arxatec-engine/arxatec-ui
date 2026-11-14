import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileOfficeViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_DOC = "https://calibre-ebook.com/downloads/demos/demo.docx";

const meta = {
  title: "FileView/OfficeViewer",
  component: FileOfficeViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Word, Excel y PowerPoint usan sus visores propios. Word antiguo sin conversor usa el servicio externo con una URL pública.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isPending: { control: "boolean" },
    isError: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileOfficeViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Docx: Story = {
  args: {
    url: SAMPLE_DOC,
    fileName: "ejemplo.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
};

export const Pptx: Story = {
  args: {
    url: new URL(
      "../pptx_preview_viewer/fixtures/presentation.pptx",
      import.meta.url,
    ).href,
    fileName: "Presentación.pptx",
  },
};

export const Ppt: Story = {
  args: {
    url: new URL(
      "../pptx_preview_viewer/fixtures/presentation.ppt",
      import.meta.url,
    ).href,
    fileName: "Presentación.ppt",
  },
};

export const Cargando: Story = {
  args: {
    url: SAMPLE_DOC,
    fileName: "ejemplo.docx",
    isPending: true,
  },
};

export const Error: Story = {
  args: {
    url: SAMPLE_DOC,
    fileName: "ejemplo.docx",
    isError: true,
  },
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FilePreviewPlayground
      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx"
      defaultUrl={SAMPLE_DOC}
      hint="DOCX, Excel y PowerPoint se leen en el navegador. Las URL deben permitir CORS; Word antiguo sin conversor requiere una URL pública."
    >
      {({ url, fileName, mimeType }) => (
        <FileOfficeViewer
          url={url}
          fileName={fileName}
          mimeType={mimeType}
          onDownload={() => {}}
        />
      )}
    </FilePreviewPlayground>
  ),
};
