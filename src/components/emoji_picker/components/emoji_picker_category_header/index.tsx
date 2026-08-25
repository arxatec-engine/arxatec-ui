import { type EmojiPickerListCategoryHeaderProps } from "frimousse";

const EmojiPickerCategoryHeader = ({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) => {
  return (
    <div
      {...props}
      className="bg-popover text-muted-foreground px-3 pb-2 pt-3.5 text-xs leading-none"
      data-slot="emoji-picker-category-header"
    >
      {category.label}
    </div>
  );
};

export { EmojiPickerCategoryHeader };
