import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { FC } from "react";
import L from "leaflet";

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

interface MapViewProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  height?: number;
}

export const MapView: FC<MapViewProps> = ({
  lat = 19.4326,
  lng = -99.1332,
  zoom = 15,
  className = "",
  height = 300,
}) => {
  return (
    <div className={className} data-testid="map-view">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ width: "100%", height: `${height}px` }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
};
