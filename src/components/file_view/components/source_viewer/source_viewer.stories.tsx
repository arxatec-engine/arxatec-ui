import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileSourceViewer } from "./index";

const SAMPLE_CODE = `// Una vista previa para cada tipo de archivo.
type PreviewOptions = {
  fileName: string;
  mimeType: string;
  onDownload?: () => Promise<void>;
};

export async function openPreview(options: PreviewOptions) {
  const { fileName, mimeType } = options;
  const response = await fetch(\`/files/\${fileName}\`);

  if (!response.ok) {
    throw new Error("No se pudo abrir el archivo");
  }

  return {
    name: fileName,
    type: mimeType,
    content: await response.text(),
    ready: true,
  };
}

const preview = await openPreview({
  fileName: "documento.ts",
  mimeType: "text/typescript",
});

console.log(preview);`;

const meta = {
  title: "FileView/SourceViewer",
  component: FileSourceViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Código adaptado al tema, desplazamiento compartido y barra flotante para zoom, ajuste de líneas, copia y descarga.",
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
      <div className="h-[min(640px,100svh)] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileSourceViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TypeScript: Story = {
  args: {
    content: SAMPLE_CODE,
    mimeType: "text/typescript",
    fileName: "preview.ts",
  },
};

export const LineasLargas: Story = {
  args: {
    content: Array.from(
      { length: 80 },
      (_, index) =>
        `const archivo${index + 1} = ${JSON.stringify("Una línea extensa para comprobar el ajuste, el zoom y el desplazamiento horizontal del visor. ".repeat(4))};`,
    ).join("\n"),
    mimeType: "text/javascript",
    fileName: "lineas-largas.js",
  },
};

export const Vacio: Story = {
  args: { content: "", mimeType: "text/plain", fileName: "notas.txt" },
};

export const UnaLinea: Story = {
  args: {
    content: "export const ready = true;",
    mimeType: "text/typescript",
    fileName: "estado.ts",
  },
};

export const PanelEstrecho: Story = {
  args: TypeScript.args,
  render: (args) => (
    <div className="mx-auto h-full w-full max-w-[360px] border-x border-border">
      <FileSourceViewer {...args} />
    </div>
  ),
};

export const Cargando: Story = {
  args: {
    mimeType: "text/plain",
    fileName: "ejemplo.txt",
    isPending: true,
  },
};

export const Error: Story = {
  args: {
    mimeType: "text/plain",
    fileName: "ejemplo.txt",
    isError: true,
  },
};
