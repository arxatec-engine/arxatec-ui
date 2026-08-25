import { type EmojiPickerListRowProps } from "frimousse";

const EmojiPickerRow = ({ children, ...props }: EmojiPickerListRowProps) => {
  return (
    <div {...props} className="scroll-my-1 px-1" data-slot="emoji-picker-row">
      {children}
    </div>
  );
};

export { EmojiPickerRow };
