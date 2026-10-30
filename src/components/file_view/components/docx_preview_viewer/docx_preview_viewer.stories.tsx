import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import { FileDocxPreviewViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_DOCX = new URL("./fixtures/contract.docx", import.meta.url).href;

const DEFAULT_FILE = new File([], "ejemplo.docx", {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});

const meta = {
  title: "FileView/DocxPreviewViewer",
  component: FileDocxPreviewViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visor Word propio para archivos locales y URL. DOC/ODT requieren convertToDocx del consumidor.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    file: DEFAULT_FILE,
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileDocxPreviewViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

function WithDocxFile() {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(SAMPLE_DOCX)
      .then((res) => res.blob())
      .then((blob) => {
        if (!cancelled) {
          setFile(
            new File([blob], "ejemplo.docx", {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }),
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Cargando archivo de ejemplo…
      </div>
    );
  }

  return <FileDocxPreviewViewer file={file} />;
}

export const Default: Story = {
  render: () => <WithDocxFile />,
};

export const Url: Story = {
  args: { file: undefined, url: SAMPLE_DOCX, fileName: "Contrato.docx" },
};

export const Loading: Story = {
  args: { file: DEFAULT_FILE, isPending: true },
};

export const InvalidDocument: Story = {
  args: { file: new File(["invalid zip"], "Documento.docx") },
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    file: DEFAULT_FILE,
  },
  render: () => (
    <FilePreviewPlayground
      accept=".docx"
      hint="Abre un DOCX local o una URL accesible desde el navegador (CORS)."
    >
      {({ file, url, fileName }) =>
        file ? (
          <FileDocxPreviewViewer file={file} />
        ) : (
          <FileDocxPreviewViewer url={url} fileName={fileName} />
        )
      }
    </FilePreviewPlayground>
  ),
};
