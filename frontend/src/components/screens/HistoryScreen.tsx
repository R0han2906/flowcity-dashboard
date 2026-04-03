// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft, ChevronRight, Train, Bus, Car, Footprints,
//   AlertTriangle, Calendar, Shield, TrendingUp, Clock, CheckCircle2,
//   XCircle, Users, Trash2, Shuffle, Play, TriangleAlert
// } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
// import { journeyHistory, weeklyTrips } from '@/lib/mock-data';
// import { MODE_ICONS, MODE_BORDER_COLORS } from '@/lib/constants';

// const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
// const fadeUp = {
//   hidden: { opacity: 0, y: 15 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
// };

// const statusColors: Record<string, string> = {
//   'on-time': 'bg-fc-success',
//   delayed: 'bg-fc-warning',
//   disrupted: 'bg-fc-danger',
// };

// const modeBarColors: Record<string, string> = {
//   metro: '#3B82F6',
//   bus: '#FACC15',
//   walk: '#A1A1AA',
//   auto: '#22C55E',
// };

// // Filter configuration with icons
// const filterConfig = [
//   { id: 'ALL', icon: null, label: 'ALL' },
//   { id: 'METRO', icon: Train, label: 'METRO' },
//   { id: 'BUS', icon: Bus, label: 'BUS' },
//   { id: 'AUTO', icon: Car, label: 'AUTO' },
//   { id: 'DISRUPTED', icon: AlertTriangle, label: 'DISRUPTED' },
//   { id: 'THIS_WEEK', icon: Calendar, label: 'THIS WEEK' },
// ];

// const trendData = Array.from({ length: 30 }, (_, i) => ({
//   day: i + 1,
//   time: 22 + Math.random() * 16,
// }));
// const costData = [
//   { name: 'Metro', value: 540, color: '#3B82F6' },
//   { name: 'Bus', value: 180, color: '#FACC15' },
//   { name: 'Auto', value: 120, color: '#22C55E' },
// ];

// // Number counter hook
// function useNumberCounter(target: number, duration = 1.5) {
//   const [display, setDisplay] = useState(0);
//   const [done, setDone] = useState(false);

//   useEffect(() => {
//     if (done) return;
//     let start = 0;
//     const startTime = performance.now();

//     const animate = (currentTime: number) => {
//       const elapsed = (currentTime - startTime) / 1000;
//       const progress = Math.min(elapsed / duration, 1);
//       // Ease out cubic
//       const ease = 1 - Math.pow(1 - progress, 3);
//       setDisplay(Math.round(ease * target));
//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         setDone(true);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [target, duration, done]);

//   return display;
// }

// const HistoryScreen = () => {
//   const [activeFilter, setActiveFilter] = useState('ALL');
//   const [expandedJourney, setExpandedJourney] = useState<string | null>(null);

//   // Animated stats
//   const totalTrips = useNumberCounter(32, 1.8);
//   const totalCost = useNumberCounter(840, 1.8);
//   const totalTimeSaved = useNumberCounter(4.2, 1.8);

//   // Filtered journey list
//   const filteredJourneys = journeyHistory.filter((j) => {
//     if (activeFilter === 'ALL') return true;
//     if (activeFilter === 'DISRUPTED') return j.status === 'disrupted';
//     if (activeFilter === 'THIS_WEEK') {
//       const weekAgo = new Date();
//       weekAgo.setDate(weekAgo.getDate() - 7);
//       return new Date(j.date) >= weekAgo;
//     }
//     const modeKey = activeFilter.toLowerCase() as keyof typeof modeBarColors;
//     return j.mode === modeKey;
//   });

