import { MapPin } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { LocationInput } from "@/components/location_input";
import { MapPicker, type LocationData } from "@/components/map_picker";
import { MapView } from "@/components/map_view";

import { ComponentPreview } from "../../../component_preview";

export const LocationExamples = () => {
  const [location, setLocation] = useState<LocationData | undefined>({
    lat: -12.1211,
    lng: -77.0305,
    address: "Miraflores, Lima, Perú",
  });
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <ComponentPreview
        title="LocationInput"
        description="Incorpora una ubicación a un formulario con una selección guiada. La dirección y las coordenadas permiten revisar lo elegido."
      >
        <LocationInput size="sm" value={location} onChange={setLocation} />
      </ComponentPreview>
      <ComponentPreview
        title="MapPicker"
        description="Permite buscar una dirección o señalar un punto exacto. Úsalo cuando la ubicación necesita precisión visual."
      >
        <div className="space-y-4 text-center">
          <MapPin
            className="mx-auto size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            {location?.address ?? "Elige una ubicación"}
          </p>
          <Dialog open={mapOpen} onOpenChange={setMapOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">Elegir en el mapa</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Elegir ubicación</DialogTitle>
                <DialogDescription>
                  Busca una dirección o selecciona un punto en el mapa.
                </DialogDescription>
              </DialogHeader>
              <MapPicker
                initialLocation={location}
                onLocationSelect={setLocation}
                onConfirm={(value) => {
                  setLocation(value);
                  setMapOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="MapView"
        description="Da contexto geográfico a una ubicación confirmada. La vista se actualiza al elegir otro punto en los ejemplos de arriba."
      >
        <div className="isolate w-full overflow-hidden rounded-md border bg-background">
          <MapView
            key={location ? location.lat + "," + location.lng : "default"}
            lat={location?.lat ?? -12.1211}
            lng={location?.lng ?? -77.0305}
            zoom={13}
            height={240}
          />
          <p className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
            <span>{location?.address ?? "Miraflores, Lima, Perú"}</span>
            <span className="tabular-nums">
              {(location?.lat ?? -12.1211).toFixed(4)},{" "}
              {(location?.lng ?? -77.0305).toFixed(4)}
            </span>
          </p>
        </div>
      </ComponentPreview>
    </>
  );
};
