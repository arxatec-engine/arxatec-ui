import type { Meta, StoryObj } from "@storybook/react-vite";

import { classNameControl } from "@/utilities/storybook";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./index";

type EmojiPickerStoryArgs = {
  placeholder?: string;
  alto?: string;
  ancho?: string;
  className?: string;
};

const meta = {
  title: "Components/EmojiPicker",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ...classNameControl,
    placeholder: { control: "text", name: "Placeholder búsqueda" },
    alto: { control: "text", description: "ej. h-[380px]" },
    ancho: { control: "text", description: "ej. w-[320px]" },
  },
} satisfies Meta<EmojiPickerStoryArgs>;

export default meta;

type Story = StoryObj<EmojiPickerStoryArgs>;

export const Default: Story = {
  args: {
    placeholder: "Buscar emoji…",
    alto: "h-[380px]",
    ancho: "w-[320px]",
    className: "border rounded-md shadow-md",
  },
  render: ({ placeholder, alto, ancho, className }) => (
    <EmojiPicker className={`${alto} ${ancho} ${className}`}>
      <EmojiPickerSearch placeholder={placeholder} />
      <EmojiPickerContent />
      <EmojiPickerFooter />
    </EmojiPicker>
  ),
};
