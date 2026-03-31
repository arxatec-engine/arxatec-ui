import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toaster } from "@/components/sonner";
import { classNameControl } from "@/utilities/storybook";
import { RichTextEditor } from "./index";

type RichTextEditorStoryArgs = {
  className?: string;
  fileId?: string;
  simulateSaveDelayMs?: number;
};

const meta = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        height: "640px",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    fileId: { control: "text", description: "Identificador opaco (ref)" },
    simulateSaveDelayMs: {
      control: "number",
      description: "Solo en “Con guardado simulado”: retardo antes del resolve",
    },
  },
  decorators: [
    (Story) => (
      <>
        <div className="h-[85vh] w-full max-w-6xl mx-auto overflow-hidden rounded-lg border shadow-sm">
          <Story />
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </>
    ),
  ],
} satisfies Meta<RichTextEditorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileId: undefined,
  },
  render: ({ className, fileId }) => (
    <RichTextEditor className={className} fileId={fileId} />
  ),
};

export const ConGuardadoSimulado: Story = {
  args: {
    fileId: "story-doc-1",
    simulateSaveDelayMs: 600,
  },
  render: ({ className, fileId, simulateSaveDelayMs }) => (
    <RichTextEditor
      className={className}
      fileId={fileId}
      onSave={async () => {
        await new Promise((r) =>
          setTimeout(r, simulateSaveDelayMs ?? 500)
        );
      }}
    />
  ),
};
