import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Flag, ArrowUpDown, Zap, IndianRupee, Users } from 'lucide-react';
import SegmentBar from '@/components/SegmentBar';
import { routeResults } from '@/lib/mock-data';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const PlannerScreen = () => {
  const [timeMode, setTimeMode] = useState<'now' | 'depart' | 'arrive'>('now');
  const [speed, setSpeed] = useState(70);
  const [cost, setCost] = useState(50);
  const [comfort, setComfort] = useState(30);
  const [modes, setModes] = useState({ metro: true, bus: true, auto: true, walk: true });
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  const highest = speed >= cost && speed >= comfort ? 'SPEED' : cost >= comfort ? 'COST' : 'COMFORT';
  const highColor = highest === 'SPEED' ? 'text-fc-accent' : highest === 'COST' ? 'text-fc-success' : 'text-fc-warning';

  const badgeStyles: Record<string, string> = {
    accent: 'bg-fc-accent text-white',
    success: 'bg-fc-success text-white',
    muted: 'bg-bg-inset text-text-secondary border-2 border-border-hard',
  };
  const crowdColors: Record<string, string> = { HIGH: 'text-fc-warning', MODERATE: 'text-fc-warning', LOW: 'text-fc-success' };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[960px] mx-auto px-6 lg:px-12 py-8 space-y-10">
      <motion.h2 variants={fadeUp} className="font-display text-[28px] font-extrabold uppercase text-text-primary tracking-tight">ROUTE PLANNER</motion.h2>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Left: Form */}
        <motion.div variants={fadeUp} className="space-y-6">
          {/* Search Card */}
          <div className="bg-bg-elevated border-[3px] border-border-hard p-6" style={{ boxShadow: '6px 6px 0px hsl(var(--shadow-color))', borderRadius: 4 }}>
            <h3 className="font-display text-lg font-bold uppercase text-text-primary mb-6">PLAN YOUR ROUTE</h3>

            {/* Origin */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 border-2 border-fc-accent flex items-center justify-center flex-shrink-0">
                <MapPin size={20} strokeWidth={2.5} className="text-fc-accent" />
              </div>
              <input className="brutal-input w-full px-4 py-3" defaultValue="Andheri Station" placeholder="Enter origin..." />
            </div>

            {/* Connector */}
            <div className="flex items-center justify-center h-8 relative">
              <div className="border-l-[3px] border-dotted border-border-hard h-full" />
              <button className="absolute right-0 w-10 h-10 bg-bg-inset border-2 border-border-hard brutal-btn flex items-center justify-center">
                <ArrowUpDown size={18} strokeWidth={2.5} className="text-text-secondary" />
              </button>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 border-2 border-fc-danger flex items-center justify-center flex-shrink-0">
                <Flag size={20} strokeWidth={2.5} className="text-fc-danger" />
              </div>
              <input className="brutal-input w-full px-4 py-3" defaultValue="BKC, Mumbai" placeholder="Enter destination..." />
            </div>

            {/* Time */}
            <div className="flex mt-6">
              {(['now', 'depart', 'arrive'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTimeMode(m)}
                  className={`flex-1 py-3 font-mono-label text-xs uppercase border-2 transition-all ${
                    timeMode === m
                      ? 'bg-fc-accent text-white border-fc-accent'
                      : 'bg-bg-inset text-text-muted-fc border-border-hard'
                  }`}
                  style={{ borderRadius: 2 }}
                >
                  {m === 'now' ? 'NOW' : m === 'depart' ? 'DEPART AT' : 'ARRIVE BY'}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="brutal-card p-6">
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">ROUTE PREFERENCES</h3>
            <div className="space-y-5">
              {[
                { icon: Zap, label: 'SPEED', value: speed, set: setSpeed, color: 'accent' },
                { icon: IndianRupee, label: 'COST', value: cost, set: setCost, color: '[--slider-color:hsl(var(--success))]' },
                { icon: Users, label: 'COMFORT', value: comfort, set: setComfort, color: '[--slider-color:hsl(var(--bus))]' },
              ].map(({ icon: Icon, label, value, set, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <Icon size={16} strokeWidth={2.5} className="text-text-secondary flex-shrink-0" />
                  <span className="font-mono-label text-xs uppercase text-text-secondary w-16 flex-shrink-0">{label}</span>
                  <input
                    type="range" min={0} max={100} value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="flex-1 h-[6px] appearance-none bg-bg-inset border border-border-hard cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-text-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-border-hard [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ borderRadius: 0 }}
                  />
                  <span className={`font-mono-label text-sm font-bold w-10 text-right ${label === 'SPEED' ? 'text-fc-accent' : label === 'COST' ? 'text-fc-success' : 'text-fc-warning'}`}>{value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-bg-inset border-2 border-border-hard p-3">
              <span className={`font-mono-label text-xs ${highColor}`}>⚡ PRIORITIZING: {highest}</span>
            </div>

            {/* Mode filters */}
            <div className="flex gap-2 mt-4">
              {(['metro', 'bus', 'auto', 'walk'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModes((prev) => ({ ...prev, [m]: !prev[m] }))}
                  className={`flex-1 py-2 font-mono-label text-[10px] uppercase border-2 transition-all ${
                    modes[m] ? 'border-fc-accent bg-fc-accent/10 text-fc-accent' : 'border-border-hard bg-bg-inset text-text-muted-fc line-through'
                  }`}
                  style={{ borderRadius: 2 }}
                >
                  {{ metro: '🚇 METRO', bus: '🚌 BUS', auto: '🛺 AUTO', walk: '🚶 WALK' }[m]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Results */}
        <motion.div variants={fadeUp} className="space-y-4 mt-8 lg:mt-0">
          <div className="flex justify-between items-center">
            <span className="font-mono-label text-[11px] text-text-muted-fc">3 ROUTES FOUND</span>
            <span className="font-mono-label text-[11px] text-fc-accent">SORT: FASTEST ▾</span>
          </div>

          {routeResults.map((route) => (
            <div key={route.id} className="brutal-card p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`brutal-chip ${badgeStyles[route.badgeColor]}`} style={{ boxShadow: 'none' }}>{route.badge}</span>
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-text-primary">{route.totalTime} MIN</span>
                  <span className="font-mono-label text-sm text-text-muted-fc ml-2">· ₹{route.cost}</span>
                </div>
              </div>

              <SegmentBar segments={route.segments} />

              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="brutal-chip bg-bg-inset">{route.segments.length} LEGS</span>
                <span className={`brutal-chip bg-bg-inset ${crowdColors[route.crowd]}`}>👥 {route.crowd}</span>
                <span className="brutal-chip bg-bg-inset">CONF: {route.confidence}%</span>
              </div>

              <button
                onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                className="w-full mt-4 py-3 bg-bg-inset border-2 border-fc-accent text-fc-accent font-display text-sm font-bold uppercase brutal-btn"
                style={{ borderRadius: 2 }}
              >
                {expandedRoute === route.id ? 'COLLAPSE' : 'SELECT THIS ROUTE →'}
              </button>

              {expandedRoute === route.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 border-t-2 border-border-hard pt-4"
                >
                  {route.segments.map((seg, i) => (
                    <div key={i} className="flex gap-3 mb-3 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-2 h-2 ${seg.mode === 'metro' ? 'bg-fc-metro' : seg.mode === 'bus' ? 'bg-fc-bus' : seg.mode === 'auto' ? 'bg-fc-auto' : 'bg-fc-walk'}`} />
                        {i < route.segments.length - 1 && <div className="w-[2px] flex-1 bg-border-hard mt-1" />}
                      </div>
                      <div>
                        <p className="font-mono-label text-xs text-text-primary uppercase">{seg.label}</p>
                        <p className="font-body text-xs text-text-muted-fc mt-0.5">{seg.detail}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          ))}

          {/* Comparison Table (Desktop) */}
          <div className="hidden lg:block brutal-card overflow-hidden">
            <table className="w-full font-mono-label text-xs">
              <thead>
                <tr className="bg-bg-inset">
                  {['ROUTE', 'TIME', 'COST', 'LEGS', 'CROWD', 'CONF'].map((h) => (
                    <th key={h} className="p-3 text-left text-text-muted-fc uppercase border-2 border-border-hard">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routeResults.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-bg-elevated' : 'bg-bg-inset'}>
                    <td className="p-3 border-2 border-border-hard text-text-primary">{r.badge}</td>
                    <td className="p-3 border-2 border-border-hard text-text-primary">{r.totalTime}m</td>
                    <td className="p-3 border-2 border-border-hard text-text-primary">₹{r.cost}</td>
                    <td className="p-3 border-2 border-border-hard text-text-primary">{r.segments.length}</td>
                    <td className={`p-3 border-2 border-border-hard ${crowdColors[r.crowd]}`}>{r.crowd}</td>
                    <td className="p-3 border-2 border-border-hard text-fc-success">{r.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlannerScreen;
