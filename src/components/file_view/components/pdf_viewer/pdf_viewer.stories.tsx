import type { Meta, StoryObj } from "@storybook/react-vite";

import { FilePdfViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

// W3C test fixture: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
const SAMPLE_PDF = new URL("./fixtures/example.pdf", import.meta.url).href;

const meta = {
  title: "FileView/PdfViewer",
  component: FilePdfViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visor de PDF con paginación, zoom y descarga. Usa pdf.js vía react-pdf.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    url: SAMPLE_PDF,
    fileName: "ejemplo.pdf",
    onDownload: () => {},
  },
  argTypes: {
    onDownload: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilePdfViewer>;

export default meta;

type Story = StoryObj<typeof FilePdfViewer>;

export const Default: Story = {
  args: {
    url: SAMPLE_PDF,
    fileName: "ejemplo.pdf",
    onDownload: () => {},
  },
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    url: SAMPLE_PDF,
    fileName: "ejemplo.pdf",
    onDownload: () => {},
  },
  render: () => (
    <FilePreviewPlayground
      accept="application/pdf"
      defaultUrl={SAMPLE_PDF}
      hint="Sube un PDF local o pega la URL de un PDF accesible."
    >
      {({ url, fileName }) => (
        <FilePdfViewer url={url} fileName={fileName} onDownload={() => {}} />
      )}
    </FilePreviewPlayground>
  ),
};
