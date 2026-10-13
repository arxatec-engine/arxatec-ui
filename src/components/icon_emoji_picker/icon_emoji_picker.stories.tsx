import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button";
import { IconEmoji, IconEmojiPicker, type IconEmojiPickerProps } from "./index";

function Example(props: IconEmojiPickerProps) {
  const [value, setValue] = useState(props.value);
  return (
    <div className="flex items-center gap-3 p-6">
      <IconEmojiPicker
        {...props}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          props.onValueChange(next);
        }}
      >
        <Button variant="outline" aria-label="Choose icon or emoji">
          <IconEmoji value={value} className="size-5" />
        </Button>
      </IconEmojiPicker>
      <span>Selection: {value}</span>
    </div>
  );
}

const meta = {
  title: "Inputs/IconEmojiPicker",
  component: IconEmojiPicker,
  args: { value: "folder", children: null, onValueChange: () => {} },
  parameters: { layout: "centered" },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof IconEmojiPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Icons: Story = {};
export const Emojis: Story = { args: { value: "🚀" } };
export const English: Story = {
  args: {
    locale: "en",
    labels: {
      icons: "Icons",
      emojis: "Emojis",
      searchIcons: "Search an icon…",
      searchEmojis: "Search an emoji…",
      emptyIcons: "No icon found.",
      emptyEmojis: "No emoji found.",
      emojiHint: "Select an emoji…",
    },
  },
};
