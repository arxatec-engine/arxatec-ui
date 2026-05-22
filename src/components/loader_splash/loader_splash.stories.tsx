import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { LoaderSplash } from "./index";

type LoaderSplashStoryArgs = ComponentProps<typeof LoaderSplash> & {
  classNameContenedor?: string;
};

const meta = {
  title: "Components/LoaderSplash",
  component: LoaderSplash,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "Pantalla de carga a pantalla completa con el isotipo en opacidad reducida y un barrido diagonal. Usa el interruptor **Tema** en la barra para claro/oscuro.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    shimmerOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "Opacidad del barrido diagonal (0–1)",
    },
    classNameContenedor: {
      control: "text",
      description:
        "Clases del contenedor alrededor del splash (solo Storybook)",
    },
  },
} satisfies Meta<LoaderSplashStoryArgs>;

export default meta;

type Story = StoryObj<LoaderSplashStoryArgs>;

export const Default: Story = {
  args: {
    shimmerOpacity: 0.3,
    classNameContenedor: "min-h-screen bg-background",
  },
  render: ({ classNameContenedor, shimmerOpacity }) => (
    <div className={classNameContenedor}>
      <LoaderSplash shimmerOpacity={shimmerOpacity} />
    </div>
  ),
};
