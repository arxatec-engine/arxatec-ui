import type { Meta, StoryObj } from "@storybook/react-vite";

import { classNameControl } from "@/utilities/storybook";
import { Badge } from "./index";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Etiqueta" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secundario" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Eliminar" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Contorno" },
};
