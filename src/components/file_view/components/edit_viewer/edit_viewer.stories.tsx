import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileEditViewer } from "./index";

const meta = {
  title: "FileView/EditViewer",
  component: FileEditViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Shell de estados para el editor de documentos.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isPending: { control: "boolean" },
    isError: { control: "boolean" },
    isUnsupported: { control: "boolean" },
    isEmpty: { control: "boolean" },
    onRetry: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-80 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileEditViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contenido: Story = {
  args: {
    children: (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Área de edición (children)
      </div>
    ),
  },
};

export const Cargando: Story = {
  args: { isPending: true },
};

export const Error: Story = {
  args: { isError: true, onRetry: () => {} },
};

export const NoSoportado: Story = {
  args: { isError: true, isUnsupported: true, onRetry: () => {} },
};

export const Vacio: Story = {
  args: { isEmpty: true },
};
