import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Clock, TrendingUp, ChevronDown, ChevronRight,
  Shield, Bus, Footprints, Car, Train, Sparkles, XCircle,
  Radio, CloudRain, Zap as ZapIcon, Construction, Users,
  Trash2, Shuffle, Play, CheckCircle2, TriangleAlert
} from 'lucide-react';
import SegmentBar from '@/components/SegmentBar';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const severityReasons = [
  { id: 'signal', label: 'Signal Failure', icon: Radio },
  { id: 'accident', label: 'Accident', icon: Car },
  { id: 'strike', label: 'Strike', icon: Users },
  { id: 'weather', label: 'Weather', icon: CloudRain },
  { id: 'event', label: 'Event', icon: Sparkles },
  { id: 'power', label: 'Power Cut', icon: ZapIcon },
];

const DisruptionsScreen = () => {
  const [showAlts, setShowAlts] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('Metro Line 1');
  const [delayMin, setDelayMin] = useState(15);
  const [severity, setSeverity] = useState<'minor' | 'major' | 'shutdown'>('major');
  const [activeReasons, setActiveReasons] = useState<string[]>(['signal']);
  const [logs, setLogs] = useState([
    { time: '09:14:22', type: 'trigger', text: 'Metro L1 +18 min — Signal Failure' },
    { time: '09:14:22', type: 'reroute', text: 'Reroute: Bus #340 suggested (+9 min)' },
  ]);

  const triggerDisruption = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    const reasonLabels = activeReasons
      .map((id) => severityReasons.find((r) => r.id === id)?.label)
      .filter(Boolean)
      .join(', ');
    setLogs((prev) => [
      { time: now, type: 'trigger', text: `${selectedRoute} +${delayMin} min — ${reasonLabels}` },
      { time: now, type: 'reroute', text: 'Reroute calculated' },
      ...prev,
    ]);
  };

  const clearAll = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [{ time: now, type: 'clear', text: 'All disruptions cleared' }, ...prev]);
  };

  const randomize = () => {
    const routes = ['Metro Line 1', 'Metro Line 2', 'Bus #308', 'Bus #340', 'Bus #209'];
    const reasons = severityReasons.map((r) => r.id);
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    const randomDelay = Math.floor(Math.random() * 25) + 5;
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    setSelectedRoute(randomRoute);
    setDelayMin(randomDelay);
    setActiveReasons([randomReason]);
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    const label = severityReasons.find((r) => r.id === randomReason)?.label || '';
    setLogs((prev) => [
      { time: now, type: 'trigger', text: `${randomRoute} +${randomDelay} min — ${label}` },
      { time: now, type: 'reroute', text: 'Reroute calculated' },
      ...prev,
    ]);
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
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
          Disruptions & Reroute
        </h1>
        <p className="text-gray-500 font-medium">
          Live disruption alerts and smart rerouting
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        {/* ═══════════════════════════════════════════
            LEFT COLUMN — Alerts & Reroute
           ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* ── Alert Banner ── */}
          <motion.div
            variants={fadeUp}
            className="relative bg-red-50 rounded-[28px] p-7 border border-red-200 overflow-hidden"
          >
            {/* Decorative pulse ring */}
            <div className="absolute top-6 right-6">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} strokeWidth={2.5} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700">Route Disrupted</h3>
                <p className="text-sm font-medium text-red-600/80">Reported 3 min ago</p>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-1">
              Metro Line 1 — Delayed 18 min
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Signal failure at Ghatkopar station. Services running with reduced frequency.
            </p>

            {/* Severity bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-500">Severity</span>
                <span className="text-xs font-bold text-red-600">Major</span>
              </div>
              <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                />
              </div>
            </div>

            <p className="text-[10px] font-medium text-gray-400 mt-2">
              Source: Mumbai Metro Rail Corporation
            </p>
          </motion.div>

          {/* ── Original Route (struck through) ── */}
          <motion.div
            variants={fadeUp}
            className="bg-gray-50 rounded-[28px] p-6 border border-dashed border-gray-300 opacity-70"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 text-red-600 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <XCircle size={12} strokeWidth={3} />
                  Affected
                </div>
              </div>
              <span className="text-xs font-medium text-gray-400">Original</span>
            </div>

            <p className="font-bold text-sm text-gray-500 line-through mb-1">
              Andheri → Ghatkopar → BKC via Metro
            </p>
            <p className="text-xs text-gray-400 line-through mb-3">
              Was 22 min · ₹30
            </p>

            <div className="opacity-40">
              <SegmentBar
                segments={[
                  { mode: 'walk', duration: 4, label: 'Walk', detail: '' },
                  { mode: 'metro', duration: 18, label: 'Metro L1', detail: '' },
                ]}
                showLabels={false}
              />
            </div>
          </motion.div>

          {/* ── Suggested Reroute ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.4 }}
            className="bg-white rounded-[28px] shadow-md border-2 border-blue-200 overflow-hidden relative"
          >
            {/* Subtle glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-7 relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="bg-[#1b3a2a] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Sparkles size={12} strokeWidth={3} />
                  Suggested Route
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
                      31
                    </span>
                    <span className="text-sm font-semibold text-gray-400">min</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500">₹22</span>
                </div>
              </div>

              <p className="font-bold text-gray-900 mb-4">
                Andheri → BKC via Bus #340 + Walk
              </p>

              <SegmentBar
                segments={[
                  { mode: 'bus', duration: 22, label: 'Bus #340 · 22m', detail: '' },
                  { mode: 'walk', duration: 9, label: 'Walk · 9m', detail: '' },
                ]}
              />

              {/* Comparison block */}
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock size={15} className="text-amber-600" strokeWidth={2.5} />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp size={15} className="text-emerald-600" strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">+9 min longer</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    But avoids 18 min disruption wait at Ghatkopar
                  </p>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-5 py-4 bg-[#1b3a2a] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <CheckCircle2 size={18} strokeWidth={2.5} />
                Accept New Route
              </motion.button>
            </div>
          </motion.div>

          {/* ── Alternative Routes ── */}
          <motion.div variants={fadeUp}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAlts(!showAlts)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Other Options
              <motion.div
                animate={{ rotate: showAlts ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showAlts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {/* Alt 1 — Auto */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center gap-4 group cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                        <Car size={18} className="text-emerald-600" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900">Auto Rickshaw Direct</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Clock size={11} /> 25 min
                          </span>
                          <span className="text-xs font-bold text-gray-900">₹80</span>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-colors"
                      >
                        Select
                      </motion.button>
                    </motion.div>

                    {/* Alt 2 — Walk + Bus */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center gap-4 group cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                        <Bus size={18} className="text-amber-600" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900">Walk + Bus #209</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Clock size={11} /> 38 min
                          </span>
                          <span className="text-xs font-bold text-gray-900">₹12</span>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-colors"
                      >
                        Select
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — Simulator Panel
           ═══════════════════════════════════════════ */}
        <motion.div variants={fadeUp} className="space-y-6">
          <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-7 space-y-5">
            {/* Simulator Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900">Disruption Simulator</h3>
                <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                  DEMO
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Inject disruptions and watch the app adapt in real time
              </p>
            </div>

            {/* Route Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Route
              </label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all appearance-none cursor-pointer"
              >
                {['Metro Line 1', 'Metro Line 2', 'Bus #308', 'Bus #340', 'Bus #209', 'All Routes'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Delay Input */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Delay (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={delayMin}
                onChange={(e) => setDelayMin(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all tabular-nums"
              />
            </div>

            {/* Severity */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Severity
              </label>
              <div className="flex gap-2">
                {([
                  { key: 'minor' as const, label: 'Minor', color: 'amber' },
                  { key: 'major' as const, label: 'Major', color: 'red' },
                  { key: 'shutdown' as const, label: 'Shutdown', color: 'red' },
                ]).map(({ key, label, color }) => {
                  const active = severity === key;
                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSeverity(key)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${active
                        ? key === 'minor'
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : key === 'major'
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-red-600 text-white border border-red-600'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Reason Chips */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Reason
              </label>
              <div className="grid grid-cols-3 gap-2">
                {severityReasons.map(({ id, label, icon: Icon }) => {
                  const active = activeReasons.includes(id);
                  return (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() =>
                        setActiveReasons((prev) =>
                          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                        )
                      }
                      className={`py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all border ${active
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                      <Icon size={16} strokeWidth={2.5} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={triggerDisruption}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Play size={16} strokeWidth={2.5} />
                Trigger Disruption
              </motion.button>

              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAll}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} strokeWidth={2.5} />
                  Clear All
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={randomize}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Shuffle size={13} strokeWidth={2.5} />
                  Randomize
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── Event Log ── */}
          <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Event Log</h3>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 max-h-[300px] overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="p-4 text-xs text-gray-400 italic text-center">
                    No active disruptions. Use controls above to simulate.
                  </p>
                ) : (
                  <div className="p-4 space-y-2">
                    {logs.map((log, i) => (
                      <motion.div
                        key={`${log.time}-${i}`}
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        className="flex items-start gap-3"
                      >
                        {/* Log type indicator */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${log.type === 'trigger'
                            ? 'bg-red-100'
                            : log.type === 'reroute'
                              ? 'bg-blue-100'
                              : 'bg-emerald-100'
                            }`}
                        >
                          {log.type === 'trigger' ? (
                            <TriangleAlert size={12} className="text-red-600" strokeWidth={2.5} />
                          ) : log.type === 'reroute' ? (
                            <TrendingUp size={12} className="text-blue-600" strokeWidth={2.5} />
                          ) : (
                            <CheckCircle2 size={12} className="text-emerald-600" strokeWidth={2.5} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 leading-relaxed">
                            {log.text}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium tabular-nums mt-0.5">
                            {log.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DisruptionsScreen;