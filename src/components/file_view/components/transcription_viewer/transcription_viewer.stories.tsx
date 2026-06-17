import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileTranscriptionViewer } from "./index";

const SAMPLE_TRANSCRIPTION = `Buenos días, bienvenidos a la reunión de seguimiento del proyecto.

En la agenda de hoy revisaremos el avance del módulo de archivos y las mejoras en el visor de documentos.

¿Alguna pregunta antes de continuar?`;

const meta = {
  title: "FileView/TranscriptionViewer",
  component: FileTranscriptionViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Visor de transcripciones de audio o video.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: { control: "boolean" },
    isProcessing: { control: "boolean" },
    isFetching: { control: "boolean" },
    isError: { control: "boolean" },
    onCopy: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-96 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileTranscriptionViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: SAMPLE_TRANSCRIPTION,
    onCopy: () => {},
  },
};

export const Cargando: Story = {
  args: { isLoading: true },
};

export const Procesando: Story = {
  args: { isProcessing: true, isFetching: true },
};

export const Error: Story = {
  args: { isError: true },
};
