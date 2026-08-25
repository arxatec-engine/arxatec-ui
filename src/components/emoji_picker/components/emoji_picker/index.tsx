import {
        EmojiPicker as EmojiPickerPrimitive
} from "frimousse";
import type * as React from "react";
import { cn } from "@/utilities/index";

const EmojiPicker = ({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) => {
  return (
    <EmojiPickerPrimitive.Root
      locale="es"
      className={cn(
        "bg-popover text-popover-foreground isolate flex h-full w-fit flex-col overflow-hidden rounded-md",
        className
      )}
      data-slot="emoji-picker"
      {...props}
    />
  );
};

export { EmojiPicker };
