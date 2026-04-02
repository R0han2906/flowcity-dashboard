import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MoreVertical, Plus } from 'lucide-react';
import StatBlock from '@/components/StatBlock';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const preferences = [
  { label: 'AVOID PEAK CROWDS', default: true },
  { label: 'PREFER METRO', default: true },
  { label: 'DISRUPTION ALERTS', default: true },
  { label: 'SHARE LOCATION', default: false },
];

const ProfileScreen = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(preferences.map((p) => [p.label, p.default]))
  );
  const [lang, setLang] = useState('ENGLISH');

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[960px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-6">
        <div className="w-[72px] h-[72px] bg-fc-accent border-[3px] border-fc-accent flex items-center justify-center flex-shrink-0" style={{ borderRadius: 0 }}>
          <span className="font-display text-[28px] font-extrabold text-white">RA</span>
        </div>
        <div>
          <h2 className="font-display text-[22px] font-bold text-text-primary">ROHAN ACHARYA</h2>
          <p className="font-mono-label text-xs text-text-muted-fc">MUMBAI, MAHARASHTRA</p>
          <span className="brutal-chip border-border-hard text-text-muted-fc text-[10px] mt-2 inline-block">MEMBER SINCE JAN 2026</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        <StatBlock value="87" label="TOTAL TRIPS" />
        <StatBlock value="₹2,340" label="SAVED" color="text-fc-success" />
        <StatBlock value="42 HRS" label="TIME SAVED" color="text-fc-accent" />
      </motion.div>

      {/* Saved Routes */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold uppercase text-text-primary">SAVED ROUTES</h3>
          <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { icon: '🚇', from: 'HOME', to: 'DJSCE', detail: 'METRO · MORNING', color: 'border-fc-metro' },
            { icon: '🚌', from: 'ANDHERI', to: 'BANDRA', detail: 'BUS · EVENING', color: 'border-fc-bus' },
          ].map((route, i) => (
            <div key={i} className="brutal-card p-4 flex items-center gap-4">
              <div className={`w-9 h-9 border-2 flex items-center justify-center text-lg ${route.color}`}>{route.icon}</div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-text-primary">{route.from} → {route.to}</p>
                <p className="font-mono-label text-[11px] text-text-muted-fc">{route.detail}</p>
              </div>
              <Star size={16} strokeWidth={2.5} className="text-fc-warning fill-fc-warning" />
              <MoreVertical size={16} strokeWidth={2.5} className="text-text-muted-fc" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={fadeUp}>
        <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">PREFERENCES</h3>
        <div className="space-y-3">
          {preferences.map((pref) => (
            <div key={pref.label} className="brutal-card p-4 flex items-center justify-between">
              <span className="font-mono-label text-xs text-text-primary uppercase">{pref.label}</span>
              <button
                onClick={() => setToggles((prev) => ({ ...prev, [pref.label]: !prev[pref.label] }))}
                className={`w-12 h-6 border-2 relative transition-all ${
                  toggles[pref.label] ? 'bg-fc-accent border-fc-accent' : 'bg-bg-inset border-border-hard'
                }`}
                style={{ borderRadius: 2 }}
              >
                <div
                  className={`w-4 h-4 bg-text-primary absolute top-[2px] transition-all ${
                    toggles[pref.label] ? 'right-[2px]' : 'left-[2px]'
                  }`}
                  style={{ borderRadius: 0 }}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Language */}
      <motion.div variants={fadeUp}>
        <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">LANGUAGE</h3>
        <div className="flex gap-0">
          {['ENGLISH', 'हिंदी', 'मराठी'].map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`flex-1 py-3 font-mono-label text-xs uppercase border-2 transition-all ${
                lang === l ? 'bg-fc-accent text-white border-fc-accent' : 'bg-bg-inset text-text-muted-fc border-border-hard'
              }`}
              style={{ borderRadius: 2 }}>
              {l}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={fadeUp} className="text-center pt-8 pb-4">
        <p className="font-mono-label text-[10px] text-text-muted-fc">FLOWCITY V2.0 · BUILT WITH REACT + TAILWIND</p>
        <p className="font-mono-label text-[10px] text-text-muted-fc mt-1">MADE IN MUMBAI 🇮🇳</p>
      </motion.div>
    </motion.div>
  );
};

export default ProfileScreen;
