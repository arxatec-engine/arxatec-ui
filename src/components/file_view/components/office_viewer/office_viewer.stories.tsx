import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileOfficeViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_DOC =
  "https://file-examples.com/storage/fe52cb0c5964eab1971/2017/10/file_example_DOCX_10.docx";

const meta = {
  title: "FileView/OfficeViewer",
  component: FileOfficeViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visor de documentos Office (Word, Excel, PowerPoint) vía servicio externo. Requiere URL pública accesible.",
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
      hint="El visor de Office usa un servicio externo: usa una URL PÚBLICA (los archivos locales/blob no se renderizan)."
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
