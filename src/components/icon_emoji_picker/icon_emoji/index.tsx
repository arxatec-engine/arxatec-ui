import { Icon } from "@/components/icon_picker/components/icon";
import type { IconName } from "lucide-react/dynamic";
import { cn } from "@/utilities/class";
import { isEmojiIcon } from "../utils";

export interface IconEmojiProps {
  value: string | null | undefined;
  className?: string;
}

export const IconEmoji = ({ value, className }: IconEmojiProps) => {
  if (isEmojiIcon(value)) {
    return (
      <span
        aria-hidden
        data-testid="icon-emoji-glyph"
        className={cn(
          "inline-flex shrink-0 items-center justify-center text-sm leading-none",
          className,
        )}
      >
        {value}
      </span>
    );
  }

  return (
    <Icon
      aria-hidden
      name={(value || "folder") as IconName}
      className={className}
    />
  );
};
