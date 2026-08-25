import {
        EmojiPicker as EmojiPickerPrimitive
} from "frimousse";
import { LoaderIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/utilities/index";

import { EmojiPickerCategoryHeader } from "../emoji_picker_category_header";
import { EmojiPickerEmoji } from "../emoji_picker_emoji";
import { EmojiPickerRow } from "../emoji_picker_row";

const EmojiPickerContent = ({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) => {
  return (
    <EmojiPickerPrimitive.Viewport
      className={cn("outline-hidden relative flex-1", className)}
      data-slot="emoji-picker-viewport"
      {...props}
    >
      <EmojiPickerPrimitive.Loading
        className="absolute inset-0 flex items-center justify-center text-muted-foreground"
        data-slot="emoji-picker-loading"
      >
        <LoaderIcon className="size-4 animate-spin" />
      </EmojiPickerPrimitive.Loading>
      <EmojiPickerPrimitive.Empty
        className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm"
        data-slot="emoji-picker-empty"
      >
        Emoji no encontrado.
      </EmojiPickerPrimitive.Empty>
      <EmojiPickerPrimitive.List
        className="select-none pb-1"
        components={{
          Row: EmojiPickerRow,
          Emoji: EmojiPickerEmoji,
          CategoryHeader: EmojiPickerCategoryHeader,
        }}
        data-slot="emoji-picker-list"
      />
    </EmojiPickerPrimitive.Viewport>
  );
};

export { EmojiPickerContent };
