import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Train, Bus, Car, Footprints,
  AlertTriangle, Calendar, Shield, TrendingUp, Clock, CheckCircle2,
  XCircle, Users, Trash2, Shuffle, Play, TriangleAlert
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { journeyHistory, weeklyTrips } from '@/lib/mock-data';
import { MODE_ICONS, MODE_BORDER_COLORS } from '@/lib/constants';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const statusColors: Record<string, string> = {
  'on-time': 'bg-fc-success',
  delayed: 'bg-fc-warning',
  disrupted: 'bg-fc-danger',
};

const modeBarColors: Record<string, string> = {
  metro: '#3B82F6',
  bus: '#FACC15',
  walk: '#A1A1AA',
  auto: '#22C55E',
};

// Filter configuration with icons
const filterConfig = [
  { id: 'ALL', icon: null, label: 'ALL' },
  { id: 'METRO', icon: Train, label: 'METRO' },
  { id: 'BUS', icon: Bus, label: 'BUS' },
  { id: 'AUTO', icon: Car, label: 'AUTO' },
  { id: 'DISRUPTED', icon: AlertTriangle, label: 'DISRUPTED' },
  { id: 'THIS_WEEK', icon: Calendar, label: 'THIS WEEK' },
];

const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  time: 22 + Math.random() * 16,
}));
const costData = [
  { name: 'Metro', value: 540, color: '#3B82F6' },
  { name: 'Bus', value: 180, color: '#FACC15' },
  { name: 'Auto', value: 120, color: '#22C55E' },
];

// Number counter hook
function useNumberCounter(target: number, duration = 1.5) {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, done]);

  return display;
}

const HistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);

  // Animated stats
  const totalTrips = useNumberCounter(32, 1.8);
  const totalCost = useNumberCounter(840, 1.8);
  const totalTimeSaved = useNumberCounter(4.2, 1.8);

  // Filtered journey list
  const filteredJourneys = journeyHistory.filter((j) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DISRUPTED') return j.status === 'disrupted';
    if (activeFilter === 'THIS_WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(j.date) >= weekAgo;
    }
    const modeKey = activeFilter.toLowerCase() as keyof typeof modeBarColors;
    return j.mode === modeKey;
  });

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
          Journey History
        </h1>
        <p className="text-gray-500 font-medium">
          Track your commutes and analyze your travel patterns
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ═══════════════════════════════════════════
            LEFT COLUMN — History List & Filters
           ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <motion.div
            variants={fadeUp}
            className="bg-white border-[3px] border-border-hard p-6 rounded-[28px] shadow-sm"
            style={{ boxShadow: '6px 6px 0px hsl(var(--shadow-color))' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <h3 className="font-display text-lg font-bold uppercase text-text-primary">MARCH 2026</h3>
                <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex gap-2">
                <span className="brutal-chip bg-bg-inset border-2 border-border-hard text-[10px] text-text-muted-fc">
                  THIS MONTH
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="font-display text-[32px] font-extrabold text-text-primary tabular-nums">
                  {totalTrips}
                </div>
                <p className="font-mono-label text-[10px] text-text-muted-fc">TRIPS</p>
              </div>
              <div className="text-center">
                <div className="font-display text-[32px] font-extrabold text-fc-warning tabular-nums">
                  {totalCost}
                </div>
                <p className="font-mono-label text-[10px] text-text-muted-fc">SPENT</p>
              </div>
              <div className="text-center">
                <div className="font-display text-[32px] font-extrabold text-fc-success tabular-nums">
                  {totalTimeSaved}
                </div>
                <p className="font-mono-label text-[10px] text-text-muted-fc">HRS SAVED</p>
              </div>
            </div>

            {/* Weekly Trips Bar Chart */}
            <div className="h-[160px] bg-bg-base border-2 border-border-hard p-2 rounded-[4px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrips}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
                    domain={[0, 6]}
                  />
                  <Bar
                    dataKey="trips"
                    radius={0}
                    stroke="none"
                    animationDuration={800}
                  >
                    {weeklyTrips.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={modeBarColors[entry.mode] || '#3B82F6'}
                        animationDuration={800}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex gap-[3px] w-full h-[10px]">
              <div className="bg-fc-metro h-full" style={{ width: '60%' }} />
              <div className="bg-fc-bus h-full" style={{ width: '30%' }} />
              <div className="bg-fc-walk h-full" style={{ width: '10%' }} />
            </div>
            <div className="flex gap-4 mt-1">
              <span className="font-mono-label text-[10px] text-text-muted-fc">🚇 60%</span>
              <span className="font-mono-label text-[10px] text-text-muted-fc">🚌 30%</span>
              <span className="font-mono-label text-[10px] text-text-muted-fc">🚶 10%</span>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={fadeUp}
            className="flex gap-2 overflow-x-auto hide-scrollbar"
          >
            {filterConfig.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`brutal-chip flex-shrink-0 ${activeFilter === f.id
                  ? 'border-fc-accent bg-fc-accent/10 text-fc-accent'
                  : 'border-border-hard bg-bg-inset text-text-muted-fc'
                  }`}
              >
                {f.icon && (
                  <f.icon size={14} strokeWidth={2.5} className="mr-1.5" />
                )}
                <span className="font-bold text-[10px] uppercase tracking-wider">
                  {f.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Journey List */}
          <motion.div
            variants={fadeUp}
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredJourneys.map((j, idx) => {
                const ModeIcon = MODE_ICONS[j.mode];
                return (
                  <motion.div
                    key={j.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="brutal-card p-4 flex items-center gap-4 cursor-pointer relative"
                  >
                    {/* Status indicator */}
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusColors[j.status]}`} />

                    {/* Mode icon */}
                    <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${MODE_BORDER_COLORS[j.mode]} text-lg`}>
                      <ModeIcon size={18} strokeWidth={2.5} />
                    </div>

                    {/* Journey details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-text-primary truncate">
                        {j.from} → {j.to}
                      </p>
                      <p className="font-mono-label text-[11px] text-text-muted-fc">
                        {j.modeLabel}
                      </p>
                      <p className="font-mono-label text-[11px] text-text-muted-fc">
                        {j.date}, {j.time}
                      </p>
                    </div>

                    {/* Right info */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-body text-sm font-bold text-text-primary tabular-nums">
                        {j.duration} MIN
                      </p>
                      <p className="font-mono-label text-xs text-text-muted-fc">
                        ₹{j.cost}
                      </p>
                      {j.rerouted && (
                        <span className="font-mono-label text-[9px] text-fc-warning uppercase">
                          Rerouted
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — Analytics
           ═══════════════════════════════════════════ */}
        <div className="hidden lg:block space-y-6 mt-0">
          {/* Trend Chart */}
          <motion.div
            variants={fadeUp}
            className="brutal-card p-6"
          >
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">
              30-DAY COMMUTE TREND
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="time"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.08}
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div
            variants={fadeUp}
            className="brutal-card p-6"
          >
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">
              COST BREAKDOWN
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    strokeWidth={2}
                    stroke="hsl(0 0% 8%)"
                    animationDuration={1000}
                  >
                    {costData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} animationDuration={1000} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-2">
              {costData.map((d) => (
                <span key={d.name} className="font-mono-label text-[10px] text-text-muted-fc">
                  <span
                    className="inline-block w-2 h-2 mr-1 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name} ₹{d.value}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            variants={fadeUp}
            className="brutal-card p-6 space-y-3"
          >
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-2">
              ACHIEVEMENTS
            </h3>
            <p className="font-mono-label text-xs text-fc-warning">
              🔥 7-DAY STREAK — PUBLIC TRANSIT EVERY WEEKDAY
            </p>
            <p className="font-mono-label text-xs text-fc-success">
              🌱 8.2 KG CO₂ SAVED THIS MONTH
            </p>
            <p className="font-mono-label text-xs text-fc-accent">
              ⚡ AVG COMMUTE: 26 MIN (4 MIN {'<'} CITY AVG)
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryScreen;