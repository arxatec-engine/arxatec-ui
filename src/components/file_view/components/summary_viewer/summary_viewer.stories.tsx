import type { Meta, StoryObj } from "@storybook/react-vite";

import { FileSummaryViewer } from "./index";

const SAMPLE_SUMMARY = `## Resumen del documento

El informe describe la implementación del módulo de previsualización de archivos, incluyendo soporte para **PDF**, imágenes, video, audio y documentos *Office*.

### Puntos clave
- Router por tipo MIME
- Estados de carga y error unificados
- Integración con el asistente de IA

### Cobertura por formato
| Formato | Estado |
| --- | --- |
| PDF | Completo |
| DOCX | Parcial |

> Pendiente: revisar el flujo de descarga.

Más detalle en [la documentación](https://arxatec.net).`;

const PLAIN_SUMMARY = `Resumen en texto plano, sin marcas de Markdown.
La segunda línea conserva el salto original.`;

const meta = {
  title: "FileView/SummaryViewer",
  component: FileSummaryViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Visor de resúmenes generados automáticamente.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: { control: "boolean" },
    isProcessing: { control: "boolean" },
    isFetching: { control: "boolean" },
    isError: { control: "boolean" },
    isUnsupported: { control: "boolean" },
    onCopy: { table: { disable: true } },
    onRetry: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="h-96 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileSummaryViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: SAMPLE_SUMMARY,
    onCopy: () => {},
  },
};

export const TextoPlano: Story = {
  args: {
    content: PLAIN_SUMMARY,
    onCopy: () => {},
  },
};

export const Cargando: Story = {
  args: { isLoading: true },
};

export const Procesando: Story = {
  args: { isProcessing: true },
};

export const Error: Story = {
    args: { isError: true, onRetry: () => {} },
};

export const NoSoportado: Story = {
  args: { isUnsupported: true },
};
