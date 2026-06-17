import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import { FileDocxPreviewViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const SAMPLE_DOCX =
  "https://file-examples.com/storage/fe52cb0c5964eab1971/2017/10/file_example_DOCX_10.docx";

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
        component: "Previsualización local de archivos .docx con docx-preview.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    file: DEFAULT_FILE,
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full overflow-auto">
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

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  args: {
    file: DEFAULT_FILE,
  },
  render: () => (
    <FilePreviewPlayground
      accept=".docx"
      requireFile
      hint="Sube un .docx local o pega la URL de un .docx accesible (CORS)."
    >
      {({ file }) => (file ? <FileDocxPreviewViewer file={file} /> : null)}
    </FilePreviewPlayground>
  ),
};
