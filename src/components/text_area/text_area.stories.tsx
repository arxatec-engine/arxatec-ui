import type { Meta, StoryObj } from "@storybook/react-vite";

import { classNameControl } from "@/utilities/storybook";
import { Textarea } from "./index";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    placeholder: { control: "text" },
    rows: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Escribe un comentario…",
    rows: 4,
  },
};

export const Deshabilitado: Story = {
  args: {
    disabled: true,
    placeholder: "No editable",
  },
};
