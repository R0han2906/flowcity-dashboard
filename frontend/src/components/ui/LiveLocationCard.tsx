// src/components/ui/LiveLocationCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT – one-time setup:
//   1. npm install leaflet @types/leaflet
//   2. Add this line to src/index.css  →  @import 'leaflet/dist/leaflet.css';
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw, WifiOff, Crosshair } from 'lucide-react';
import L from 'leaflet';

// ── Fix Vite's broken default icon paths ──────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Types ─────────────────────────────────────────────────────────────────────
interface LocationState {
  lat:      number;
  lng:      number;
  accuracy: number;
  address:  string;
  area:     string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Pulsing blue-dot divIcon (no external image needed) ───────────────────────
const buildPulsingIcon = () =>
  L.divIcon({
    className: '',
    html: `
      <div class="riq-location-dot">
        <div class="riq-pulse-ring"></div>
        <div class="riq-dot-core"></div>
      </div>
    `,
    iconSize:   [24, 24],
    iconAnchor: [12, 12],
  });

// ── Reverse-geocode via Nominatim (free, no key required) ─────────────────────
async function reverseGeocode(lat: number, lng: number): Promise<{ address: string; area: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    const a = data.address ?? {};

    // Build a short readable street-level label
    const street = a.road ?? a.pedestrian ?? a.footway ?? '';
    const area   = a.suburb ?? a.neighbourhood ?? a.city_district ?? a.town ?? a.city ?? 'Unknown area';
    const city   = a.city ?? a.town ?? a.village ?? '';

    const address = [street, city].filter(Boolean).join(', ') || area;
    return { address, area };
  } catch {
    return { address: 'Location found', area: 'Current position' };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const LiveLocationCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);
  const circleRef    = useRef<L.Circle | null>(null);

  const [location, setLocation] = useState<LocationState | null>(null);
  const [status,   setStatus]   = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Build / update the Leaflet map ─────────────────────────────────────────
  const buildMap = useCallback((lat: number, lng: number, accuracy: number) => {
    if (!containerRef.current) return;

    // ── Destroy previous instance cleanly ────────────────────────────────────
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current  = null;
      markerRef.current = null;
      circleRef.current = null;
    }

    // ── Create map (all interaction disabled for a compact card) ─────────────
    const map = L.map(containerRef.current, {
      center:            [lat, lng],
      zoom:              16,
      zoomControl:       false,
      attributionControl: false,
      dragging:          false,
      scrollWheelZoom:   false,
      doubleClickZoom:   false,
      touchZoom:         false,
      keyboard:          false,
      boxZoom:           false,
    });

    // ── Tile layer – clean OSM style ─────────────────────────────────────────
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // ── Accuracy circle ──────────────────────────────────────────────────────
    const circle = L.circle([lat, lng], {
      radius:      Math.min(accuracy, 120),
      color:       '#3b82f6',
      fillColor:   '#3b82f6',
      fillOpacity: 0.08,
      weight:      1.5,
      dashArray:   '4 4',
    }).addTo(map);

    // ── Pulsing marker ───────────────────────────────────────────────────────
    const marker = L.marker([lat, lng], { icon: buildPulsingIcon() }).addTo(map);

    mapRef.current    = map;
    markerRef.current = marker;
    circleRef.current = circle;
  }, []);

  // ── Fetch live GPS position ────────────────────────────────────────────────
  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('loading');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // Geocode while simultaneously building the map
        const [geo] = await Promise.all([
          reverseGeocode(latitude, longitude),
          Promise.resolve(buildMap(latitude, longitude, accuracy)),
        ]);

        setLocation({
          lat:      latitude,
          lng:      longitude,
          accuracy: Math.round(accuracy),
          address:  geo.address,
          area:     geo.area,
        });
        setStatus('success');
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location access denied. Please allow it in browser settings.',
          2: 'Position unavailable. Try again.',
          3: 'Location request timed out.',
        };
        setErrorMsg(messages[err.code] ?? 'Could not fetch location.');
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 30_000 }
    );
  }, [buildMap]);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchLocation();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [fetchLocation]);

  // ── Derived UI flags ──────────────────────────────────────────────────────
  const isLoading = status === 'loading' || status === 'idle';
  const isError   = status === 'error';
  const isSuccess = status === 'success';

  return (
    <>
      {/* ── Injected styles for the pulsing dot (scoped class names) ── */}
      <style>{`
        .riq-location-dot {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .riq-pulse-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(59,130,246,0.35);
          animation: riq-pulse 1.8s ease-out infinite;
        }
        .riq-dot-core {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2.5px solid #ffffff;
          box-shadow: 0 2px 10px rgba(59,130,246,0.55);
        }
        @keyframes riq-pulse {
          0%   { transform: translate(-50%, -50%) scale(0.7); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
        /* Hide OSM attribution to keep the card clean */
        .leaflet-control-attribution { display: none !important; }
      `}</style>

      <motion.div
        variants={fadeUp}
        className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"
      >
        {/* ── Map viewport ──────────────────────────────────────────────── */}
        <div className="relative h-[190px] bg-gray-50">
          {/* Leaflet mounts here */}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ opacity: isSuccess ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-gray-100" />
                <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-t-blue-500 animate-spin" />
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Finding location…
              </p>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-3 px-6 text-center">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <WifiOff size={18} className="text-red-400" />
              </div>
              <p className="text-xs font-medium text-gray-500 leading-snug">{errorMsg}</p>
              <button
                onClick={fetchLocation}
                className="text-[11px] font-bold text-blue-500 hover:text-blue-600 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {/* Bottom fade so map bleeds into info strip cleanly */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none z-[400]" />

          {/* Live badge – top-left overlay */}
          {isSuccess && (
            <div className="absolute top-3 left-3 z-[500] flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Live</span>
            </div>
          )}
        </div>

        {/* ── Info strip ────────────────────────────────────────────────── */}
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 min-w-0">
              {/* Icon */}
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={15} className="text-blue-500" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Current Location
                </p>

                {isLoading && (
                  <div className="space-y-1.5 mt-1">
                    <div className="h-3.5 w-32 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-2.5 w-20 bg-gray-100 rounded-full animate-pulse" />
                  </div>
                )}

                {isError && (
                  <p className="text-sm font-bold text-gray-400">Unavailable</p>
                )}

                {isSuccess && location && (
                  <>
                    <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                      {location.area}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate leading-tight">
                      {location.address}
                    </p>
                    <p className="text-[10px] font-mono text-gray-300 mt-1">
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchLocation}
              disabled={isLoading}
              title="Refresh location"
              className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center
                         hover:bg-blue-50 hover:border-blue-100 transition-colors flex-shrink-0 mt-0.5
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={13}
                className={`text-gray-400 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Accuracy pill */}
          {isSuccess && location && (
            <div className="mt-3 flex items-center gap-1.5">
              <Crosshair size={11} className="text-gray-300" />
              <span className="text-[10px] font-semibold text-gray-400">
                GPS active · ±{location.accuracy}m accuracy
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default LiveLocationCard;