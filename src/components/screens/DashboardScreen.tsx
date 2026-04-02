import { motion } from 'framer-motion';
import { Bell, AlertTriangle } from 'lucide-react';
import SegmentBar from '@/components/SegmentBar';
import StatBlock from '@/components/StatBlock';
import { savedRoutes, activeJourneySegments, disruptions } from '@/lib/mock-data';
import { MODE_BORDER_COLORS, MODE_ICONS } from '@/lib/constants';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

interface Props { onNavigate: (screen: string) => void; }

const DashboardScreen = ({ onNavigate }: Props) => {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[960px] mx-auto px-6 lg:px-12 py-8 space-y-10">
      {/* Top Bar */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div className="lg:hidden">
          <h1 className="font-display text-[24px] font-extrabold uppercase text-fc-accent">FLOWCITY</h1>
          <p className="font-mono-label text-[11px] text-text-muted-fc uppercase">Mumbai Transit Intelligence</p>
        </div>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-4">
          <span className="font-mono-label text-sm text-text-secondary">09:41</span>
          <div className="brutal-chip bg-bg-inset">31°C · HUMID</div>
          <button className="relative p-2">
            <Bell size={20} strokeWidth={2.5} className="text-text-secondary" />
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-fc-danger text-bg-base font-mono-label text-[10px] flex items-center justify-center" style={{ borderRadius: 0 }}>3</span>
          </button>
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-[28px] font-extrabold uppercase text-text-primary tracking-tight">GOOD MORNING, ROHAN.</h2>
        <p className="font-mono-label text-xs text-text-muted-fc mt-1">Thursday, 27 March 2026</p>
        <div className="w-full h-[3px] bg-fc-accent mt-4" />
      </motion.div>

      {/* Active Journey Hero Card */}
      <motion.div variants={fadeUp} className="brutal-card-hero p-6 cursor-pointer" onClick={() => onNavigate('map')}>
        <div className="flex items-center justify-between mb-4">
          <span className="brutal-chip bg-fc-danger text-bg-base border-fc-danger animate-brutal-pulse" style={{ boxShadow: '2px 2px 0px hsl(var(--shadow-color))' }}>LIVE</span>
          <span className="font-mono-label text-xs text-text-muted-fc">TAP TO VIEW MAP →</span>
        </div>
        <h3 className="font-display text-[22px] font-bold text-text-primary mb-4">ANDHERI → BKC</h3>
        <div className="flex items-end gap-2 mb-6">
          <span className="font-display text-[56px] font-extrabold text-fc-success leading-none">28</span>
          <div className="pb-2">
            <span className="font-mono-label text-sm text-text-muted-fc block">MIN</span>
            <span className="font-mono-label text-xs text-text-secondary">ETA 09:18 AM</span>
          </div>
        </div>
        <SegmentBar segments={activeJourneySegments} />
        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-border-hard">
          <span className="brutal-chip border-fc-success text-fc-success" style={{ background: 'hsla(var(--success), 0.1)', boxShadow: '2px 2px 0px hsl(var(--shadow-color))' }}>■ ON TIME</span>
          <div className="flex items-center gap-2">
            <span className="font-mono-label text-xs text-text-secondary">CONFIDENCE: 87%</span>
            <div className="w-10 h-2 bg-bg-inset border border-border-hard">
              <div className="h-full bg-fc-success" style={{ width: '87%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Saved Routes */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold uppercase text-text-primary">SAVED ROUTES</h3>
          <button className="font-mono-label text-[11px] text-fc-accent uppercase">VIEW ALL →</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          {savedRoutes.map((route) => (
            <div key={route.id} className="brutal-card p-5 min-w-[220px] flex-shrink-0 relative overflow-hidden cursor-pointer" style={{ scrollSnapAlign: 'start' }}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${MODE_BORDER_COLORS[route.mode].replace('border-', 'bg-')}`} />
              <p className="font-display text-sm font-bold text-text-primary">{route.from} → {route.to}</p>
              <span className="brutal-chip text-[10px] mt-2 inline-block bg-bg-inset">{route.modeLabel}</span>
              <div className="flex justify-between mt-3">
                <span className="font-display text-sm font-bold text-text-primary">{route.duration} MIN</span>
                <span className="font-mono-label text-sm text-text-muted-fc">₹{route.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Today's Stats */}
      <motion.div variants={fadeUp}>
        <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">TODAY'S NUMBERS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBlock value="₹47" label="SAVED VS DRIVING" color="text-fc-success" />
          <StatBlock value="12 MIN" label="FASTER THAN AVG" color="text-fc-accent" />
          <StatBlock value="3" label="TRIPS COMPLETED" />
        </div>
      </motion.div>

      {/* Live Disruptions */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-display text-sm font-bold uppercase text-text-primary">LIVE DISRUPTIONS</h3>
          <div className="w-2 h-2 bg-fc-danger animate-brutal-pulse" />
        </div>
        <div className="space-y-3">
          {disruptions.map((d) => (
            <button
              key={d.id}
              onClick={() => onNavigate('alerts')}
              className={`w-full brutal-card p-4 flex items-center gap-4 text-left ${d.type === 'cancellation' ? 'border-fc-danger' : 'border-fc-warning'}`}
              style={{ boxShadow: `4px 4px 0px ${d.type === 'cancellation' ? 'hsla(var(--danger), 0.3)' : 'hsla(var(--warning), 0.3)'}` }}
            >
              <div className={`w-9 h-9 border-2 flex items-center justify-center ${d.type === 'cancellation' ? 'border-fc-danger' : 'border-fc-warning'}`}>
                <AlertTriangle size={20} strokeWidth={2.5} className={d.type === 'cancellation' ? 'text-fc-danger' : 'text-fc-warning'} />
              </div>
              <span className="font-body text-[13px] text-text-primary flex-1">
                {d.route} — {d.type === 'delay' ? `DELAYED ${d.delay} MIN` : 'CANCELLED — TAP TO REROUTE'}
              </span>
              <span className="text-text-muted-fc">→</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Carbon Widget */}
      <motion.div variants={fadeUp} className="w-full bg-bg-inset border-2 border-border-hard p-4">
        <span className="font-mono-label text-[11px] text-fc-success">🌱 YOU'VE SAVED 2.4 KG CO₂ THIS WEEK VS DRIVING</span>
      </motion.div>
    </motion.div>
  );
};

export default DashboardScreen;
