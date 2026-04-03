import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  MapPin, Flag, ArrowUpDown, Zap, IndianRupee, Users,
  Clock, ChevronRight, Shield, Search, Navigation,
  Train, Bus, Car, Footprints, Sparkles, AlertCircle,
  Loader2,
} from 'lucide-react';
import { planRoute, type BackendRoute, type BackendRouteStep } from '@/lib/api';
import MapComponent, { type LatLng, type MapRoute } from '@/components/MapComponent';

// ─── Nominatim geocoding ───────────────────────────────────────────
async function geocodeLocation(query: string): Promise<LatLng> {
  const q = encodeURIComponent(`${query}, Mumbai, India`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (!data.length) throw new Error(`Location not found: "${query}"`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

// ─── Simulate 3 route polylines around two coords ─────────────────
function buildRoutes(o: LatLng, d: LatLng): MapRoute[] {
  const mid = { lat: (o.lat + d.lat) / 2, lng: (o.lng + d.lng) / 2 };
  const latD = d.lat - o.lat;
  const lngD = d.lng - o.lng;
  return [
    {
      type: 'fastest',
      color: '#22c55e',
      positions: [
        [o.lat, o.lng],
        [mid.lat + latD * 0.12, mid.lng - lngD * 0.08],
        [d.lat, d.lng],
      ],
    },
    {
      type: 'cheapest',
      color: '#3b82f6',
      positions: [
        [o.lat, o.lng],
        [mid.lat - latD * 0.10, mid.lng + lngD * 0.12],
        [mid.lat - latD * 0.05, mid.lng - lngD * 0.05],
        [d.lat, d.lng],
      ],
    },
    {
      type: 'comfort',
      color: '#f97316',
      positions: [
        [o.lat, o.lng],
        [o.lat + latD * 0.3, o.lng + lngD * 0.1],
        [mid.lat + latD * 0.08, mid.lng + lngD * 0.15],
        [d.lat - latD * 0.1, d.lng - lngD * 0.05],
        [d.lat, d.lng],
      ],
    },
  ];
}

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ─── Mode styling config ──────────────────────────────────────────
const modeConfig: Record<string, { icon: any; color: string; bg: string; border: string; dot: string }> = {
  metro: { icon: Train,    color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-500' },
  bus:   { icon: Bus,      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500' },
  auto:  { icon: Car,      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  cab:   { icon: Car,      color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200',  dot: 'bg-purple-500' },
  walk:  { icon: Footprints, color: 'text-gray-500',  bg: 'bg-gray-50',    border: 'border-gray-200',    dot: 'bg-gray-400' },
  train: { icon: Train,    color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  dot: 'bg-indigo-500' },
};

const getModeConfig = (mode: string) => modeConfig[mode] || modeConfig.walk;

// ─── Route type badge config ──────────────────────────────────────
const routeTypeBadge: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  fastest: { bg: 'bg-[#1b3a2a]', text: 'text-white', label: '⚡ Fastest',  icon: Zap },
  cheapest:{ bg: 'bg-emerald-600', text: 'text-white', label: '₹ Cheapest', icon: IndianRupee },
  comfort: { bg: 'bg-gray-100',  text: 'text-gray-600', label: '😌 Comfort', icon: Users },
};

// ─── Route card ───────────────────────────────────────────────────
function RouteCard({ route, index }: { route: BackendRoute; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const badge = routeTypeBadge[route.type] || routeTypeBadge.comfort;
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        {/* Badge + time row */}
        <div className="flex items-start justify-between mb-5">
          <div className={`${badge.bg} ${badge.text} px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5`}>
            <BadgeIcon size={12} strokeWidth={3} />
            {badge.label}
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
                {route.totalTime}
              </span>
              <span className="text-sm font-semibold text-gray-400">min</span>
            </div>
            <span className="text-sm font-bold text-gray-500">₹{route.estimatedCost}</span>
          </div>
        </div>

        {/* Tags + meta chips */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {route.tags.map((tag) => (
            <span key={tag} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 text-[11px] font-bold text-gray-600">
              {tag}
            </span>
          ))}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1 flex items-center gap-1.5">
            <Shield size={11} className="text-emerald-600" strokeWidth={2.5} />
            <span className="text-[11px] font-bold text-emerald-600 tabular-nums">{route.confidence}%</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 flex items-center gap-1.5">
            <ChevronRight size={11} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-600">{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Mode pill trail */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          {route.steps.map((step, i) => {
            const cfg = getModeConfig(step.mode);
            const Icon = cfg.icon;
            return (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${cfg.bg} border ${cfg.border}`}>
                  <Icon size={12} className={cfg.color} strokeWidth={2.5} />
                  <span className={`text-[11px] font-bold ${cfg.color}`}>{step.duration}m</span>
                </div>
                {i < route.steps.length - 1 && (
                  <ChevronRight size={12} className="text-gray-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Last mile note */}
        {route.lastMile && (
          <p className="text-[11px] text-gray-400 font-medium mt-2 flex items-center gap-1">
            <Navigation size={10} className="text-gray-400" />
            {route.lastMile}
          </p>
        )}

        {/* Expand button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className={`w-full mt-5 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            expanded
              ? 'bg-gray-100 text-gray-600 border border-gray-200 shadow-inner'
              : 'bg-gradient-to-r from-[#1b3a2a] to-[#2c5f45] text-white shadow-[0_8px_16px_rgba(27,58,42,0.2)] hover:shadow-[0_12px_20px_rgba(27,58,42,0.3)]'
          }`}
        >
          {expanded ? 'Collapse Steps' : 'View Step-by-Step'}
          <ChevronRight
            size={16}
            className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
          />
        </motion.button>
      </div>

      {/* Expanded steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-5 space-y-0">
                {route.steps.map((step: BackendRouteStep, i: number) => {
                  const cfg = getModeConfig(step.mode);
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className="flex gap-3"
                    >
                      {/* Timeline */}
                      <div className="flex flex-col items-center pt-1">
                        <div className={`w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={14} className={cfg.color} strokeWidth={2.5} />
                        </div>
                        {i < route.steps.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[20px]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-4 last:pb-0 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-gray-900">{step.label}</p>
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 tabular-nums">
                            <Clock size={11} />
                            {step.duration} min
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.distance}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



// ─── Main Screen ──────────────────────────────────────────────────
const LiveMapScreen = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ routes: BackendRoute[]; distanceKm: number } | null>(null);

  // Map state
  const [originCoords, setOriginCoords] = useState<LatLng | null>(null);
  const [destCoords, setDestCoords] = useState<LatLng | null>(null);
  const [mapRoutes, setMapRoutes] = useState<MapRoute[]>([]);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
    setResult(null);
  };

  const handleSearch = async () => {
    const src = source.trim();
    const dst = destination.trim();
    if (!src || !dst) {
      setError('Please enter both origin and destination.');
      return;
    }
    setError(null);
    setGeoError(null);
    setLoading(true);

    // Geocode & backend call in parallel
    const [routeData, geoResult] = await Promise.allSettled([
      planRoute(src, dst),
      Promise.all([geocodeLocation(src), geocodeLocation(dst)]),
    ]);

    // Handle route results
    if (routeData.status === 'fulfilled') {
      setResult({ routes: routeData.value.routes, distanceKm: routeData.value.distanceKm });
    } else {
      setError('Could not connect to the backend. Make sure the server is running on port 5000.');
    }

    // Handle geocoding results
    if (geoResult.status === 'fulfilled') {
      const [oCoords, dCoords] = geoResult.value;
      setOriginCoords(oCoords);
      setDestCoords(dCoords);
      setMapRoutes(buildRoutes(oCoords, dCoords));
    } else {
      setGeoError('Could not find one or both locations on the map.');
      setOriginCoords(null);
      setDestCoords(null);
      setMapRoutes([]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-[1200px] mx-auto pb-10"
    >
      {/* ─── Header ─── */}
      <motion.div variants={fadeUp} className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Live Map</h1>
        <p className="text-gray-500 font-medium">AI-powered route planning with real-time intelligence</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">
        {/* ══════════════════════════════
            LEFT — Search Panel
           ══════════════════════════════ */}
        <div className="space-y-6">
          {/* Search Card */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Plan Your Journey</h3>

            {/* Origin */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} strokeWidth={2.5} className="text-blue-600" />
              </div>
              <input
                id="live-map-origin"
                value={source}
                onChange={(e) => { setSource(e.target.value); setResult(null); }}
                onKeyDown={handleKeyDown}
                placeholder="Enter origin (e.g. Andheri)"
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              />
            </div>

            {/* Connector + Swap */}
            <div className="flex items-center justify-between pl-5 h-10 relative">
              <div className="border-l-2 border-dashed border-gray-200 h-full" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={handleSwap}
                className="w-9 h-9 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown size={15} strokeWidth={2.5} className="text-gray-500" />
              </motion.button>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 mt-1">
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                <Flag size={18} strokeWidth={2.5} className="text-red-500" />
              </div>
              <input
                id="live-map-destination"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setResult(null); }}
                onKeyDown={handleKeyDown}
                placeholder="Enter destination (e.g. BKC)"
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2"
              >
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              disabled={loading}
              id="live-map-search-btn"
              className="w-full mt-6 py-4 bg-gradient-to-r from-[#1b3a2a] to-[#2c5f45] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(27,58,42,0.2)] hover:shadow-[0_12px_20px_rgba(27,58,42,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Finding best routes…
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Routes
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Info card */}
          <motion.div variants={fadeUp} className="bg-[#1b3a2a] rounded-[28px] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#c5f02c]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5f02c]">AI-Powered</span>
              </div>
              <h4 className="font-bold text-base mb-1">Smart Route Engine</h4>
              <p className="text-white/60 text-xs font-medium leading-relaxed">
                Our backend calculates fastest, cheapest, and comfort-optimised routes using real-time traffic patterns and transit data.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: 'Fastest', icon: '⚡' },
                  { label: 'Cheapest', icon: '₹' },
                  { label: 'Comfort', icon: '😌' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10">
                    <div className="text-lg mb-0.5">{item.icon}</div>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════
            RIGHT — Map + Results
           ══════════════════════════════ */}
        <div className="space-y-6">
          {/* Live Map (OpenStreetMap via React Leaflet) */}
          <motion.div variants={fadeUp} className="w-full" style={{ height: 420 }}>
            <MapComponent
              originCoords={originCoords}
              destCoords={destCoords}
              routes={mapRoutes}
            />
          </motion.div>

          {/* Geocoding error toast */}
          {geoError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl"
            >
              <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-amber-700">{geoError}</p>
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#1b3a2a]/10 flex items-center justify-center">
                  <Loader2 size={24} className="text-[#1b3a2a] animate-spin" />
                </div>
                <p className="text-gray-500 font-medium text-sm">Calculating optimal routes…</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                key="results"
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    <span className="font-bold text-gray-900">{result.routes.length}</span> routes found
                    <span className="ml-2 text-gray-400">· ~{result.distanceKm} km</span>
                  </p>
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600">Live</span>
                  </div>
                </motion.div>

                {result.routes.map((route, idx) => (
                  <RouteCard key={route.id} route={route} index={idx} />
                ))}
              </motion.div>
            )}

            {!loading && !result && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <Navigation size={24} className="text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">No routes yet</h4>
                <p className="text-sm text-gray-400 font-medium">
                  Enter your origin and destination to get AI-optimised routes
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMapScreen;
