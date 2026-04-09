import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarInput,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
  FileDropZone,
  IconPicker,
  type IconName,
  Image as ArxImage,
  ImageCropDialog,
  LocationInput,
  type LocationData,
  MapPicker,
  MapView,
} from "@/exports";
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
      title="Media, Pickers y Geolocalización"
      description="Gestión de archivos, identidad digital y servicios de ubicación interactiva."
    >
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 items-stretch">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Identidad y Perfil
            </p>
            <div className="space-y-4">
              <AvatarInput
                fullName="Maria Garcia Lopez"
                onAvatarChange={(file) => {
                  if (file) {
                    toast.success(`Avatar actualizado: ${file.name}`);
                  }
                }}
              />

              <div className="flex items-center gap-4 rounded-md border border-dashed border-border/80 bg-background/40 p-4">
                <Avatar className="size-12 border-2 border-background shadow-md">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="avatar"
                  />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="mb-1 text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                    Personalización
                  </p>
                  <IconPicker value={iconValue} onValueChange={onIconChange} />
                </div>
              </div>

              <div className="rounded-md bg-muted/20 p-3">
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  Completa tu perfil para mejorar la seguridad de tu cuenta y
                  habilitar funciones avanzadas de geolocalización.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Multimedia y Edición
            </p>
            <div className="space-y-4 h-full flex flex-col">
              <div className="group relative flex-1 min-h-[160px] overflow-hidden rounded-md border bg-black/5">
                <ArxImage
                  src="https://picsum.photos/id/44/800/500"
                  alt="preview"
                  className="h-full w-full"
                  classNameImage="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-[10px] text-white font-bold tracking-widest uppercase">
                    Preview Mode
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => onCropOpenChange(true)}
                  className="w-full text-[10px] h-9 uppercase font-bold tracking-widest bg-background/40"
                >
                  MODIFICAR ENCUADRE
                </Button>

                <ImageCropDialog
                  isOpen={cropOpen}
                  onClose={() => onCropOpenChange(false)}
                  imageSrc="https://picsum.photos/id/30/1200/700"
                  onCropComplete={() => onCropOpenChange(false)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Captura de Archivos
            </p>
            <div className="space-y-4">
              <FileDropZone
                files={files}
                onFilesChange={onFilesChange}
                acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
                maxFiles={3}
              />

              <div className="overflow-hidden rounded-md border bg-background/50">
                <p className="px-3 py-2 border-b text-[10px] text-muted-foreground font-bold uppercase tracking-tight bg-muted/20">
                  Biblioteca de Emojis
                </p>
                <EmojiPicker className="h-64 w-full border-none shadow-none translate-y-0">
                  <EmojiPickerSearch
                    placeholder="Filtrar por nombre..."
                    className="h-9 text-xs"
                  />
                  <EmojiPickerContent className="scrollbar-none" />
                </EmojiPicker>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Servicios de Ubicación
            </p>
            <div className="space-y-4 h-full flex flex-col">
              <LocationInput value={location} onChange={onLocationChange} />

              <div className="flex-1 min-h-[200px] overflow-hidden rounded-md border bg-muted/20 relative group">
                <MapView
                  lat={location?.lat}
                  lng={location?.lng}
                  zoom={13}
                  height={200}
                  className="h-full w-full grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-sm border text-[8px] font-mono font-bold">
                  {location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full text-[10px] h-9 font-black uppercase tracking-widest shadow-lg"
                  >
                    CONFIGURAR PUNTO EN MAPA
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden p-0 rounded-md border-none">
                  <div className="p-4 border-b bg-muted/40 px-6">
                    <DialogHeader>
                      <DialogTitle className="text-xs font-black uppercase tracking-[0.2em]">
                        Geolocalización Interactiva
                      </DialogTitle>
                    </DialogHeader>
                  </div>
                  <MapPicker
                    onLocationSelect={onLocationChange}
                    onConfirm={onLocationChange}
                    className="h-[65vh]"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
