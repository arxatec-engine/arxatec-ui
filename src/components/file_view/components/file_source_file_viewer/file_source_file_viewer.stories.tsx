import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";

import { FileSourceFileViewer } from "./index";
import { FilePreviewPlayground } from "../file_preview_playground";

const DEFAULT_FILE = new File(["export {}"], "ejemplo.ts", {
  type: "text/typescript",
});

const meta = {
  title: "FileView/SourceFileViewer",
  component: FileSourceFileViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Lee un archivo local como texto y lo muestra con FileSourceViewer.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    file: DEFAULT_FILE,
  },
  decorators: [
    (Story) => (
      <div className="h-96 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileSourceFileViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

function WithFile({ content, name }: { content: string; name: string }) {
  const file = useMemo(
    () => new File([content], name, { type: "text/typescript" }),
    [content, name],
  );
  return <FileSourceFileViewer file={file} />;
}

export const TypeScript: Story = {
  render: () => (
    <WithFile
      name="ejemplo.ts"
      content={`export function sum(a: number, b: number) {
  return a + b;
}`}
    />
  ),
};

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FilePreviewPlayground
      accept=".ts,.tsx,.js,.jsx,.json,.py,.java,.css,.html,.md,.txt,.yml,.yaml,.sql,.sh"
      requireFile
      hint="Sube un archivo de código/texto local o pega la URL de un archivo accesible (CORS)."
    >
      {({ file }) => (file ? <FileSourceFileViewer file={file} /> : null)}
    </FilePreviewPlayground>
  ),
};
