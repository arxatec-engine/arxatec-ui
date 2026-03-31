import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { classNameControl } from "@/utilities/storybook";
import { Button } from "../button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./index";

type ButtonGroupStoryArgs = ComponentProps<typeof ButtonGroup> & {
  etiqueta?: string;
  texto1?: string;
  texto2?: string;
  texto3?: string;
};

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    etiqueta: { control: "text", name: "Texto del grupo (ConSeparador)" },
    texto1: { control: "text", name: "Botón 1" },
    texto2: { control: "text", name: "Botón 2" },
    texto3: { control: "text", name: "Botón 3" },
  },
} satisfies Meta<ButtonGroupStoryArgs>;

export default meta;

type Story = StoryObj<ButtonGroupStoryArgs>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    texto1: "Izquierda",
    texto2: "Centro",
    texto3: "Derecha",
  },
  render: ({ texto1, texto2, texto3, ...root }) => (
    <ButtonGroup {...root}>
      <Button variant="outline" size="sm">
        {texto1}
      </Button>
      <Button variant="outline" size="sm">
        {texto2}
      </Button>
      <Button variant="outline" size="sm">
        {texto3}
      </Button>
    </ButtonGroup>
  ),
};

export const ConSeparador: Story = {
  args: {
    etiqueta: "Archivo",
    texto1: "Guardar",
  },
  argTypes: {
    texto2: { table: { disable: true } },
    texto3: { table: { disable: true } },
    orientation: { table: { disable: true } },
  },
  render: ({ etiqueta, texto1, ...root }) => (
    <ButtonGroup {...root}>
      <ButtonGroupText>{etiqueta}</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline" size="sm">
        {texto1}
      </Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    texto1: "Uno",
    texto2: "Dos",
  },
  argTypes: {
    texto3: { table: { disable: true } },
  },
  render: ({ texto1, texto2, ...root }) => (
    <ButtonGroup orientation="vertical" className="w-40" {...root}>
      <Button variant="outline" size="sm">
        {texto1}
      </Button>
      <Button variant="outline" size="sm">
        {texto2}
      </Button>
    </ButtonGroup>
  ),
};
