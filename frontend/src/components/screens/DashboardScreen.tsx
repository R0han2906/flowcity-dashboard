import { motion, Variants, useMotionValue, useTransform, animate } from 'framer-motion';
import { Bell, AlertTriangle, ArrowRight, Activity, Leaf, Clock, Navigation, Train, Bus, Footprints, ChevronRight, Shield } from 'lucide-react';
import { savedRoutes, disruptions } from '@/lib/mock-data';
import { useState, useEffect, useRef } from 'react';

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

interface Props { onNavigate: (screen: string) => void; }

// ── Helper: live clock & greeting ──────────────────────────────
function useLiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good Morning' :
      hour < 17 ? 'Good Afternoon' :
        'Good Evening';

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return { greeting, time, date, hour };
}

// ── Helper: animated counter hook ──────────────────────────────
function useAnimatedCounter(target: number, duration = 1.8) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const mv = useMotionValue ? undefined : undefined; // fallback
    let startTime: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    // small delay so user sees the animation start from 0
    const timeout = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(timeout);
  }, [target, duration]);

  return display;
}

// ── Mode icon picker ───────────────────────────────────────────
const modeIcons: Record<string, any> = {
  metro: Train,
  bus: Bus,
  walk: Footprints,
};

const modeColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  metro: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' },
  bus: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
  walk: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' },
};

const getModeKey = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes('metro')) return 'metro';
  if (l.includes('bus')) return 'bus';
  return 'walk';
};

// ════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════
const DashboardScreen = ({ onNavigate }: Props) => {
  const { greeting, time, date } = useLiveClock();
  const confidence = useAnimatedCounter(87, 2);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-[1200px] mx-auto pb-10">

      {/* ─── Top Header ─── */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            {greeting}, Rohan
          </h1>
          <p className="text-gray-500 font-medium">{date}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-gray-700">{time}</span>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-xs font-bold text-gray-500 tracking-wider">31°C HUMID</span>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ─── Left Column ─── */}
        <div className="xl:col-span-2 space-y-8">

          {/* Live Journey Card */}
          <motion.div
            variants={fadeUp}
            onClick={() => onNavigate('map')}
            className="bg-[#1b3a2a] rounded-[28px] p-8 text-white relative overflow-hidden cursor-pointer shadow-md group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110" />

            {/* Live badge row */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-ff-lime text-[#1b3a2a] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(197,240,44,0.3)]">
                  <div className="w-1.5 h-1.5 bg-[#1b3a2a] rounded-full animate-pulse" />
                  Live
                </div>
                <span className="text-white/60 text-sm font-medium">Tap to view map</span>
              </div>
              <ArrowRight className="text-white/40 group-hover:text-white transition-colors" />
            </div>

            {/* Route & ETA */}
            <div className="relative z-10 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Andheri <span className="text-white/40">to</span> BKC
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-ff-lime tracking-tighter">28</span>
                <span className="text-xl font-bold text-white/70">min</span>
                <span className="ml-4 bg-white/10 px-3 py-1 rounded-lg text-sm font-medium text-white/90">
                  ETA 09:18 AM
                </span>
              </div>
            </div>

            {/* ── Confidence Score (animated loader) ── */}
            <div className="relative z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Navigation size={16} className="text-ff-lime" />
                  On Time
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-ff-lime" />
                  <span className="text-xs font-mono font-bold text-ff-lime tracking-wide">
                    Confidence: {confidence}%
                  </span>
                </div>
              </div>

              {/* Animated progress bar */}
              <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-ff-lime rounded-full relative"
                  initial={{ width: '0%' }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/40" />
                </motion.div>
              </div>

              {/* Sub-label */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Route stability
                </span>
                <span className="text-[10px] font-medium text-white/40">
                  Based on 0 active disruptions
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <Activity className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Time Saved vs Avg</p>
                <p className="text-2xl font-bold text-gray-900">12 min</p>
              </div>
            </div>
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#f4f7eb] flex items-center justify-center">
                <Leaf className="text-ff-green-dark" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">CO₂ Avoided</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">2.4</p>
                  <span className="text-sm font-bold text-gray-500">kg</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Right Column ─── */}
        <div className="space-y-8">

          {/* ── Saved Routes (enhanced) ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Saved Routes</h3>
              <button
                onClick={() => onNavigate('plan')}
                className="text-sm font-semibold text-[#3c7689] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {savedRoutes.map((route) => {
                const modeKey = getModeKey(route.modeLabel);
                const colors = modeColors[modeKey];
                const Icon = modeIcons[modeKey] || Train;

                return (
                  <motion.div
                    key={route.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('plan')}
                    className={`relative p-4 rounded-2xl ${colors.bg} border ${colors.border} cursor-pointer group overflow-hidden transition-shadow hover:shadow-md`}
                  >
                    {/* Left accent bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.dot} rounded-r-full`} />

                    <div className="flex items-start gap-3 ml-2">
                      {/* Mode icon */}
                      <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border} flex-shrink-0`}>
                        <Icon size={18} className={colors.text} strokeWidth={2.5} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="font-bold text-gray-900 text-sm truncate pr-2">
                            {route.from}
                            <span className="text-gray-400 font-normal mx-1.5">→</span>
                            {route.to}
                          </p>
                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
                          />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                            <Icon size={10} strokeWidth={3} />
                            {route.modeLabel}
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                            <Clock size={11} strokeWidth={2.5} />
                            {route.duration} min
                          </span>

                          <span className="text-xs font-bold text-gray-900">₹{route.cost}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Live Disruptions ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="font-bold text-lg text-gray-900">Live Disruptions</h3>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {disruptions.map((d) => (
                <motion.div
                  key={d.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('alerts')}
                  className={`relative p-4 rounded-2xl border cursor-pointer overflow-hidden transition-shadow hover:shadow-md ${d.type === 'cancellation'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-orange-50 border-orange-200'
                    }`}
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${d.type === 'cancellation' ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                  />

                  <div className="flex items-start gap-3 ml-2">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${d.type === 'cancellation'
                          ? 'bg-red-100 text-red-600 border border-red-200'
                          : 'bg-orange-100 text-orange-600 border border-orange-200'
                        }`}
                    >
                      <AlertTriangle size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 mb-1">{d.route}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${d.type === 'cancellation'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-orange-100 text-orange-700 border border-orange-200'
                            }`}
                        >
                          {d.type === 'delay' ? `Delayed ${d.delay} min` : 'Cancelled'}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400">3 min ago</span>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 mt-1 flex-shrink-0"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardScreen;