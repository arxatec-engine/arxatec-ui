import { PencilIcon, PlusIcon } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/utilities/index";

import { Button } from "../button";
import { ImageCropDialog } from "../image_crop_dialog";
import { Label } from "../label";
import { AvatarPreview } from "./components";
import { DEFAULT_LABELS } from "./constants";
import { useAvatarInput } from "./hooks";
import { getInitials } from "./utilities";
import type { AvatarInputLabels } from "./types";

interface Props {
  fullName: string;
  onAvatarChange: (file: File | undefined) => void;
  className?: string;
  defaultAvatar?: string;
  label?: string;
  labels?: Partial<AvatarInputLabels>;
}

export const AvatarInput = forwardRef<HTMLDivElement, Props>(
  (
    {
      fullName,
      onAvatarChange,
      className,
      defaultAvatar,
      label = "Profile photo",
      labels,
    },
    ref
  ) => {
    const text = { ...DEFAULT_LABELS, ...labels };
    const avatar = useAvatarInput({ defaultAvatar, onAvatarChange });

    return (
      <div ref={ref} data-slot="avatar-input" className={cn(className)}>
        <Label className="flex items-center gap-2">
          {label}
          <span className="text-xs text-muted-foreground">{text.optional}</span>
        </Label>

        <div className="mt-2 flex items-center gap-4">
          <AvatarPreview
            previewUrl={avatar.previewUrl}
            initials={getInitials(fullName)}
            previewAlt={text.previewAlt}
            removeLabel={text.remove}
            onRemove={avatar.remove}
          />
          <div className="flex flex-col gap-2">
            <input
              ref={avatar.inputRef}
              type="file"
              accept="image/*"
              onChange={avatar.selectFile}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-none bg-accent hover:bg-accent/80 w-fit"
              onClick={avatar.openFilePicker}
            >
              {avatar.previewUrl ? (
                <PencilIcon className="w-4 h-4" />
              ) : (
                <PlusIcon className="w-4 h-4" />
              )}
              <span>{avatar.previewUrl ? text.change : text.add}</span>
            </Button>
            {avatar.file && (
              <p className="text-xs text-muted-foreground">{avatar.file.name}</p>
            )}
          </div>
        </div>

        {avatar.error && (
          <p className="text-sm text-destructive mt-2">{text[avatar.error]}</p>
        )}

        {avatar.imageToCrop && (
          <ImageCropDialog
            isOpen
            onClose={avatar.cancelCrop}
            imageSrc={avatar.imageToCrop}
            onCropComplete={avatar.applyCrop}
          />
        )}
      </div>
    );
  }
);

AvatarInput.displayName = "AvatarInput";

export type { AvatarInputLabels } from "./types";