//   return (
//     <motion.div
//       variants={stagger}
//       initial="hidden"
//       animate="show"
//       className="w-full max-w-[1200px] mx-auto pb-10"
//     >
//       {/* ─── Header ─── */}
//       <motion.div variants={fadeUp} className="mb-10">
//         <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
//           Journey History
//         </h1>
//         <p className="text-gray-500 font-medium">
//           Track your commutes and analyze your travel patterns
//         </p>
//       </motion.div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//         {/* ═══════════════════════════════════════════
//             LEFT COLUMN — History List & Filters
//            ═══════════════════════════════════════════ */}
//         <div className="space-y-6">
//           {/* Monthly Summary */}
//           <motion.div
//             variants={fadeUp}
//             className="bg-white border-[3px] border-border-hard p-6 rounded-[28px] shadow-sm"
//             style={{ boxShadow: '6px 6px 0px hsl(var(--shadow-color))' }}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
//                   <ChevronLeft size={16} strokeWidth={2.5} />
//                 </button>
//                 <h3 className="font-display text-lg font-bold uppercase text-text-primary">MARCH 2026</h3>
//                 <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
//                   <ChevronRight size={16} strokeWidth={2.5} />
//                 </button>
//               </div>
//               <div className="flex gap-2">
//                 <span className="brutal-chip bg-bg-inset border-2 border-border-hard text-[10px] text-text-muted-fc">
//                   THIS MONTH
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="text-center">
//                 <div className="font-display text-[32px] font-extrabold text-text-primary tabular-nums">
//                   {totalTrips}
//                 </div>
//                 <p className="font-mono-label text-[10px] text-text-muted-fc">TRIPS</p>
//               </div>
//               <div className="text-center">
//                 <div className="font-display text-[32px] font-extrabold text-fc-warning tabular-nums">
//                   {totalCost}
//                 </div>
//                 <p className="font-mono-label text-[10px] text-text-muted-fc">SPENT</p>
//               </div>
//               <div className="text-center">
//                 <div className="font-display text-[32px] font-extrabold text-fc-success tabular-nums">
//                   {totalTimeSaved}
//                 </div>
//                 <p className="font-mono-label text-[10px] text-text-muted-fc">HRS SAVED</p>
//               </div>
//             </div>

//             {/* Weekly Trips Bar Chart */}
//             <div className="h-[160px] bg-bg-base border-2 border-border-hard p-2 rounded-[4px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={weeklyTrips}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
//                   <XAxis
//                     dataKey="day"
//                     tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
//                   />
//                   <YAxis
//                     tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
//                     domain={[0, 6]}
//                   />
//                   <Bar
//                     dataKey="trips"
//                     radius={0}
//                     stroke="none"
//                     animationDuration={800}
//                   >
//                     {weeklyTrips.map((entry, index) => (
//                       <Cell
//                         key={index}
//                         fill={modeBarColors[entry.mode] || '#3B82F6'}
//                         animationDuration={800}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="mt-4 flex gap-[3px] w-full h-[10px]">
//               <div className="bg-fc-metro h-full" style={{ width: '60%' }} />
//               <div className="bg-fc-bus h-full" style={{ width: '30%' }} />
//               <div className="bg-fc-walk h-full" style={{ width: '10%' }} />
//             </div>
//             <div className="flex gap-4 mt-1">
//               <span className="font-mono-label text-[10px] text-text-muted-fc">🚇 60%</span>
//               <span className="font-mono-label text-[10px] text-text-muted-fc">🚌 30%</span>
//               <span className="font-mono-label text-[10px] text-text-muted-fc">🚶 10%</span>
//             </div>
//           </motion.div>

//           {/* Filters */}
//           <motion.div
//             variants={fadeUp}
//             className="flex gap-2 overflow-x-auto hide-scrollbar"
//           >
//             {filterConfig.map((f) => (
//               <button
//                 key={f.id}
//                 onClick={() => setActiveFilter(f.id)}
//                 className={`brutal-chip flex-shrink-0 ${activeFilter === f.id
//                   ? 'border-fc-accent bg-fc-accent/10 text-fc-accent'
//                   : 'border-border-hard bg-bg-inset text-text-muted-fc'
//                   }`}
//               >
//                 {f.icon && (
//                   <f.icon size={14} strokeWidth={2.5} className="mr-1.5" />
//                 )}
//                 <span className="font-bold text-[10px] uppercase tracking-wider">
//                   {f.label}
//                 </span>
//               </button>
//             ))}
//           </motion.div>

//           {/* Journey List */}
//           <motion.div
//             variants={fadeUp}
//             className="space-y-3"
//           >
//             <AnimatePresence>
//               {filteredJourneys.map((j, idx) => {
//                 const ModeIcon = MODE_ICONS[j.mode];
//                 return (
//                   <motion.div
//                     key={j.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 20 }}
//                     transition={{ delay: idx * 0.05, duration: 0.3 }}
//                     className="brutal-card p-4 flex items-center gap-4 cursor-pointer relative"
//                   >
//                     {/* Status indicator */}
//                     <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusColors[j.status]}`} />

