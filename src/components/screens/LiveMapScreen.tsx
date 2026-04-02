import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const stations = [
  { name: 'ANDHERI', x: 20, y: 30 },
  { name: 'BANDRA', x: 30, y: 50 },
  { name: 'DADAR', x: 50, y: 55 },
  { name: 'BKC', x: 55, y: 40 },
  { name: 'CST', x: 70, y: 65 },
  { name: 'GHATKOPAR', x: 65, y: 35 },
];

const roads = [
  { label: 'WESTERN EXPRESS HWY', x1: 15, y1: 15, x2: 15, y2: 85 },
  { label: 'LBS MARG', x1: 60, y1: 10, x2: 60, y2: 90 },
  { label: 'SV ROAD', x1: 10, y1: 25, x2: 50, y2: 25 },
  { label: 'EASTERN FREEWAY', x1: 75, y1: 20, x2: 75, y2: 80 },
  { label: 'LINKING ROAD', x1: 25, y1: 10, x2: 25, y2: 60 },
];

const heatmapBlobs = [
  { x: 50, y: 55, size: 150, color: 'var(--danger)', opacity: 0.5, label: 'Dadar' },
  { x: 20, y: 30, size: 110, color: 'var(--warning)', opacity: 0.4, label: 'Andheri' },
  { x: 55, y: 40, size: 130, color: 'var(--success)', opacity: 0.3, label: 'BKC' },
  { x: 70, y: 65, size: 120, color: 'var(--danger)', opacity: 0.45, label: 'CST' },
  { x: 30, y: 50, size: 100, color: 'var(--success)', opacity: 0.25, label: 'Bandra' },
];

const routePath = [
  { x: 20, y: 30 }, // Andheri
  { x: 30, y: 35 },
  { x: 40, y: 38 },
  { x: 55, y: 40 }, // BKC
];

