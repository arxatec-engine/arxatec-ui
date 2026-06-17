import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileBlobOfficeUnavailable } from "./index";

const meta = {
  title: "FileView/BlobOfficeUnavailable",
  component: FileBlobOfficeUnavailable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Fallback cuando un documento Office local no puede previsualizarse (requiere URL pública).",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-80 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileBlobOfficeUnavailable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "blob:http://localhost/fake-blob-id",
    fileName: "informe.docx",
  },
};
