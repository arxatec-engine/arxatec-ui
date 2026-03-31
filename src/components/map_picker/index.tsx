import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  type FormEvent,
  type ErrorInfo,
  type ReactNode,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { SearchIcon, MapPinIcon } from "lucide-react";
import { useDebounce } from "@/hooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para iconos de Leaflet en producción
// Los iconos por defecto no se cargan correctamente después del build
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

interface MapPickerProps {
  onLocationSelect?: (location: LocationData) => void;
  onConfirm?: (location: LocationData) => void;
  initialLocation?: LocationData;
  className?: string;
}

// Error Boundary for handling Leaflet errors
class MapErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error en MapPicker:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-64 bg-muted rounded-md border">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Error al cargar el mapa
              </p>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
              >
                Reintentar
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

interface PlaceAutocompleteProps {
  onPlaceSelect: (location: LocationData) => void;
  placeholder?: string;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = "Buscar ubicación...",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [suggestions, setSuggestions] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (debouncedInputValue) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedInputValue
        )}&limit=5&accept-language=es&addressdetails=1&countrycodes=mx,es,ar,co,pe,cl,ve,ec,bo,py,uy,cr,pa,gt,hn,sv,ni,cu,do,pr`
      )
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        })
        .catch((error) => console.error("Error fetching suggestions:", error));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInputValue]);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: Record<string, unknown>) => {
      const location: LocationData = {
        lat: parseFloat(suggestion.lat as string),
        lng: parseFloat(suggestion.lon as string),
        address: suggestion.display_name as string,
        placeId: suggestion.place_id as string,
      };
      setInputValue(suggestion.display_name as string);
      setShowSuggestions(false);
      onPlaceSelect(location);
    },
    [onPlaceSelect]
  );

  const clearInput = useCallback(() => {
    setInputValue("");
    setShowSuggestions(false);
  }, []);

  return (
    <div className="relative z-50">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
      <Input
        value={inputValue}
        onInput={handleInput}
        placeholder={placeholder}
        className="pl-10"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-accent cursor-pointer text-sm border-b border-border last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate text-popover-foreground">
                    {suggestion.display_name as string}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {inputValue && (
            <div className="px-3 py-2 border-t border-border bg-muted">
              <button
                onClick={clearInput}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Separated component to handle map events
const MapEvents: React.FC<{
  onLocationChange: (location: LocationData) => void;
}> = ({ onLocationChange }) => {
  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        return {
          address: data.display_name,
          placeId: data.place_id,
        };
      }
    } catch (error) {
      console.error("Error geocoding:", error);
    }
    return {};
  }, []);

  useMapEvents({
    click: async (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const addressData = await getAddressFromCoords(lat, lng);
      const newLocation: LocationData = {
        lat,
        lng,
        ...addressData,
      };
      onLocationChange(newLocation);
    },
  });

  return null;
};

// Component to handle the map view
const MapViewController: React.FC<{
  location: LocationData;
}> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (map && location) {
      map.setView([location.lat, location.lng]);
    }
  }, [map, location.lat, location.lng]);

  return null;
};

// Main map component
const MapWithMarker: React.FC<{
  location: LocationData;
  onLocationChange: (location: LocationData) => void;
}> = ({ location, onLocationChange }) => {
  const markerRef = useRef<L.Marker>(null);

  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        return {
          address: data.display_name,
          placeId: data.place_id,
        };
      }
    } catch (error) {
      console.error("Error geocoding:", error);
    }
    return {};
  }, []);

  const handleMarkerDragEnd = useCallback(
    async (event: L.LeafletEvent) => {
      const latLng = event.target.getLatLng();
      const lat = latLng.lat;
      const lng = latLng.lng;
      const addressData = await getAddressFromCoords(lat, lng);
      const newLocation: LocationData = {
        lat,
        lng,
        ...addressData,
      };
      onLocationChange(newLocation);
    },
    [onLocationChange, getAddressFromCoords]
  );

  return (
    <div data-testid="map-container">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{ width: "100%", height: "300px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[location.lat, location.lng]}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
          ref={markerRef}
        />
        <MapViewController location={location} />
        <MapEvents onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
};

// Main MapPicker component
export const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  onConfirm,
  initialLocation = { lat: 19.4326, lng: -99.1332 },
  className = "",
}) => {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationData>(initialLocation);

  const handlePlaceSelect = useCallback(
    (location: LocationData) => {
      setSelectedLocation(location);
      onLocationSelect?.(location);
    },
    [onLocationSelect]
  );

  const handleLocationChange = useCallback(
    (location: LocationData) => {
      setSelectedLocation(location);
      onLocationSelect?.(location);
    },
    [onLocationSelect]
  );

  const handleConfirm = useCallback(() => {
    onConfirm?.(selectedLocation);
  }, [selectedLocation, onConfirm]);

  return (
    <div className={`space-y-4 ${className}`}>
      <PlaceAutocomplete
        onPlaceSelect={handlePlaceSelect}
        placeholder="Buscar ubicación..."
      />

      <div className="border rounded-md overflow-hidden relative z-10">
        <MapErrorBoundary>
          <MapWithMarker
            location={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        </MapErrorBoundary>
      </div>

      <div className="bg-muted p-3 rounded-md">
        <div className="flex items-start gap-2">
          <MapPinIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <p className="font-medium">Ubicación seleccionada:</p>
            {selectedLocation.address ? (
              <p>{selectedLocation.address}</p>
            ) : (
              <p className="text-muted-foreground italic">
                Obteniendo dirección...
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      <Button onClick={handleConfirm} className="w-full">
        Confirmar ubicación
      </Button>
    </div>
  );
};

export type { LocationData };
