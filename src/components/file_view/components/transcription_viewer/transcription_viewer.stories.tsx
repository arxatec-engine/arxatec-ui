import type { Meta, StoryObj } from "@storybook/react-vite";

import { TRANSCRIPTION_PAGE_BREAK } from "../../utilities/transcription_pages";
import { FileTranscriptionViewer } from "./index";

const SAMPLE_TRANSCRIPTION = `Buenos días, bienvenidos a la reunión de seguimiento del proyecto.

En la agenda de hoy revisaremos el avance del módulo de archivos y las mejoras en el visor de documentos.

¿Alguna pregunta antes de continuar?`;

const SAMPLE_PAGED_TRANSCRIPTION = [
  `EXPEDIENTE N.° 01234-2026-0-1801-JR-CI-05
ESPECIALISTA: PÉREZ RAMÍREZ, LUCÍA
RESOLUCIÓN NÚMERO DOS

Lima, doce de marzo de dos mil veintiséis.

VISTOS: el escrito presentado por la parte demandante con fecha 10 de marzo de 2026.`,
  `SEGUNDO: que, conforme al artículo 139 de la Constitución, corresponde
garantizar el derecho de defensa de ambas partes.

TERCERO: por tales fundamentos, SE RESUELVE tener por apersonada a la parte
demandada y conceder el plazo de ley.`,
  "",
].join(TRANSCRIPTION_PAGE_BREAK);

const meta = {
  title: "FileView/TranscriptionViewer",
  component: FileTranscriptionViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visor de transcripciones. Los documentos paginados (PDF) se muestran página por página, respetando los saltos de línea del archivo original.",
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

export const Paginada: Story = {
  args: {
    content: SAMPLE_PAGED_TRANSCRIPTION,
    onCopy: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Documento paginado (PDF): cada página del archivo se muestra por separado, con sus saltos de línea originales. La última página no tiene texto extraíble.",
      },
    },
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
