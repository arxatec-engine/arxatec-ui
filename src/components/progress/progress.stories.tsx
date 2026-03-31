import type { Meta, StoryObj } from "@storybook/react-vite";

import { classNameControl } from "@/utilities/storybook";
import { Progress } from "./index";

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tercio: Story = {
  args: { value: 33 },
};

export const Mitad: Story = {
  args: { value: 50 },
};

export const Completo: Story = {
  args: { value: 100 },
};
