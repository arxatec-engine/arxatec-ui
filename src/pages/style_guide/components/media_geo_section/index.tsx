import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { AvatarInput } from "@/components/avatar_input";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/emoji_picker";
import { FileDropZone } from "@/components/file_dropzone";
import { IconPicker, type IconName } from "@/components/icon_picker";
import { Image as ArxImage } from "@/components/image";
import { ImageCropDialog } from "@/components/image_crop_dialog";
import { LocationInput } from "@/components/location_input";
import type { LocationData } from "@/components/map_picker";
import { MapPicker } from "@/components/map_picker";
import { MapView } from "@/components/map_view";

import { ShowcaseBlock } from "../showcase_block";

interface Props {
  iconValue: IconName | undefined;
  onIconChange: (value: IconName | undefined) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  cropOpen: boolean;
  onCropOpenChange: (open: boolean) => void;
  location: LocationData | undefined;
  onLocationChange: (loc: LocationData | undefined) => void;
}

export function MediaGeoSection({
  iconValue,
  onIconChange,
  files,
  onFilesChange,
  cropOpen,
  onCropOpenChange,
  location,
  onLocationChange,
}: Props) {
  return (
    <ShowcaseBlock
      title="Media, Pickers y Geolocalizacion"
      description="Carga de archivos, imagenes, iconos, emojis y mapa interactivo."
    >
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <AvatarInput
            fullName="Maria Garcia Lopez"
            onAvatarChange={(file) => {
              if (file) {
                toast.success(`Avatar actualizado: ${file.name}`);
              }
            }}
          />

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Avatar className="shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="min-w-0 max-w-full flex-1">
              <IconPicker value={iconValue} onValueChange={onIconChange} />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-md border">
            <EmojiPicker className="h-[320px] w-full min-w-0">
              <EmojiPickerSearch placeholder="Buscar emoji..." />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </div>

          <FileDropZone
            files={files}
            onFilesChange={onFilesChange}
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxFiles={5}
          />
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="h-44 min-w-0 overflow-hidden rounded-md border">
            <ArxImage
              src="https://picsum.photos/id/44/800/500"
              alt="preview"
              className="h-full w-full"
              classNameImage="h-full w-full object-cover"
            />
          </div>

          <Button variant="outline" onClick={() => onCropOpenChange(true)}>
            Probar ImageCropDialog
          </Button>
          <ImageCropDialog
            isOpen={cropOpen}
            onClose={() => onCropOpenChange(false)}
            imageSrc="https://picsum.photos/id/30/1200/700"
            onCropComplete={() => onCropOpenChange(false)}
          />

          <LocationInput value={location} onChange={onLocationChange} />
          <div className="min-w-0 max-w-full overflow-hidden rounded-md border">
            <MapView
              lat={location?.lat}
              lng={location?.lng}
              zoom={13}
              height={240}
              className="max-w-full"
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir MapPicker</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Elegir ubicacion</DialogTitle>
              </DialogHeader>
              <MapPicker
                onLocationSelect={onLocationChange}
                onConfirm={onLocationChange}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
