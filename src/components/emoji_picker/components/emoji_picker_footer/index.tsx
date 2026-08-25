import {
        EmojiPicker as EmojiPickerPrimitive
} from "frimousse";
import type * as React from "react";
import { cn } from "@/utilities/index";

const EmojiPickerFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "max-w-(--frimousse-viewport-width) flex w-full min-w-0 items-center gap-1 border-t p-2",
        className
      )}
      data-slot="emoji-picker-footer"
      {...props}
    >
      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <>
              <div className="flex size-7 flex-none items-center justify-center text-lg">
                {emoji.emoji}
              </div>
              <span className="text-secondary-foreground truncate text-xs">
                {emoji.label}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground ml-1.5 flex h-7 items-center truncate text-xs">
              Seleccionar un emoji…
            </span>
          )
        }
      </EmojiPickerPrimitive.ActiveEmoji>
    </div>
  );
};

export { EmojiPickerFooter };
