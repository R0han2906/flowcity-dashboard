import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { journeyHistory, weeklyTrips } from '@/lib/mock-data';
import { MODE_ICONS, MODE_BORDER_COLORS } from '@/lib/constants';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const statusColors: Record<string, string> = { 'on-time': 'bg-fc-success', delayed: 'bg-fc-warning', disrupted: 'bg-fc-danger' };
const modeBarColors: Record<string, string> = { metro: '#3B82F6', bus: '#FACC15', walk: '#A1A1AA', auto: '#22C55E' };

const filters = ['ALL', '🚇 METRO', '🚌 BUS', '🛺 AUTO', '⚠️ DISRUPTED', 'THIS WEEK'];

const trendData = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, time: 22 + Math.random() * 16 }));
const costData = [
  { name: 'Metro', value: 540, color: '#3B82F6' },
  { name: 'Bus', value: 180, color: '#FACC15' },
  { name: 'Auto', value: 120, color: '#22C55E' },
];

const HistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[960px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      <motion.h2 variants={fadeUp} className="font-display text-[28px] font-extrabold uppercase text-text-primary">JOURNEY HISTORY</motion.h2>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="space-y-6">
          {/* Monthly Summary */}
          <motion.div variants={fadeUp} className="bg-bg-elevated border-[3px] border-border-hard p-6" style={{ boxShadow: '6px 6px 0px hsl(var(--shadow-color))', borderRadius: 4 }}>
            <div className="flex items-center justify-between mb-6">
              <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <h3 className="font-display text-lg font-bold uppercase text-text-primary">MARCH 2026</h3>
              <button className="w-8 h-8 border-2 border-border-hard flex items-center justify-center brutal-btn bg-bg-inset">
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center"><span className="font-display text-[32px] font-extrabold text-text-primary">32</span><p className="font-mono-label text-[10px] text-text-muted-fc">TRIPS</p></div>
              <div className="text-center"><span className="font-display text-[32px] font-extrabold text-fc-warning">₹840</span><p className="font-mono-label text-[10px] text-text-muted-fc">SPENT</p></div>
              <div className="text-center"><span className="font-display text-[32px] font-extrabold text-fc-success">4.2 HRS</span><p className="font-mono-label text-[10px] text-text-muted-fc">SAVED</p></div>
            </div>

            <div className="h-[160px] bg-bg-base border-2 border-border-hard p-2" style={{ borderRadius: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrips}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }} domain={[0, 6]} />
                  <Bar dataKey="trips" radius={0} stroke="none">
                    {weeklyTrips.map((entry, index) => (
                      <Cell key={index} fill={modeBarColors[entry.mode] || '#3B82F6'} />
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
          <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`brutal-chip flex-shrink-0 ${activeFilter === f ? 'border-fc-accent bg-fc-accent/10 text-fc-accent' : 'border-border-hard bg-bg-inset text-text-muted-fc'}`}>
                {f}
              </button>
            ))}
          </motion.div>

          {/* Journey List */}
          <motion.div variants={fadeUp} className="space-y-3">
            {journeyHistory.map((j) => (
              <div key={j.id} className="brutal-card p-4 flex items-center gap-4 cursor-pointer relative">
                <div className={`absolute top-2 right-2 w-2 h-2 ${statusColors[j.status]}`} />
                <div className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${MODE_BORDER_COLORS[j.mode]} text-lg`}>
                  {MODE_ICONS[j.mode]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-text-primary">{j.from} → {j.to}</p>
                  <p className="font-mono-label text-[11px] text-text-muted-fc">{j.modeLabel}</p>
                  <p className="font-mono-label text-[11px] text-text-muted-fc">{j.date}, {j.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-body text-sm font-bold text-text-primary">{j.duration} MIN</p>
                  <p className="font-mono-label text-xs text-text-muted-fc">₹{j.cost}</p>
                  {j.rerouted && <span className="font-mono-label text-[9px] text-fc-warning">REROUTED</span>}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Analytics */}
        <div className="hidden lg:block space-y-6 mt-0">
          <motion.div variants={fadeUp} className="brutal-card p-6">
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">30-DAY COMMUTE TREND</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#52525B' }} />
                  <Area type="monotone" dataKey="time" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.08} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="brutal-card p-6">
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-4">COST BREAKDOWN</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} strokeWidth={2} stroke="hsl(0 0% 8%)">
                    {costData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-2">
              {costData.map((d) => (
                <span key={d.name} className="font-mono-label text-[10px] text-text-muted-fc">
                  <span className="inline-block w-2 h-2 mr-1" style={{ background: d.color }} />{d.name} ₹{d.value}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="brutal-card p-6 space-y-3">
            <h3 className="font-display text-sm font-bold uppercase text-text-primary mb-2">ACHIEVEMENTS</h3>
            <p className="font-mono-label text-xs text-fc-warning">🔥 7-DAY STREAK — PUBLIC TRANSIT EVERY WEEKDAY</p>
            <p className="font-mono-label text-xs text-fc-success">🌱 8.2 KG CO₂ SAVED THIS MONTH</p>
            <p className="font-mono-label text-xs text-fc-accent">⚡ AVG COMMUTE: 26 MIN (4 MIN {'<'} CITY AVG)</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryScreen;
