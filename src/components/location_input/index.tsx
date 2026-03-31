import { useState } from "react";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { MapPicker, type LocationData } from "@/components/map_picker";
import { MapPinIcon, XIcon } from "lucide-react";
import { cn } from "@/utilities";

interface LocationInputProps {
  value?: LocationData;
  onChange?: (location: LocationData | undefined) => void;
  size?: "default" | "sm";
}

export const LocationInput = ({
  value,
  onChange,
  size = "default",
}: LocationInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationSelect = (location: LocationData) => {
    onChange?.(location);
  };

  const handleConfirmLocation = (location: LocationData) => {
    onChange?.(location);
    setIsOpen(false);
  };

  const handleClearLocation = () => {
    onChange?.(undefined);
  };

  return (
    <div>
      <Label className="mb-2 block">
        Ubicación{" "}
        <span className="text-xs text-muted-foreground">(Opcional)</span>
      </Label>

      {value && (
        <div className="mb-3 p-3 bg-card rounded-md border">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1">
              <MapPinIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">{value.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full font-normal text-muted-foreground bg-card justify-start",
              value && "justify-center text-foreground"
            )}
            size={size}
          >
            {value ? "Cambiar ubicación" : "Seleccionar ubicación"}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar ubicación</DialogTitle>
            <DialogDescription>
              Busca una dirección o haz clic en el mapa para seleccionar tu
              ubicación
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <MapPicker
              onLocationSelect={handleLocationSelect}
              onConfirm={handleConfirmLocation}
              initialLocation={value || { lat: -12.068266, lng: -76.996335 }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
