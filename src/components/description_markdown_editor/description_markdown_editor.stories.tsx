import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { Toaster } from "@/components/sonner";
import { classNameControl } from "@/utilities/storybook";
import { DescriptionMarkdownEditor } from "./index";

const MARKDOWN_INICIAL = `## Descripción

Texto con **negrita** y *cursiva*.

- Viñeta uno
- Viñeta dos
`;

type EditorStoryArgs = Omit<
  ComponentProps<typeof DescriptionMarkdownEditor>,
  "onChange"
>;

const meta: Meta<EditorStoryArgs> = {
  title: "Components/DescriptionMarkdownEditor",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Editor TipTap controlado: `value` / `onChange` en Markdown. **Enter** envía si pasas `onSubmit`; **Mayús+Enter** o la lógica interna inserta salto de línea.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    value: {
      control: "text",
      description:
        "Markdown inicial (si cambias este control, vuelve a abrir la historia para reiniciar el estado).",
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    editorClassName: {
      control: "text",
      description: "Clases del contenedor del contenido editable",
    },
    footer: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    onEscape: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <>
        <div className="mx-auto w-full max-w-2xl">
          <Story />
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<EditorStoryArgs>;

function StatefulEditor(args: EditorStoryArgs) {
  const [value, setValue] = useState(args.value);
  return (
    <DescriptionMarkdownEditor
      {...args}
      value={value}
      onChange={setValue}
    />
  );
}

export const Default: Story = {
  args: {
    value: MARKDOWN_INICIAL,
    placeholder: "Escribe una descripción...",
    disabled: false,
  },
  render: (args) => <StatefulEditor {...args} />,
};

export const Vacio: Story = {
  args: {
    value: "",
    placeholder: "Sin contenido inicial…",
    disabled: false,
  },
  render: (args) => <StatefulEditor {...args} />,
};

export const Deshabilitado: Story = {
  args: {
    value: MARKDOWN_INICIAL,
    disabled: true,
  },
  render: (args) => <StatefulEditor {...args} />,
};

export const ConPieDeAcciones: Story = {
  args: {
    value: MARKDOWN_INICIAL,
    placeholder: "Descripción con pie",
    disabled: false,
    footer: (
      <>
        <Button type="button" variant="outline" size="sm">
          Cancelar
        </Button>
        <Button type="button" size="sm">
          Guardar
        </Button>
      </>
    ),
  },
  render: (args) => <StatefulEditor {...args} />,
};

export const EnterParaEnviar: Story = {
  args: {
    value: "Escribe y pulsa **Enter** (sin Mayús) para ver el toast.",
    placeholder: "Probar Enter…",
    disabled: false,
    onSubmit: () => {
      toast.success("onSubmit: Enter sin Mayús");
    },
  },
  render: (args) => <StatefulEditor {...args} />,
};
