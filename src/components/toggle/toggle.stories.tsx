import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold } from "lucide-react";

import { classNameControl } from "@/utilities/storybook";
import { Toggle } from "./index";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    pressed: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Negrita",
    children: <Bold className="size-4" />,
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    "aria-label": "Negrita",
    children: <Bold className="size-4" />,
  },
};

export const ConTexto: Story = {
  args: {
    variant: "outline",
    children: <>Itálica</>,
  },
};