const LiveMapScreen = () => {
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'crowd' | 'disruption'>('traffic');
  const [showToast, setShowToast] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 2000);
    const t2 = setTimeout(() => setShowToast(false), 7000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const pathD = routePath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ');

  return (
    <div className="relative w-full h-[calc(100vh-80px)] lg:h-screen overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Map SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Water */}
        <rect x="0" y="0" width="8" height="100" fill="#0A0F1A" />

        {/* Major roads */}
        {roads.map((r, i) => (
          <line key={i} x1={`${r.x1}%`} y1={`${r.y1}%`} x2={`${r.x2}%`} y2={`${r.y2}%`}
            stroke="hsl(var(--border-hard))" strokeWidth="0.3" />
        ))}

        {/* Minor road grid */}
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <line x1={`${i * 10 + 5}%`} y1="0" x2={`${i * 10 + 5}%`} y2="100%" stroke="hsl(var(--border-hard))" strokeWidth="0.1" opacity="0.4" />
            <line x1="0" y1={`${i * 10 + 5}%`} x2="100%" y2={`${i * 10 + 5}%`} stroke="hsl(var(--border-hard))" strokeWidth="0.1" opacity="0.4" />
          </g>
        ))}

        {/* Route line */}
        <path d={pathD} fill="none" stroke="hsl(var(--accent))" strokeWidth="0.6"
          strokeDasharray="2 1.5" className="animate-dash" />

        {/* Origin */}
        <rect x={`${routePath[0].x - 1}%`} y={`${routePath[0].y - 1}%`} width="2%" height="2%"
          fill="hsl(var(--success))" className="animate-brutal-pulse" />
        <text x={`${routePath[0].x}%`} y={`${routePath[0].y - 2}%`}
          fill="hsl(var(--success))" fontSize="2" fontFamily="JetBrains Mono" textAnchor="middle">A</text>

        {/* Destination */}
        <rect x={`${routePath[routePath.length - 1].x - 1}%`} y={`${routePath[routePath.length - 1].y - 1}%`}
          width="2%" height="2%" fill="hsl(var(--danger))" />
        <text x={`${routePath[routePath.length - 1].x}%`} y={`${routePath[routePath.length - 1].y - 2}%`}
          fill="hsl(var(--danger))" fontSize="2" fontFamily="JetBrains Mono" textAnchor="middle">B</text>

        {/* Stations */}
        {stations.map((s) => (
          <g key={s.name}>
            <rect x={`${s.x - 0.7}%`} y={`${s.y - 0.7}%`} width="1.4%" height="1.4%"
              fill="hsl(var(--bg-elevated))" stroke="hsl(var(--accent))" strokeWidth="0.2" />
            <text x={`${s.x}%`} y={`${s.y + 2.5}%`}
              fill="hsl(var(--text-muted))" fontSize="1.5" fontFamily="JetBrains Mono" textAnchor="middle">{s.name}</text>
          </g>
        ))}
      </svg>

      {/* Heatmap blobs */}
      {heatmapBlobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${blob.x}%`, top: `${blob.y}%`,
            width: blob.size, height: blob.size,
            background: `hsl(${blob.color})`,
            transform: 'translate(-50%, -50%) rotate(45deg)',
            filter: 'blur(30px)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [blob.opacity * 0.8, blob.opacity, blob.opacity * 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Layer Toggle */}
      <div className="absolute top-4 left-4 z-20 flex bg-bg-elevated border-2 border-border-hard" style={{ boxShadow: '4px 4px 0px hsl(var(--shadow-color))', borderRadius: 4 }}>
        {(['traffic', 'crowd', 'disruption'] as const).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`px-4 py-2 font-mono-label text-[11px] uppercase border-r-2 border-border-hard last:border-r-0 transition-all ${
              activeLayer === layer ? 'bg-fc-accent text-white' : 'bg-bg-inset text-text-muted-fc'
            }`}
          >
            {layer === 'traffic' ? '🔥 TRAFFIC' : layer === 'crowd' ? '👥 CROWD' : '⚠️ DISRUPTION'}
          </button>
        ))}
      </div>

      {/* Road labels */}
      {roads.map((r, i) => (
        <div
          key={i}
          className="absolute font-mono-label text-[9px] text-text-muted-fc pointer-events-none whitespace-nowrap"
          style={{ left: `${(r.x1 + r.x2) / 2}%`, top: `${(r.y1 + r.y2) / 2}%`, transform: r.x1 === r.x2 ? 'rotate(-90deg)' : 'none' }}
        >
          {r.label}
        </div>
      ))}

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            exit={{ y: -80 }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            className="absolute top-4 left-4 right-4 z-30 bg-bg-elevated border-[3px] border-fc-danger p-4 flex items-center gap-3 cursor-pointer"
            style={{ boxShadow: '4px 4px 0px hsla(var(--danger), 0.3)', borderRadius: 4 }}
            onClick={() => setShowToast(false)}
          >
            <AlertTriangle size={20} strokeWidth={2.5} className="text-fc-danger flex-shrink-0" />
            <span className="font-mono-label text-xs text-text-primary">⚠ LINE 1 DELAYED 8 MIN — TAP TO REROUTE →</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Info Panel */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 bg-bg-elevated border-t-[3px] border-fc-accent cursor-pointer"
        style={{ borderRadius: '4px 4px 0 0' }}
        animate={{ height: panelExpanded ? '60%' : 80 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        onClick={() => setPanelExpanded(!panelExpanded)}
      >
        <div className="flex justify-center pt-2 mb-2">
          <div className="w-12 h-1 bg-border-hard" />
        </div>
        <div className="px-6">
          <p className="font-body text-sm font-semibold text-text-primary">🚇 BOARD METRO LINE 1 AT ANDHERI — PLATFORM 2</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="brutal-chip border-fc-success text-fc-success text-[10px]">ARRIVES IN 4 MIN</span>
            <span className="font-body text-xs text-text-muted-fc">THEN: 🚶 WALK 6 MIN TO BKC GATE 2</span>
          </div>
        </div>
        {panelExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 mt-4 space-y-3 overflow-y-auto"
          >
            {[
              { icon: '🚶', label: 'WALK · 4 MIN', detail: 'Head north on SV Road to Andheri Station', color: 'bg-fc-walk' },
              { icon: '🚇', label: 'METRO L1 · 18 MIN', detail: 'Board at Platform 2, exit at BKC', color: 'bg-fc-metro' },
              { icon: '🚶', label: 'WALK · 6 MIN', detail: 'Walk to BKC Gate 2', color: 'bg-fc-walk' },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 ${step.color}`} />
                  {i < 2 && <div className="w-[2px] flex-1 bg-border-hard mt-1" />}
                </div>
                <div>
                  <p className="font-mono-label text-xs text-text-primary uppercase">{step.icon} {step.label}</p>
                  <p className="font-body text-xs text-text-muted-fc">{step.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LiveMapScreen;
