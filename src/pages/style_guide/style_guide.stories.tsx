import type { Meta, StoryObj } from "@storybook/react-vite";

import { StyleGuide } from ".";

const meta = {
  title: "Pages/StyleGuide",
  component: StyleGuide,
  parameters: { layout: "fullscreen", handlesOwnTheme: true },
} satisfies Meta<typeof StyleGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { initialTheme: "light" },
  globals: { theme: "light" },
};

export const Dark: Story = {
  args: { initialTheme: "dark" },
  globals: { theme: "dark" },
};
