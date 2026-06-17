import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileViewErrorState } from "./index";

const meta = {
  title: "FileView/ErrorState",
  component: FileViewErrorState,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Estado de error compartido para visores de archivos.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-64 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileViewErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
