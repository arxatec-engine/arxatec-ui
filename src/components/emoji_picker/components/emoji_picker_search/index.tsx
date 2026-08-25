import {
        EmojiPicker as EmojiPickerPrimitive
} from "frimousse";
import { SearchIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/utilities/index";

const EmojiPickerSearch = ({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) => {
  return (
    <div
      className={cn("flex h-9 items-center gap-2 border-b px-3", className)}
      data-slot="emoji-picker-search-wrapper"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <EmojiPickerPrimitive.Search
        className="outline-hidden placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        data-slot="emoji-picker-search"
        {...props}
      />
    </div>
  );
};

export { EmojiPickerSearch };
