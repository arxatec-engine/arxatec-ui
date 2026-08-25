import { type EmojiPickerListEmojiProps } from "frimousse";
import { cn } from "@/utilities/index";

const EmojiPickerEmoji = ({
  emoji,
  className,
  ...props
}: EmojiPickerListEmojiProps) => {
  return (
    <button
      {...props}
      className={cn(
        "data-[active]:bg-accent flex size-7 items-center justify-center rounded-sm text-base",
        className
      )}
      data-slot="emoji-picker-emoji"
    >
      {emoji.emoji}
    </button>
  );
};

export { EmojiPickerEmoji };
