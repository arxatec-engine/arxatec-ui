import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileSourceViewer } from "./index";

const SAMPLE_CODE = `function greet(name: string) {
  return \`Hola, \${name}!\`;
}

console.log(greet("Arxatec"));`;

const meta = {
  title: "FileView/SourceViewer",
  component: FileSourceViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Visor de código fuente con resaltado de sintaxis.",
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
      <div className="h-96 w-full">
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
    fileName: "ejemplo.ts",
  },
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
