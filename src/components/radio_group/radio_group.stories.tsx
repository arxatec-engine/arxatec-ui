import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { classNameControl } from "@/utilities/storybook";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "./index";

type RadioGroupStoryArgs = ComponentProps<typeof RadioGroup> & {
  opcionA?: string;
  opcionB?: string;
};

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    defaultValue: {
      control: "text",
      description: "Opción seleccionada por defecto",
    },
    disabled: { control: "boolean" },
    opcionA: { control: "text", name: "Etiqueta A" },
    opcionB: { control: "text", name: "Etiqueta B" },
  },
  decorators: [
    (Story) => (
      <div className="w-64 space-y-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<RadioGroupStoryArgs>;

export default meta;

type Story = StoryObj<RadioGroupStoryArgs>;

export const Default: Story = {
  args: {
    defaultValue: "a",
    opcionA: "Opción A",
    opcionB: "Opción B",
  },
  render: ({ opcionA, opcionB, ...root }) => (
    <RadioGroup {...root}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="r-a" />
        <Label htmlFor="r-a">{opcionA}</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="r-b" />
        <Label htmlFor="r-b">{opcionB}</Label>
      </div>
    </RadioGroup>
  ),
};
