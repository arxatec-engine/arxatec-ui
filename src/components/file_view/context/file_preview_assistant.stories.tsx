import type { Meta, StoryObj } from "@storybook/react-vite";
import { useFilePreviewAssistantContext } from "./hooks";
import { FilePreviewAssistantProvider } from "./provider";

function AssistantStatus() {
  const { assistant, setAssistant } = useFilePreviewAssistantContext();

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border p-4 text-sm">
      <p>
        Estado del asistente:{" "}
        <strong>{assistant === null ? "null" : String(assistant)}</strong>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border border-border px-2 py-1"
          onClick={() => setAssistant(true)}
        >
          Activar
        </button>
        <button
          type="button"
          className="rounded-md border border-border px-2 py-1"
          onClick={() => setAssistant(false)}
        >
          Desactivar
        </button>
        <button
          type="button"
          className="rounded-md border border-border px-2 py-1"
          onClick={() => setAssistant(null)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

const meta = {
  title: "FileView/Context/AssistantProvider",
  component: FilePreviewAssistantProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Proveedor de contexto para el asistente de previsualización de archivos.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilePreviewAssistantProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FilePreviewAssistantProvider open fileId="demo-file-1">
      <AssistantStatus />
    </FilePreviewAssistantProvider>
  ),
};
