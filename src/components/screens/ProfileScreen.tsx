import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MoreVertical, Plus, Train, Bus, Car, Footprints,
  Users, Bell, MapPin, Shield, Clock, Pencil, Globe,
  ChevronRight, Flame, Leaf, Zap, Award, Heart
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Animated counter
function useCounter(target: number, duration = 1.5) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = setTimeout(() => requestAnimationFrame(tick), 400);
    return () => clearTimeout(id);
  }, [target, duration]);
  return val;
}

const prefConfig = [
  { key: 'crowds', label: 'Avoid Peak Crowds', icon: Users, default: true },
  { key: 'metro', label: 'Prefer Metro', icon: Train, default: true },
  { key: 'alerts', label: 'Disruption Alerts', icon: Bell, default: true },
  { key: 'location', label: 'Share Live Location', icon: MapPin, default: false },
];

const savedRoutes = [
  { from: 'Home', to: 'DJSCE', detail: 'Morning Commute', mode: 'metro', icon: Train, color: 'blue' },
  { from: 'Andheri', to: 'Bandra', detail: 'Evening Route', mode: 'bus', icon: Bus, color: 'amber' },
];

const modeColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', dot: 'bg-blue-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', dot: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', dot: 'bg-gray-400' },
};

const ProfileScreen = () => {
  const { user } = useAuth();
  
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const prefs = Object.fromEntries(prefConfig.map((p) => [p.key, p.default]));
    if (user?.transportPrefs) {
      prefs.metro = user.transportPrefs.includes('metro');
    }
    return prefs;
  });
  const [lang, setLang] = useState('english');

  const trips = useCounter(87, 1.8);
  const saved = useCounter(2340, 1.8);
  const hours = useCounter(42, 1.8);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-[1200px] mx-auto pb-10"
    >
      {/* ─── Header ─── */}
      <motion.div variants={fadeUp} className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Profile</h1>
        <p className="text-gray-500 font-medium">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ═══════════════════════════════════════════
            LEFT COLUMN — Profile & Routes
           ═══════════════════════════════════════════ */}
        <div className="xl:col-span-2 space-y-6">

          {/* ── Profile Card ── */}
          <motion.div
            variants={fadeUp}
            className="bg-[#1b3a2a] rounded-[28px] p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-5">
              {/* Avatar */}
              <div className="w-[72px] h-[72px] rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[28px] font-bold text-white tracking-tight">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'RA'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white tracking-tight">{user?.name || 'Rohan Acharya'}</h2>
                <p className="text-sm text-white/60 font-medium mt-0.5">{user?.city || 'Mumbai, Maharashtra'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white/70 tracking-wider uppercase">
                    Member since {user?.joinDate || 'Jan 2026'}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <Pencil size={16} className="text-white/70" />
              </motion.button>
            </div>
          </motion.div>

          {/* ── Stats Row ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
            {[
              { value: trips, label: 'Total Trips', icon: Award, color: 'text-gray-900', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
              { value: `₹${saved.toLocaleString()}`, label: 'Total Saved', icon: Heart, color: 'text-emerald-600', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
              { value: `${hours} hrs`, label: 'Time Saved', icon: Clock, color: 'text-blue-600', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3`}>
                  <stat.icon size={18} className={stat.iconColor} strokeWidth={2.5} />
                </div>
                <p className={`text-2xl font-bold ${stat.color} tabular-nums tracking-tight`}>
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Saved Routes ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Saved Routes</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} className="text-gray-500" strokeWidth={2.5} />
              </motion.button>
            </div>

            <div className="space-y-3">
              {savedRoutes.map((route, i) => {
                const c = modeColors[route.color];
                const Icon = route.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative p-4 rounded-2xl ${c.bg} border ${c.border} cursor-pointer group overflow-hidden transition-shadow hover:shadow-md`}
                  >
                    {/* Left accent bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.dot} rounded-r-full`} />

                    <div className="flex items-center gap-3 ml-2">
                      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={c.text} strokeWidth={2.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900">
                          {route.from}
                          <span className="text-gray-400 font-normal mx-1.5">→</span>
                          {route.to}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
                            <Icon size={10} strokeWidth={3} />
                            {route.mode}
                          </span>
                          <span className="text-xs font-medium text-gray-500">{route.detail}</span>
                        </div>
                      </div>

                      <Star size={16} className="text-amber-400 fill-amber-400 flex-shrink-0" strokeWidth={2.5} />
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — Preferences
           ═══════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* ── Preferences ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Preferences</h3>

            <div className="space-y-3">
              {prefConfig.map((pref) => {
                const active = toggles[pref.key];
                const Icon = pref.icon;
                return (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-blue-50' : 'bg-gray-100'} transition-colors`}>
                        <Icon
                          size={16}
                          strokeWidth={2.5}
                          className={active ? 'text-blue-600' : 'text-gray-400'}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{pref.label}</span>
                    </div>

                    {/* Custom toggle switch */}
                    <motion.button
                      onClick={() => setToggles((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                      className={`relative w-12 h-7 rounded-full border-2 transition-colors ${active
                        ? 'bg-[#1b3a2a] border-[#1b3a2a]'
                        : 'bg-gray-200 border-gray-200'
                        }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm ${active ? 'left-[22px]' : 'left-[2px]'
                          }`}
                      />
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Language ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <Globe size={18} className="text-gray-400" strokeWidth={2.5} />
              <h3 className="font-bold text-lg text-gray-900">Language</h3>
            </div>

            <div className="flex gap-2">
              {[
                { key: 'english', label: 'English' },
                { key: 'hindi', label: 'हिंदी' },
                { key: 'marathi', label: 'मराठी' },
              ].map((l) => {
                const active = lang === l.key;
                return (
                  <motion.button
                    key={l.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLang(l.key)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${active
                      ? 'bg-[#1b3a2a] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    {l.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Achievements Card ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-5">Achievements</h3>

            <div className="space-y-4">
              {[
                { icon: Flame, color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', title: '7-Day Streak', desc: 'Public transit every weekday' },
                { icon: Leaf, color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', title: '8.2 kg CO₂ Saved', desc: 'This month vs. driving' },
                { icon: Zap, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', title: 'Speed Demon', desc: 'Avg 26 min — 4 min faster than city avg' },
              ].map((a, i) => (
                <div key={i} className={`p-4 rounded-2xl ${a.bg} border ${a.border} flex items-start gap-3`}>
                  <div className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center flex-shrink-0`}>
                    <a.icon size={16} className={a.text} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${a.text}`}>{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ── */}
          <motion.div variants={fadeUp} className="text-center pt-4 pb-2">
            <p className="text-[11px] text-gray-400 font-medium">
              FlowCity v2.0 · Built with Next.js
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Made in Mumbai 🇮🇳
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileScreen;