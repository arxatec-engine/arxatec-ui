import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileViewLoadingState } from "./index";

const meta = {
  title: "FileView/LoadingState",
  component: FileViewLoadingState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Indicador de carga compartido para visores de archivos.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileViewLoadingState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
