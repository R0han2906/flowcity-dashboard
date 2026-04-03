import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Fix Leaflet's default icon path issue in bundlers ──────────────
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// ── Custom marker icons ────────────────────────────────────────────
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// ── Types ──────────────────────────────────────────────────────────
export interface LatLng { lat: number; lng: number; }

export interface MapRoute {
  type: 'fastest' | 'cheapest' | 'comfort';
  color: string;
  positions: [number, number][];
}

interface MapComponentProps {
  originCoords: LatLng | null;
  destCoords: LatLng | null;
  routes: MapRoute[];
}

// ── Fly-to helper (updates view when coords change) ─────────────────
function FlyToMarkers({ originCoords, destCoords }: { originCoords: LatLng | null; destCoords: LatLng | null }) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (originCoords && destCoords) {
      const bounds = L.latLngBounds(
        [originCoords.lat, originCoords.lng],
        [destCoords.lat, destCoords.lng]
      );
      map.fitBounds(bounds, { padding: [60, 60] });
      hasFlown.current = true;
    } else if (originCoords && !hasFlown.current) {
      map.flyTo([originCoords.lat, originCoords.lng], 13, { duration: 1.2 });
    }
  }, [originCoords, destCoords, map]);

  return null;
}

// ── Legend overlay ─────────────────────────────────────────────────
const LEGEND_ITEMS = [
  { color: '#22c55e', label: 'Fastest' },
  { color: '#3b82f6', label: 'Cheapest' },
  { color: '#f97316', label: 'Comfort' },
];

// ── Main component ─────────────────────────────────────────────────
export default function MapComponent({ originCoords, destCoords, routes }: MapComponentProps) {
  const MUMBAI: [number, number] = [19.076, 72.8777];

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-[24px] overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={MUMBAI}
        zoom={12}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToMarkers originCoords={originCoords} destCoords={destCoords} />

        {/* Route polylines */}
        {routes.map((route) => (
          <Polyline
            key={route.type}
            positions={route.positions}
            pathOptions={{
              color: route.color,
              weight: route.type === 'fastest' ? 5 : 4,
              opacity: 0.85,
              dashArray: route.type === 'comfort' ? '8 6' : undefined,
            }}
          />
        ))}

        {/* Origin marker */}
        {originCoords && (
          <Marker position={[originCoords.lat, originCoords.lng]} icon={blueIcon} />
        )}

        {/* Destination marker */}
        {destCoords && (
          <Marker position={[destCoords.lat, destCoords.lng]} icon={redIcon} />
        )}
      </MapContainer>

      {/* Legend overlay */}
      {routes.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-100 space-y-1.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Routes</p>
          {LEGEND_ITEMS.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
