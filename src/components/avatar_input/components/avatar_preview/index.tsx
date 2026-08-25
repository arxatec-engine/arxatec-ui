import { X } from "lucide-react";

interface Props {
  previewUrl: string | null;
  initials: string;
  previewAlt: string;
  removeLabel: string;
  onRemove: () => void;
}

export const AvatarPreview = ({
  previewUrl,
  initials,
  previewAlt,
  removeLabel,
  onRemove,
}: Props) => {
  return (
    <div
      data-slot="avatar-input-preview"
      className="relative size-20 bg-accent rounded-md flex items-center justify-center border"
    >
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt={previewAlt}
            className="w-full h-full object-cover rounded-md"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel}
            className="absolute -top-1 -right-1 bg-primary/20 backdrop-blur-lg text-foreground rounded-full p-1 hover:bg-primary/40 transition-colors"
          >
            <X className="size-3" />
          </button>
        </>
      ) : (
        <span className="text-sm font-medium text-muted-foreground">
          {initials}
        </span>
      )}
    </div>
  );
};
