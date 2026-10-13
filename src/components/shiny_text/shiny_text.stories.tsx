import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShinyText } from "./index";

const meta = {
  title: "Feedback/ShinyText",
  component: ShinyText,
  args: { children: "Preparando respuesta…" },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShinyText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomText: Story = {
  args: { children: "Creating your document…", textClassName: "text-primary" },
};
