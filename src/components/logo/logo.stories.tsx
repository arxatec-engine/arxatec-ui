import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo, type LogoVariant } from "./index";

const variants: LogoVariant[] = ["arxatec", "academy", "management"];

const meta = {
  title: "Components/Logo",
  component: Logo,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    className: "h-10 w-auto text-foreground",
  },
  argTypes: {
    className: { control: "text" },
    variant: {
      control: "select",
      options: variants,
      description: "Logo de Arxatec, Arxatec Academy o Arxatec Management.",
      table: { defaultValue: { summary: "arxatec" } },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Academy: Story = {
  args: { variant: "academy" },
};

export const Management: Story = {
  args: { variant: "management" },
};

export const EnTemas: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col items-start gap-6 rounded-md bg-white p-6 text-black">
        {variants.map((variant) => (
          <Logo key={variant} variant={variant} className="h-8 w-auto" />
        ))}
      </div>
      <div className="flex flex-col items-start gap-6 rounded-md bg-black p-6 text-white">
        {variants.map((variant) => (
          <Logo key={variant} variant={variant} className="h-8 w-auto" />
        ))}
      </div>
    </div>
  ),
};
