import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { classNameControl } from "@/utilities/storybook";
import { ColorPicker, type ColorPickerProps } from "./index";

type ColorPickerStoryArgs = Omit<ColorPickerProps, "onChange">;

const meta = {
  title: "Components/Color Picker",
  component: ColorPicker as React.ComponentType<ColorPickerStoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-64 items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    ...classNameControl,
    contentClassName: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    swatches: { control: "object" },
    value: { control: "text" },
  },
} satisfies Meta<ColorPickerStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

function ColorPickerPreview(args: ColorPickerStoryArgs) {
  const [value, setValue] = React.useState(args.value);

  return (
    <div className="flex flex-col items-center gap-3">
      <ColorPicker {...args} onChange={setValue} value={value} />
      <div className="text-muted-foreground text-sm">
        Valor seleccionado: <span className="font-mono">{value}</span>
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    value: "#2563EB",
  },
  render: (args) => <ColorPickerPreview key={args.value} {...args} />,
};

export const ConPaletaPersonalizada: Story = {
  args: {
    value: "#0F766E",
    swatches: ["#171717", "#334155", "#2563EB", "#0F766E", "#D97706", "#DC2626"],
  },
  render: (args) => <ColorPickerPreview key={args.value} {...args} />,
};

export const Deshabilitado: Story = {
  args: {
    disabled: true,
    value: "#7C3AED",
  },
  render: (args) => <ColorPickerPreview key={args.value} {...args} />,
};
