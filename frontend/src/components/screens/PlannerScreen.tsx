import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Flag, ArrowUpDown, Zap, IndianRupee, Users,
  Train, Bus, Car, Footprints, Clock, ChevronDown,
  ChevronRight, Shield, ArrowRight, Sparkles, Gauge,
  Search, Loader2
} from 'lucide-react';
import SegmentBar from '@/components/SegmentBar';
import { routeResults as mockRouteResults } from '@/lib/mock-data';
import { planRoute, type BackendRoute } from '@/lib/api';
import type { RouteResult, RouteSegment } from '@/lib/types';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const modeConfig = {
  metro: { icon: Train, label: 'Metro', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', active: 'bg-blue-100' },
  bus: { icon: Bus, label: 'Bus', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', active: 'bg-amber-100' },
  auto: { icon: Car, label: 'Auto', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', active: 'bg-emerald-100' },
  walk: { icon: Footprints, label: 'Walk', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400', active: 'bg-gray-100' },
};

const badgeConfig: Record<string, { bg: string; text: string; icon: any }> = {
  accent: { bg: 'bg-[#1b3a2a]', text: 'text-white', icon: Zap },
  success: { bg: 'bg-emerald-600', text: 'text-white', icon: IndianRupee },
  muted: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Users },
};

const crowdConfig: Record<string, { color: string; bg: string }> = {
  HIGH: { color: 'text-red-600', bg: 'bg-red-50' },
  MODERATE: { color: 'text-amber-600', bg: 'bg-amber-50' },
  LOW: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

// Map BackendRoute → RouteResult (for existing card UI)
function adaptBackendRoute(r: BackendRoute, idx: number): RouteResult {
  const badgeColorMap: Record<string, string> = { fastest: 'accent', cheapest: 'success', comfort: 'muted' };
  const modeMap: Record<string, any> = { metro: 'metro', bus: 'bus', auto: 'auto', walk: 'walk', cab: 'auto', train: 'metro' };
  const crowdMap = ['HIGH', 'MODERATE', 'LOW'] as const;
  return {
    id: r.id,
    badge: r.label,
    badgeColor: badgeColorMap[r.type] || 'muted',
    from: '',
    to: '',
    totalTime: r.totalTime,
    cost: r.estimatedCost,
    segments: r.steps.map((s) => ({
      mode: modeMap[s.mode] || 'walk',
      duration: s.duration,
      label: `${s.label} · ${s.duration}M`,
      detail: s.distance,
    } as RouteSegment)),
    crowd: crowdMap[idx % 3],
    confidence: r.confidence,
  };
}

const PlannerScreen = () => {
  const [timeMode, setTimeMode] = useState<'now' | 'depart' | 'arrive'>('now');
  const [speed, setSpeed] = useState(70);
  const [cost, setCost] = useState(50);
  const [comfort, setComfort] = useState(30);
  const [modes, setModes] = useState({ metro: true, bus: true, auto: true, walk: true });
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  // ── Backend integration ──
  const [origin, setOrigin] = useState('Andheri Station');
  const [dest, setDest] = useState('BKC, Mumbai');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [liveRoutes, setLiveRoutes] = useState<RouteResult[] | null>(null);
  const [distKm, setDistKm] = useState<number | null>(null);

  const routeResults = liveRoutes ?? mockRouteResults;

  const handlePlan = async () => {
    const src = origin.trim();
    const dst = dest.trim();
    if (!src || !dst) return;
    setApiError(null);
    setApiLoading(true);
    try {
      const data = await planRoute(src, dst);
      setLiveRoutes(data.routes.map((r, i) => adaptBackendRoute(r, i)));
      setDistKm(data.distanceKm);
      setExpandedRoute(null);
    } catch {
      setApiError('Backend unavailable — showing demo data.');
      setLiveRoutes(null);
    } finally {
      setApiLoading(false);
    }
  };

  const highest =
    speed >= cost && speed >= comfort ? 'SPEED' : cost >= comfort ? 'COST' : 'COMFORT';

  const priorityMeta = {
    SPEED: { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Prioritizing Speed' },
    COST: { icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Prioritizing Cost' },
    COMFORT: { icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Prioritizing Comfort' },
  }[highest];

  const sliders = [
    { icon: Zap, label: 'Speed', value: speed, set: setSpeed, color: 'text-blue-600', track: 'bg-blue-500', trackBg: 'bg-blue-100' },
    { icon: IndianRupee, label: 'Cost', value: cost, set: setCost, color: 'text-emerald-600', track: 'bg-emerald-500', trackBg: 'bg-emerald-100' },
    { icon: Users, label: 'Comfort', value: comfort, set: setComfort, color: 'text-amber-600', track: 'bg-amber-500', trackBg: 'bg-amber-100' },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-[1200px] mx-auto pb-10"
    >
      {/* ─── Header ─── */}
      <motion.div variants={fadeUp} className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
          Route Planner
        </h1>
        <p className="text-gray-500 font-medium">
          Find the best way to get where you're going
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ═══════════════════════════════════════════
            LEFT COLUMN — Search + Preferences
           ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* ── Search Card ── */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-lg text-gray-900 mb-6">Plan Your Route</h3>

            {/* Origin */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} strokeWidth={2.5} className="text-blue-600" />
              </div>
              <input
                id="planner-origin"
                value={origin}
                onChange={(e) => { setOrigin(e.target.value); setLiveRoutes(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handlePlan()}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                placeholder="Enter origin..."
              />
            </div>

            {/* Connector + Swap */}
            <div className="flex items-center justify-between pl-5 h-10 relative">
              <div className="border-l-2 border-dashed border-gray-200 h-full" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={() => { const t = origin; setOrigin(dest); setDest(t); setLiveRoutes(null); }}
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
                id="planner-destination"
                value={dest}
                onChange={(e) => { setDest(e.target.value); setLiveRoutes(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handlePlan()}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                placeholder="Enter destination..."
              />
            </div>

            {/* Time Mode Selector */}
            <div className="flex gap-2 mt-6">
              {(['now', 'depart', 'arrive'] as const).map((m) => {
                const active = timeMode === m;
                return (
                  <motion.button
                    key={m}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeMode(m)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${active
                      ? 'bg-[#1b3a2a] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    {m === 'now' ? 'Now' : m === 'depart' ? 'Depart At' : 'Arrive By'}
                  </motion.button>
                );
              })}
            </div>

            {/* API error */}
            {apiError && (
              <p className="mt-3 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                ⚠ {apiError}
              </p>
            )}

            {/* Plan button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePlan}
              disabled={apiLoading}
              id="planner-search-btn"
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-[#1b3a2a] to-[#2c5f45] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(27,58,42,0.2)] hover:shadow-[0_12px_20px_rgba(27,58,42,0.3)] transition-all disabled:opacity-60"
            >
              {apiLoading ? <><Loader2 size={18} className="animate-spin" /> Calculating…</> : <><Search size={18} /> Find Routes</>}
            </motion.button>
          </motion.div>

          {/* ── Preferences Card ── */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-lg text-gray-900 mb-6">Route Preferences</h3>

            {/* Sliders */}
            <div className="space-y-6">
              {sliders.map(({ icon: Icon, label, value, set, color, track, trackBg }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${trackBg} flex items-center justify-center`}>
                        <Icon size={15} strokeWidth={2.5} className={color} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${color} tabular-nums`}>
                      {value}%
                    </span>
                  </div>

                  {/* Custom range slider */}
                  <div className="relative h-3 w-full group mt-1">
                    <div className={`absolute inset-0 rounded-full ${trackBg} shadow-inner`} />
                    <motion.div
                      className={`absolute left-0 top-0 bottom-0 rounded-full ${track} shadow-sm`}
                      style={{ width: `${value}%` }}
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={value}
                      onChange={(e) => set(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {/* Thumb indicator */}
                    <motion.div
                      className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-[4px] ${label === 'Speed' ? 'border-blue-500' : label === 'Cost' ? 'border-emerald-500' : 'border-amber-500'
                        } shadow-md pointer-events-none group-hover:scale-110 transition-transform duration-200`}
                      style={{ left: `calc(${value}% - 12px)` }}
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Priority indicator */}
            <motion.div
              layout
              className={`mt-6 ${priorityMeta.bg} rounded-2xl p-4 flex items-center gap-3 border ${highest === 'SPEED' ? 'border-blue-200' : highest === 'COST' ? 'border-emerald-200' : 'border-amber-200'
                }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                <priorityMeta.icon size={16} className={priorityMeta.color} strokeWidth={2.5} />
              </div>
              <span className={`text-sm font-bold ${priorityMeta.color}`}>
                {priorityMeta.label}
              </span>
            </motion.div>

            {/* Mode Filter */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Transport Modes
              </p>
              <div className="flex gap-2">
                {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((m) => {
                  const cfg = modeConfig[m];
                  const Icon = cfg.icon;
                  const active = modes[m];
                  return (
                    <motion.button
                      key={m}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setModes((prev) => ({ ...prev, [m]: !prev[m] }))}
                      className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all border ${active
                        ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : 'bg-gray-50 border-gray-200 text-gray-400 opacity-50'
                        }`}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {cfg.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — Route Results
           ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Results header */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between"
          >
            <p className="text-sm font-medium text-gray-500">
              <span className="font-bold text-gray-900">{routeResults.length}</span> routes found
              {distKm && liveRoutes && <span className="ml-2 text-gray-400">· ~{distKm} km</span>}
              {!liveRoutes && <span className="ml-2 text-gray-400">(demo)</span>}
            </p>
            <button className="text-sm font-semibold text-[#3c7689] hover:underline flex items-center gap-1">
              Sort: Fastest
              <ChevronDown size={14} />
            </button>
          </motion.div>

          {/* Route Cards */}
          {routeResults.map((route, idx) => {
            const badge = badgeConfig[route.badgeColor];
            const BadgeIcon = badge.icon;
            const crowd = crowdConfig[route.crowd] || crowdConfig.MODERATE;
            const isExpanded = expandedRoute === route.id;

            return (
              <motion.div
                key={route.id}
                variants={fadeUp}
                className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  {/* Badge + Time row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`${badge.bg} ${badge.text} px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5`}>
                      <BadgeIcon size={12} strokeWidth={3} />
                      {route.badge}
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
                          {route.totalTime}
                        </span>
                        <span className="text-sm font-semibold text-gray-400">min</span>
                      </div>
                      <span className="text-sm font-bold text-gray-500">
                        ₹{route.cost}
                      </span>
                    </div>
                  </div>

                  {/* Segment Bar */}
                  <SegmentBar segments={route.segments} />

                  {/* Info chips row */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {/* Legs */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                      <ArrowRight size={12} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-600">
                        {route.segments.length} Legs
                      </span>
                    </div>

                    {/* Crowd */}
                    <div className={`${crowd.bg} border ${route.crowd === 'HIGH' ? 'border-red-200' : route.crowd === 'LOW' ? 'border-emerald-200' : 'border-amber-200'
                      } rounded-xl px-3 py-1.5 flex items-center gap-1.5`}>
                      <Users size={12} className={crowd.color} strokeWidth={2.5} />
                      <span className={`text-[11px] font-bold ${crowd.color}`}>
                        {route.crowd}
                      </span>
                    </div>

                    {/* Confidence */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                      <Shield size={12} className="text-emerald-600" strokeWidth={2.5} />
                      <span className="text-[11px] font-bold text-emerald-600 tabular-nums">
                        {route.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Select button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                    className={`w-full mt-5 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${isExpanded
                      ? 'bg-gray-100 text-gray-600 border border-gray-200 shadow-inner'
                      : 'bg-gradient-to-r from-[#1b3a2a] to-[#2c5f45] text-white shadow-[0_8px_16px_rgba(27,58,42,0.2)] hover:shadow-[0_12px_20px_rgba(27,58,42,0.3)] hover:from-[#234d38] hover:to-[#387a58]'
                      }`}
                  >
                    {isExpanded ? (
                      <>
                        Collapse Route Details
                        <ChevronDown size={18} className="rotate-180" />
                      </>
                    ) : (
                      <>
                        Select This Route
                        <ChevronRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Expanded Steps */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-2xl p-5">
                          {route.segments.map((seg, i) => {
                            const modeKey = seg.mode as keyof typeof modeConfig;
                            const cfg = modeConfig[modeKey] || modeConfig.walk;
                            const StepIcon = cfg.icon;

                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.3 }}
                                className="flex gap-3 mb-0 last:mb-0"
                              >
                                {/* Timeline */}
                                <div className="flex flex-col items-center pt-1">
                                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                                    <StepIcon size={14} className={cfg.color} strokeWidth={2.5} />
                                  </div>
                                  {i < route.segments.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[20px]" />
                                  )}
                                </div>

                                {/* Step content */}
                                <div className="pb-4 last:pb-0 flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="font-bold text-sm text-gray-900">
                                      {seg.label}
                                    </p>
                                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 tabular-nums">
                                      <Clock size={11} />
                                      {seg.duration || seg.label.match(/\d+/)?.[0]} min
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    {seg.detail}
                                  </p>
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
          })}

          {/* ── Comparison Table (Desktop only) ── */}
          <motion.div
            variants={fadeUp}
            className="hidden xl:block bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 pb-3">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Gauge size={18} className="text-gray-400" />
                Route Comparison
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Route', 'Time', 'Cost', 'Legs', 'Crowd', 'Confidence'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {routeResults.map((r, i) => {
                      const crd = crowdConfig[r.crowd] || crowdConfig.MODERATE;
                      return (
                        <tr
                          key={r.id}
                          className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            } hover:bg-blue-50/50 transition-colors`}
                        >
                          <td className="px-4 py-3 font-bold text-gray-900 border-b border-gray-100">
                            {r.badge}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-100 tabular-nums">
                            {r.totalTime}m
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-100 tabular-nums">
                            ₹{r.cost}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-100">
                            {r.segments.length}
                          </td>
                          <td className={`px-4 py-3 font-bold border-b border-gray-100 ${crd.color}`}>
                            {r.crowd}
                          </td>
                          <td className="px-4 py-3 font-bold text-emerald-600 border-b border-gray-100 tabular-nums">
                            {r.confidence}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlannerScreen;