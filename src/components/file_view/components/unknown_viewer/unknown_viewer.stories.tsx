import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileUnknownViewer } from "./index";

const meta = {
  title: "FileView/UnknownViewer",
  component: FileUnknownViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Vista para tipos de archivo sin previsualización disponible.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isPending: { control: "boolean" },
    isError: { control: "boolean" },
    onDownload: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-80 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUnknownViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: "archivo-desconocido.bin",
    onDownload: () => {},
  },
};

export const Cargando: Story = {
  args: {
    fileName: "archivo-desconocido.bin",
    isPending: true,
  },
};

export const Error: Story = {
  args: {
    fileName: "archivo-desconocido.bin",
    isError: true,
  },
};
