import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import { FilePptxPreviewViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const PPTX = new URL("./fixtures/presentation.pptx", import.meta.url).href;
const PPT = new URL("./fixtures/presentation.ppt", import.meta.url).href;
const FOUR_BY_THREE = new URL(
  "./fixtures/presentation-4x3.pptx",
  import.meta.url,
).href;

const meta = {
  title: "FileView/PptxPreviewViewer",
  component: FilePptxPreviewViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visor local de PPTX y PPT, con miniaturas cerradas por defecto y apertura/cierre con transición, navegación, zoom y modo presentación. Los archivos se leen en el navegador; las URL deben permitir CORS.",
      },
    },
  },
  tags: ["autodocs"],
  args: { url: PPTX, fileName: "Presentación.pptx" },
  decorators: [
    (Story) => (
      <div className="h-screen w-full overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilePptxPreviewViewer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LegacyPpt: Story = {
  args: { url: PPT, fileName: "Presentación.ppt" },
};
export const FourByThree: Story = {
  args: { url: FOUR_BY_THREE, fileName: "Presentación 4x3.pptx" },
};
export const EmbeddedPreview: Story = {
  render: () => (
    <div className="flex h-full items-center justify-center p-4">
      <div className="h-[480px] w-full max-w-3xl overflow-hidden rounded-md border border-border">
        <FilePptxPreviewViewer url={PPTX} fileName="Presentación.pptx" />
      </div>
    </div>
  ),
};
export const Loading: Story = { args: { isPending: true } };
export const InvalidPresentation: Story = {
  render: () => (
    <FilePptxPreviewViewer file={new File(["invalid"], "Presentación.pptx")} />
  ),
};

function LocalFile() {
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(PPTX, { signal: controller.signal })
      .then((response) => response.blob())
      .then((blob) => {
        if (!controller.signal.aborted)
          setFile(new File([blob], "Presentación.pptx"));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return file ? <FilePptxPreviewViewer file={file} /> : null;
}

export const LocalUpload: Story = { render: () => <LocalFile /> };
export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FilePreviewPlayground
      accept=".pptx,.ppt"
      hint="Abre una presentación local o una URL accesible desde el navegador (CORS)."
    >
      {({ file, url, fileName }) =>
        file ? (
          <FilePptxPreviewViewer file={file} />
        ) : (
          <FilePptxPreviewViewer url={url} fileName={fileName} />
        )
      }
    </FilePreviewPlayground>
  ),
};
