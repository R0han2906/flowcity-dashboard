import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import SegmentBar from '@/components/SegmentBar';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const severityReasons = ['🔧 SIGNAL', '🚗 ACCIDENT', '✊ STRIKE', '🌧 WEATHER', '🎪 EVENT', '🔌 POWER'];

const DisruptionsScreen = () => {
  const [showAlts, setShowAlts] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('Metro Line 1');
  const [delayMin, setDelayMin] = useState(15);
  const [severity, setSeverity] = useState<'minor' | 'major' | 'shutdown'>('major');
  const [activeReasons, setActiveReasons] = useState<string[]>(['🔧 SIGNAL']);
  const [logs, setLogs] = useState([
    '09:14:22 — 🔴 TRIGGERED: METRO L1 +18 MIN — SIGNAL FAILURE',
    '09:14:22 — 🔄 REROUTE: BUS #340 SUGGESTED (+9 MIN)',
  ]);

  const triggerDisruption = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [
      `${now} — 🔴 TRIGGERED: ${selectedRoute.toUpperCase()} +${delayMin} MIN — ${activeReasons.join(', ')}`,
      `${now} — 🔄 REROUTE CALCULATED`,
      ...prev,
    ]);
  };

  const clearAll = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [`${now} — ✅ ALL DISRUPTIONS CLEARED`, ...prev]);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[960px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      <motion.h2 variants={fadeUp} className="font-display text-[28px] font-extrabold uppercase text-text-primary">DISRUPTIONS & REROUTE</motion.h2>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Alert Banner */}
          <motion.div variants={fadeUp} className="bg-bg-elevated border-[3px] border-fc-danger p-6 relative" style={{ boxShadow: '6px 6px 0px hsla(var(--danger), 0.2)', borderRadius: 4 }}>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={28} strokeWidth={2.5} className="text-fc-danger" />
              <h3 className="font-display text-2xl font-extrabold text-fc-danger uppercase">ROUTE DISRUPTED</h3>
            </div>
            <p className="font-body text-sm text-text-primary mb-1">METRO LINE 1 — DELAYED 18 MIN — SIGNAL FAILURE AT GHATKOPAR</p>
            <p className="font-mono-label text-[11px] text-text-muted-fc">REPORTED 3 MIN AGO · SOURCE: MUMBAI METRO RAIL CORP</p>
            <div className="mt-4 h-[6px] bg-bg-inset"><div className="h-full bg-fc-danger" style={{ width: '80%' }} /></div>
          </motion.div>

          {/* Original Route */}
          <motion.div variants={fadeUp} className="bg-bg-elevated/50 border-2 border-dashed border-border-hard p-6" style={{ borderRadius: 4 }}>
            <span className="brutal-chip bg-fc-danger text-white mb-3 inline-block">❌ AFFECTED</span>
            <p className="font-display text-sm text-text-muted-fc line-through">ANDHERI → GHATKOPAR → BKC VIA METRO</p>
            <p className="font-mono-label text-xs text-text-muted-fc line-through mt-1">WAS 22 MIN · ₹30</p>
            <div className="mt-3 opacity-40">
              <SegmentBar segments={[
                { mode: 'walk', duration: 4, label: 'WALK', detail: '' },
                { mode: 'metro', duration: 18, label: 'METRO', detail: '' },
              ]} showLabels={false} />
            </div>
          </motion.div>

          {/* Suggested Reroute */}
          <motion.div
            variants={fadeUp}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
            className="bg-bg-elevated border-[3px] border-fc-accent p-6"
            style={{ boxShadow: '6px 6px 0px hsla(var(--accent), 0.15)', borderRadius: 4 }}
          >
            <span className="brutal-chip bg-fc-accent text-white mb-3 inline-block">✨ SUGGESTED</span>
            <p className="font-display text-lg font-bold text-text-primary">ANDHERI → BKC VIA BUS #340 + WALK</p>
            <div className="mt-3">
              <SegmentBar segments={[
                { mode: 'bus', duration: 22, label: 'BUS #340 · 22M', detail: '' },
                { mode: 'walk', duration: 9, label: 'WALK · 9M', detail: '' },
              ]} />
            </div>
            <p className="font-display text-lg font-bold text-text-primary mt-3">31 MIN · ₹22</p>

            <div className="mt-4 bg-bg-inset border-2 border-border-hard p-4 flex items-center gap-3">
              <Clock size={16} strokeWidth={2.5} className="text-fc-warning" />
              <TrendingUp size={16} strokeWidth={2.5} className="text-fc-success" />
              <span className="font-mono-label text-xs text-text-secondary">+9 MIN LONGER — BUT AVOIDS 18 MIN DISRUPTION WAIT</span>
            </div>

            <button className="w-full mt-4 py-3 bg-fc-accent text-white font-display text-sm font-bold uppercase brutal-btn-primary">
              ✓ ACCEPT NEW ROUTE
            </button>
          </motion.div>

          {/* Alt Routes */}
          <motion.div variants={fadeUp}>
            <button onClick={() => setShowAlts(!showAlts)} className="font-display text-sm font-bold text-text-secondary uppercase">
              OTHER OPTIONS {showAlts ? '▴' : '▾'}
            </button>
            {showAlts && (
              <div className="mt-3 space-y-3">
                <div className="brutal-card p-4 flex items-center justify-between">
                  <span className="font-body text-sm text-text-primary">🛺 AUTO DIRECT · 25 MIN · ₹80</span>
                  <button className="brutal-btn px-4 py-2 font-mono-label text-xs text-text-secondary bg-bg-inset">SELECT</button>
                </div>
                <div className="brutal-card p-4 flex items-center justify-between">
                  <span className="font-body text-sm text-text-primary">🚶 WALK + 🚌 BUS #209 · 38 MIN · ₹12</span>
                  <button className="brutal-btn px-4 py-2 font-mono-label text-xs text-text-secondary bg-bg-inset">SELECT</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Simulator Panel */}
        <motion.div variants={fadeUp} className="mt-8 lg:mt-0 brutal-card p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold uppercase text-text-primary">🎛 DISRUPTION SIMULATOR</h3>
            <span className="brutal-chip bg-fc-warning text-white text-[9px]">DEMO MODE</span>
          </div>
          <p className="font-mono-label text-[11px] text-text-muted-fc">Inject disruptions. Watch the app adapt.</p>

          {/* Route selector */}
          <div>
            <label className="font-mono-label text-[10px] text-text-muted-fc uppercase block mb-1">ROUTE</label>
            <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}
              className="brutal-input w-full px-3 py-2 font-mono-label text-[13px]">
              {['Metro Line 1', 'Metro Line 2', 'Bus #308', 'Bus #340', 'Bus #209', 'All Routes'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Delay */}
          <div>
            <label className="font-mono-label text-[10px] text-text-muted-fc uppercase block mb-1">DELAY (MIN)</label>
            <input type="number" min={1} max={60} value={delayMin} onChange={(e) => setDelayMin(Number(e.target.value))}
              className="brutal-input w-full px-3 py-2 font-mono-label text-[13px]" />
          </div>

          {/* Severity */}
          <div>
            <label className="font-mono-label text-[10px] text-text-muted-fc uppercase block mb-1">SEVERITY</label>
            <div className="flex gap-0">
              {(['minor', 'major', 'shutdown'] as const).map((s) => (
                <button key={s} onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 font-mono-label text-[10px] uppercase border-2 ${
                    severity === s
                      ? s === 'minor' ? 'bg-fc-warning text-white border-fc-warning' : 'bg-fc-danger text-text-primary border-fc-danger'
                      : 'bg-bg-inset text-text-muted-fc border-border-hard'
                  }`} style={{ borderRadius: 0 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reason chips */}
          <div>
            <label className="font-mono-label text-[10px] text-text-muted-fc uppercase block mb-1">REASON</label>
            <div className="grid grid-cols-3 gap-2">
              {severityReasons.map((r) => (
                <button key={r}
                  onClick={() => setActiveReasons((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])}
                  className={`py-2 font-mono-label text-[10px] border-2 ${
                    activeReasons.includes(r) ? 'border-fc-accent bg-fc-accent/10 text-fc-accent' : 'border-border-hard bg-bg-inset text-text-muted-fc'
                  }`} style={{ borderRadius: 2 }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <button onClick={triggerDisruption} className="w-full py-3 brutal-btn-danger font-display text-sm font-bold uppercase">
            🔴 TRIGGER DISRUPTION
          </button>
          <div className="flex gap-2">
            <button onClick={clearAll} className="flex-1 py-2 brutal-btn bg-bg-inset font-mono-label text-xs text-text-secondary uppercase">✅ CLEAR ALL</button>
            <button onClick={triggerDisruption} className="flex-1 py-2 brutal-btn bg-bg-inset font-mono-label text-xs text-text-secondary uppercase">🎲 RANDOMIZE</button>
          </div>

          {/* Event Log */}
          <div className="bg-bg-base border-2 border-border-hard p-3 max-h-[280px] overflow-y-auto" style={{ borderRadius: 4 }}>
            {logs.length === 0 ? (
              <p className="font-mono-label text-[11px] text-text-muted-fc italic">NO ACTIVE DISRUPTIONS. USE CONTROLS ABOVE.</p>
            ) : (
              logs.map((log, i) => (
                <motion.p key={`${log}-${i}`}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="font-mono-label text-[11px] text-text-secondary mb-1">{log}</motion.p>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DisruptionsScreen;
