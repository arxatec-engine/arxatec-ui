import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarInput } from "./index";

const meta = {
  title: "Components/AvatarInput",
  component: AvatarInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    fullName: { control: "text" },
    label: { control: "text" },
    labels: { control: "object" },
    className: { control: "text" },
    defaultAvatar: { control: "text" },
    onAvatarChange: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvatarInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fullName: "María García López",
    onAvatarChange: () => {},
  },
};

export const ConAvatarPorDefecto: Story = {
  args: {
    fullName: "Juan Pérez",
    onAvatarChange: () => {},
    defaultAvatar: "https://github.com/shadcn.png",
  },
};

/**
 * Los textos por defecto están en inglés (L8). Una app en español los pasa
 * enteros por `label` y `labels`.
 */
export const TextosEnEspanol: Story = {
  args: {
    fullName: "María García López",
    onAvatarChange: () => {},
    label: "Foto de perfil",
    labels: {
      optional: "(Opcional)",
      add: "Agregar foto",
      change: "Cambiar foto",
      remove: "Quitar foto",
      previewAlt: "Vista previa del avatar",
      invalidType: "Por favor selecciona un archivo de imagen válido",
      tooLarge: "La imagen debe ser menor a 2MB",
    },
  },
};