//                     {/* Mode icon */}
//                     <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${MODE_BORDER_COLORS[j.mode]} text-lg`}>
//                       <ModeIcon size={18} strokeWidth={2.5} />
//                     </div>

//                     {/* Journey details */}
//                     <div className="flex-1 min-w-0">
//                       <p className="font-body text-sm font-semibold text-text-primary truncate">
//                         {j.from} → {j.to}
//                       </p>
//                       <p className="font-mono-label text-[11px] text-text-muted-fc">
//                         {j.modeLabel}
//                       </p>
//                       <p className="font-mono-label text-[11px] text-text-muted-fc">
//                         {j.date}, {j.time}
//                       </p>
//                     </div>

//                     {/* Right info */}
//                     <div className="text-right flex-shrink-0">
//                       <p className="font-body text-sm font-bold text-text-primary tabular-nums">
//                         {j.duration} MIN
//                       </p>
//                       <p className="font-mono-label text-xs text-text-muted-fc">
//                         ₹{j.cost}
//                       </p>
//                       {j.rerouted && (
//                         <span className="font-mono-label text-[9px] text-fc-warning uppercase">
//                           Rerouted
//                         </span>
//                       )}
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* ═══════════════════════════════════════════
//             RIGHT COLUMN — Analytics
//            ═══════════════════════════════════════════ */}
//         <div className="hidden lg:block space-y-6 mt-0">
//           {/* Trend Chart */}
//           <motion.div
//             variants={fadeUp}
//             className="brutal-card p-6"
//           >
//             <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">
//               30-DAY COMMUTE TREND
//             </h3>
//             <div className="h-[200px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={trendData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
//                   <XAxis
//                     dataKey="day"
//                     tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
//                   />
//                   <YAxis
//                     tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="time"
//                     stroke="#3B82F6"
//                     fill="#3B82F6"
//                     fillOpacity={0.08}
//                     strokeWidth={2}
//                     animationDuration={1000}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//           {/* Cost Breakdown */}
//           <motion.div
//             variants={fadeUp}
//             className="brutal-card p-6"
//           >
//             <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">
//               COST BREAKDOWN
//             </h3>
//             <div className="h-[200px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={costData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={70}
//                     strokeWidth={2}
//                     stroke="hsl(0 0% 8%)"
//                     animationDuration={1000}
//                   >
//                     {costData.map((entry, i) => (
//                       <Cell key={i} fill={entry.color} animationDuration={1000} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="flex gap-4 justify-center mt-2">
//               {costData.map((d) => (
//                 <span key={d.name} className="font-mono-label text-[10px] text-text-muted-fc">
//                   <span
//                     className="inline-block w-2 h-2 mr-1 rounded-full"
//                     style={{ backgroundColor: d.color }}
//                   />
//                   {d.name} ₹{d.value}
//                 </span>
//               ))}
//             </div>
//           </motion.div>

//           {/* Achievements */}
//           <motion.div
//             variants={fadeUp}
//             className="brutal-card p-6 space-y-3"
//           >
//             <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-2">
//               ACHIEVEMENTS
//             </h3>
//             <p className="font-mono-label text-xs text-fc-warning">
//               🔥 7-DAY STREAK — PUBLIC TRANSIT EVERY WEEKDAY
//             </p>
//             <p className="font-mono-label text-xs text-fc-success">
//               🌱 8.2 KG CO₂ SAVED THIS MONTH
//             </p>
//             <p className="font-mono-label text-xs text-fc-accent">
//               ⚡ AVG COMMUTE: 26 MIN (4 MIN {'<'} CITY AVG)
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default HistoryScreen;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Train, Bus, Car, Footprints,
  AlertTriangle, Calendar, Shield, TrendingUp, Clock, CheckCircle2,
  XCircle, Users, Trash2, Shuffle, Play, TriangleAlert
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MODE_ICONS = {
  metro: Train,
  bus: Bus,
  auto: Car,
  walk: Footprints,
} as const;

