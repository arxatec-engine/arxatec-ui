import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";

import { FileSimplePreviewRender } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const DEFAULT_FILE = new File([], "ejemplo.txt", { type: "text/plain" });

const meta = {
  title: "FileView/SimplePreviewRender",
  component: FileSimplePreviewRender,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Orquestador que enruta un archivo local (File + blob URL) al visor adecuado.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    file: DEFAULT_FILE,
    url: "",
  },
} satisfies Meta<typeof FileSimplePreviewRender>;

export default meta;

type Story = StoryObj<typeof meta>;

function RenderWithFile({
  file,
}: {
  file: File;
}) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  return (
    <div className="h-[480px] w-full">
      <FileSimplePreviewRender file={file} url={url} />
    </div>
  );
}

function createPreviewPngFile() {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 120;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(0, 0, 200, 120);
  ctx.fillStyle = "#fff";
  ctx.font = "16px sans-serif";
  ctx.fillText("Preview", 60, 65);
  const dataUrl = canvas.toDataURL("image/png");
  const bin = atob(dataUrl.split(",")[1]!);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new File([arr], "preview.png", { type: "image/png" });
}

function ImagePreviewDemo() {
  const file = useMemo(() => createPreviewPngFile(), []);
  return <RenderWithFile file={file} />;
}

export const Codigo: Story = {
  render: () => (
    <RenderWithFile
      file={
        new File(['console.log("hola");'], "script.js", {
          type: "application/javascript",
        })
      }
    />
  ),
};

export const Imagen: Story = {
  render: () => <ImagePreviewDemo />,
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FilePreviewPlayground
      requireFile
      hint="Sube cualquier archivo local o pega una URL accesible (CORS). Se enruta automáticamente al visor adecuado."
    >
      {({ file, url }) =>
        file ? <FileSimplePreviewRender file={file} url={url} /> : null
      }
    </FilePreviewPlayground>
  ),
};