const MODE_BORDER_COLORS = {
  metro: 'border-blue-500',
  bus: 'border-yellow-400',
  auto: 'border-green-500',
  walk: 'border-zinc-400',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type JourneyStatus = 'on-time' | 'delayed' | 'disrupted';
type TransitMode = 'metro' | 'bus' | 'auto' | 'walk';

interface Journey {
  id: string;
  from: string;
  to: string;
  mode: TransitMode;
  modeLabel: string;
  date: string;     // "March 31, 2026" — parseable by new Date()
  time: string;
  duration: number; // minutes
  cost: number;     // ₹
  status: JourneyStatus;
  rerouted?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 24 Mumbai commutes, March 2026
// ─────────────────────────────────────────────────────────────────────────────

const journeyHistory: Journey[] = [
  // ── Mar 31 (Mon) ──
  {
    id: 'j01', from: 'Vasai', to: 'Churchgate',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 31, 2026', time: '08:10 AM',
    duration: 74, cost: 35, status: 'on-time', rerouted: false,
  },
  {
    id: 'j02', from: 'Churchgate', to: 'Vasai',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 31, 2026', time: '07:05 PM',
    duration: 80, cost: 35, status: 'delayed', rerouted: false,
  },
  // ── Mar 28 (Fri) ──
  {
    id: 'j03', from: 'Andheri', to: 'Nariman Point',
    mode: 'metro', modeLabel: 'Metro → Walk → Bus',
    date: 'March 28, 2026', time: '09:15 AM',
    duration: 52, cost: 42, status: 'on-time', rerouted: false,
  },
  {
    id: 'j04', from: 'Nariman Point', to: 'Andheri',
    mode: 'bus', modeLabel: 'Bus → Metro',
    date: 'March 28, 2026', time: '06:50 PM',
    duration: 65, cost: 22, status: 'delayed', rerouted: false,
  },
  // ── Mar 27 (Thu) ──
  {
    id: 'j05', from: 'Borivali', to: 'Churchgate',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 27, 2026', time: '08:30 AM',
    duration: 58, cost: 30, status: 'on-time', rerouted: false,
  },
  {
    id: 'j06', from: 'Churchgate', to: 'Dadar',
    mode: 'metro', modeLabel: 'Train → Walk',
    date: 'March 27, 2026', time: '01:15 PM',
    duration: 18, cost: 10, status: 'on-time', rerouted: false,
  },
  {
    id: 'j07', from: 'Dadar', to: 'Borivali',
    mode: 'bus', modeLabel: 'Bus → Walk',
    date: 'March 27, 2026', time: '07:40 PM',
    duration: 45, cost: 15, status: 'disrupted', rerouted: true,
  },
  // ── Mar 26 (Wed) ──
  {
    id: 'j08', from: 'Thane', to: 'Fort',
    mode: 'metro', modeLabel: 'Train → Walk → Bus',
    date: 'March 26, 2026', time: '08:00 AM',
    duration: 62, cost: 38, status: 'on-time', rerouted: false,
  },
  {
    id: 'j09', from: 'Fort', to: 'Bandra',
    mode: 'auto', modeLabel: 'Walk → Auto',
    date: 'March 26, 2026', time: '03:30 PM',
    duration: 35, cost: 95, status: 'on-time', rerouted: false,
  },
  {
    id: 'j10', from: 'Bandra', to: 'Thane',
    mode: 'metro', modeLabel: 'Metro → Train',
    date: 'March 26, 2026', time: '08:10 PM',
    duration: 55, cost: 32, status: 'on-time', rerouted: false,
  },
  // ── Mar 25 (Tue) ──
  {
    id: 'j11', from: 'Ghatkopar', to: 'Churchgate',
    mode: 'metro', modeLabel: 'Metro → Train → Walk',
    date: 'March 25, 2026', time: '07:55 AM',
    duration: 44, cost: 28, status: 'delayed', rerouted: true,
  },
  {
    id: 'j12', from: 'Churchgate', to: 'Ghatkopar',
    mode: 'metro', modeLabel: 'Walk → Train → Metro',
    date: 'March 25, 2026', time: '06:20 PM',
    duration: 46, cost: 28, status: 'on-time', rerouted: false,
  },
  // ── Mar 24 (Mon) ──
  {
    id: 'j13', from: 'Vasai', to: 'Dadar',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 24, 2026', time: '08:20 AM',
    duration: 66, cost: 32, status: 'on-time', rerouted: false,
  },
  {
    id: 'j14', from: 'Dadar', to: 'Vasai',
    mode: 'metro', modeLabel: 'Walk → Train → Auto',
    date: 'March 24, 2026', time: '07:00 PM',
    duration: 70, cost: 72, status: 'disrupted', rerouted: true,
  },
  // ── Mar 21 (Fri) ──
  {
    id: 'j15', from: 'Mulund', to: 'CST',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 21, 2026', time: '09:00 AM',
    duration: 50, cost: 30, status: 'on-time', rerouted: false,
  },
  {
    id: 'j16', from: 'CST', to: 'Colaba',
    mode: 'bus', modeLabel: 'Bus → Walk',
    date: 'March 21, 2026', time: '12:30 PM',
    duration: 22, cost: 8, status: 'on-time', rerouted: false,
  },
  {
    id: 'j17', from: 'Colaba', to: 'Mulund',
    mode: 'metro', modeLabel: 'Bus → Train → Walk',
    date: 'March 21, 2026', time: '06:00 PM',
    duration: 68, cost: 38, status: 'on-time', rerouted: false,
  },
  // ── Mar 20 (Thu) ──
  {
    id: 'j18', from: 'Kandivali', to: 'Grant Road',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 20, 2026', time: '08:45 AM',
    duration: 40, cost: 25, status: 'on-time', rerouted: false,
  },
  {
    id: 'j19', from: 'Grant Road', to: 'Kandivali',
    mode: 'bus', modeLabel: 'Bus → Train → Walk',
    date: 'March 20, 2026', time: '07:30 PM',
    duration: 55, cost: 18, status: 'delayed', rerouted: false,
  },
  // ── Mar 19 (Wed) ──
  {
    id: 'j20', from: 'Andheri', to: 'Churchgate',
    mode: 'metro', modeLabel: 'Metro → Train → Walk',
    date: 'March 19, 2026', time: '08:05 AM',
    duration: 38, cost: 26, status: 'on-time', rerouted: false,
  },
  // ── Mar 14 (Sat) ──
  {
    id: 'j21', from: 'Borivali', to: 'Marine Lines',
    mode: 'auto', modeLabel: 'Auto → Walk',
    date: 'March 14, 2026', time: '10:30 AM',
    duration: 85, cost: 180, status: 'on-time', rerouted: false,
  },
  // ── Mar 10 (Tue) ──
  {
    id: 'j22', from: 'Thane', to: 'Bandra',
    mode: 'bus', modeLabel: 'Train → Bus → Walk',
    date: 'March 10, 2026', time: '09:00 AM',
    duration: 70, cost: 22, status: 'disrupted', rerouted: true,
  },
  // ── Mar 5 (Thu) ──
  {
    id: 'j23', from: 'Virar', to: 'Churchgate',
    mode: 'metro', modeLabel: 'Walk → Train → Walk',
    date: 'March 5, 2026', time: '07:30 AM',
    duration: 90, cost: 40, status: 'on-time', rerouted: false,
  },
  {
    id: 'j24', from: 'Churchgate', to: 'Virar',
    mode: 'metro', modeLabel: 'Walk → Train → Auto',
    date: 'March 5, 2026', time: '07:50 PM',
    duration: 98, cost: 90, status: 'delayed', rerouted: false,
  },
];

// ── Weekly bar chart — week of Mar 23–29, 2026 ────────────────────────────
// mode drives bar colour (dominant mode for that day)
const weeklyTrips = [
  { day: 'Mon', trips: 2, mode: 'metro' },
  { day: 'Tue', trips: 2, mode: 'metro' },
  { day: 'Wed', trips: 2, mode: 'metro' },
  { day: 'Thu', trips: 3, mode: 'metro' },
  { day: 'Fri', trips: 3, mode: 'bus' },
  { day: 'Sat', trips: 0, mode: 'walk' },
  { day: 'Sun', trips: 1, mode: 'bus' },
];

// ── 30-day commute trend — realistic Mumbai commute times (mins) ───────────
const trendData = [
  { day: 1, time: 74 }, { day: 2, time: 38 }, { day: 3, time: 70 },
  { day: 4, time: 66 }, { day: 5, time: 90 }, { day: 6, time: 85 },
  { day: 7, time: 40 }, { day: 8, time: 74 }, { day: 9, time: 46 },
  { day: 10, time: 70 }, { day: 11, time: 38 }, { day: 12, time: 62 },
  { day: 13, time: 55 }, { day: 14, time: 85 }, { day: 15, time: 30 },
  { day: 16, time: 68 }, { day: 17, time: 52 }, { day: 18, time: 44 },
  { day: 19, time: 38 }, { day: 20, time: 40 }, { day: 21, time: 50 },
  { day: 22, time: 30 }, { day: 23, time: 66 }, { day: 24, time: 70 },
  { day: 25, time: 44 }, { day: 26, time: 62 }, { day: 27, time: 45 },
  { day: 28, time: 52 }, { day: 29, time: 30 }, { day: 30, time: 80 },
];

// ── Pie chart — cost breakdown by mode ───────────────────────────────────
const costData = [
  { name: 'Metro', value: 569, color: '#3B82F6' },
  { name: 'Bus', value: 183, color: '#FACC15' },
  { name: 'Auto', value: 275, color: '#22C55E' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

const filterConfig = [
  { id: 'ALL', icon: null, label: 'ALL' },
  { id: 'METRO', icon: Train, label: 'METRO' },
  { id: 'BUS', icon: Bus, label: 'BUS' },
  { id: 'AUTO', icon: Car, label: 'AUTO' },
  { id: 'DISRUPTED', icon: AlertTriangle, label: 'DISRUPTED' },
  { id: 'THIS_WEEK', icon: Calendar, label: 'THIS WEEK' },
];

// ─────────────────────────────────────────────────────────────────────────────
// NUMBER COUNTER HOOK
// ─────────────────────────────────────────────────────────────────────────────

function useNumberCounter(target: number, duration = 1.5) {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 1000 / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setDone(true);
    };

    requestAnimationFrame(animate);
  }, [target, duration, done]);

  return display;
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Returns true if any journey in the list falls on this calendar date
function hasJourneyOn(year: number, month: number, day: number): boolean {
  return journeyHistory.some((j) => {
    const d = new Date(j.date);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&   // 0-indexed
      d.getDate() === day
    );
  });
}

function hasDisruptionOn(year: number, month: number, day: number): boolean {
  return journeyHistory.some((j) => {
    const d = new Date(j.date);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day &&
      (j.status === 'disrupted' || j.status === 'delayed')
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI CALENDAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface MiniCalendarProps {
  year: number;
  month: number; // 0-indexed
}

function MiniCalendar({ year, month }: MiniCalendarProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // First weekday of the month (0 = Sun)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className="text-center font-mono-label text-[9px] text-text-muted-fc pb-1"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const hasJourney = hasJourneyOn(year, month, day);
          const hasDisruption = hasDisruptionOn(year, month, day);

          return (
            <div
              key={day}
              className={`
                relative flex items-center justify-center
                w-full aspect-square text-[10px] font-mono-label
                ${hasJourney
                  ? hasDisruption
                    ? 'bg-fc-warning/20 text-fc-warning font-bold'
                    : 'bg-fc-accent/15 text-fc-accent font-bold'
                  : 'text-text-muted-fc'
                }
              `}
            >
              {day}
              {hasJourney && (
                <span
                  className={`
                    absolute bottom-0.5 left-1/2 -translate-x-1/2
                    w-1 h-1 rounded-full
                    ${hasDisruption ? 'bg-fc-warning' : 'bg-fc-accent'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const HistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [calendarMonth, setCalendarMonth] = useState(2);  // 0-indexed; 2 = March
  const [calendarYear, setCalendarYear] = useState(2026);

  // Animated stat counters
  const totalTrips = useNumberCounter(32, 1.8);
  const totalCost = useNumberCounter(840, 1.8);
  const totalTimeSaved = useNumberCounter(4, 1.8); // displayed as integer hrs

  // ── Filtered journey list ─────────────────────────────────────────────────
  const filteredJourneys = journeyHistory.filter((j) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DISRUPTED') return j.status === 'disrupted';
    if (activeFilter === 'THIS_WEEK') {
      const weekAgo = new Date('March 25, 2026'); // anchored to our dataset
      return new Date(j.date) >= weekAgo;
    }
    const modeKey = activeFilter.toLowerCase() as TransitMode;
    return j.mode === modeKey;
  });

  // ── Calendar navigation ───────────────────────────────────────────────────
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-[1200px] mx-auto pb-10"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
          Journey History
        </h1>
        <p className="text-gray-500 font-medium">
          Track your commutes and analyze your travel patterns
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ═══════════════════════════════════════════════════════════════════
            LEFT COLUMN — Monthly summary + filter + journey list
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Monthly Summary card */}
          <motion.div
            variants={fadeUp}
            className="bg-white border-[3px] border-border-hard p-6 rounded-[28px] shadow-sm"
            style={{ boxShadow: '6px 6px 0px hsl(var(--shadow-color))' }}
          >
            {/* Calendar header with navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <h3 className="font-display text-lg font-bold uppercase text-text-primary">
                  {monthNames[calendarMonth].toUpperCase()} {calendarYear}
                </h3>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
              <span className="brutal-chip bg-bg-inset border-2 border-border-hard text-[10px] text-text-muted-fc">
                THIS MONTH
              </span>
            </div>

            {/* Stat counters */}
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
                <p className="font-mono-label text-[10px] text-text-muted-fc">SPENT (₹)</p>
              </div>
              <div className="text-center">
                <div className="font-display text-[32px] font-extrabold text-fc-success tabular-nums">
                  {totalTimeSaved}
                </div>
                <p className="font-mono-label text-[10px] text-text-muted-fc">HRS SAVED</p>
              </div>
            </div>

            {/* Mini calendar — driven by calendarMonth / calendarYear */}
            <div className="bg-bg-base border-2 border-border-hard p-3 rounded-[4px] mb-4">
              <MiniCalendar year={calendarYear} month={calendarMonth} />
              <div className="flex gap-4 mt-3 pt-2 border-t border-border-hard/30">
                <span className="font-mono-label text-[9px] text-text-muted-fc flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-fc-accent" />
                  Journey day
                </span>
                <span className="font-mono-label text-[9px] text-text-muted-fc flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-fc-warning" />
                  Delay / disruption
                </span>
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
                  <Bar dataKey="trips" radius={0} stroke="none" animationDuration={800}>
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

            {/* Mode share bar */}
            <div className="mt-4 flex gap-[3px] w-full h-[10px]">
              <div className="bg-fc-metro h-full" style={{ width: '60%' }} />
              <div className="bg-fc-bus   h-full" style={{ width: '30%' }} />
              <div className="bg-fc-walk  h-full" style={{ width: '10%' }} />
            </div>
            <div className="flex gap-4 mt-1">
              <span className="font-mono-label text-[10px] text-text-muted-fc">🚇 60%</span>
              <span className="font-mono-label text-[10px] text-text-muted-fc">🚌 30%</span>
              <span className="font-mono-label text-[10px] text-text-muted-fc">🚶 10%</span>
            </div>
          </motion.div>

          {/* Filter chips */}
          <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar">
            {filterConfig.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`brutal-chip flex-shrink-0 ${activeFilter === f.id
                    ? 'border-fc-accent bg-fc-accent/10 text-fc-accent'
                    : 'border-border-hard bg-bg-inset text-text-muted-fc'
                  }`}
              >
                {f.icon && <f.icon size={14} strokeWidth={2.5} className="mr-1.5" />}
                <span className="font-bold text-[10px] uppercase tracking-wider">
                  {f.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Journey list */}
          <motion.div variants={fadeUp} className="space-y-3">
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
                    {/* Status dot */}
                    <div
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusColors[j.status]}`}
                    />

                    {/* Mode icon */}
                    <div
                      className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${MODE_BORDER_COLORS[j.mode]}`}
                    >
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
                      <p className="font-mono-label text-xs text-text-muted-fc">₹{j.cost}</p>
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

        {/* ═══════════════════════════════════════════════════════════════════
            RIGHT COLUMN — Analytics (desktop only)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block space-y-6 mt-0">

          {/* 30-day commute trend */}
          <motion.div variants={fadeUp} className="brutal-card p-6">
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
                    unit=" m"
                    domain={[0, 110]}
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

          {/* Cost breakdown pie */}
          <motion.div variants={fadeUp} className="brutal-card p-6">
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
          <motion.div variants={fadeUp} className="brutal-card p-6 space-y-3">
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
              ⚡ AVG COMMUTE: 26 MIN (4 MIN &lt; CITY AVG)
            </p>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default HistoryScreen;