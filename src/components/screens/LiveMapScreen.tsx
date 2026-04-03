import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Eye } from 'lucide-react';

const cards = [
  {
    type: 'Debit',
    provider: 'VISA',
    number: '**** **** **** 5690',
    validThru: '07/30',
    bgColor: 'bg-ff-green-light',
    textColor: 'text-[#1c2e25]',
  },
  {
    type: 'Debit',
    provider: 'VISA',
    number: '**** **** **** 3421',
    validThru: '12/28',
    bgColor: 'bg-[#2a4d3a]',
    textColor: 'text-white',
  },
  {
    type: 'Credit',
    provider: 'Mastercard',
    number: '**** **** **** 9017',
    validThru: '03/27',
    bgColor: 'bg-[#377085]',
    textColor: 'text-white',
  },
];

const transactions = [
  { name: 'Amazon', date: 'Feb 15, 2026', amount: '-$80', isPositive: false, color: 'bg-[#1b2128]', textClass: 'text-white', icon: 'A' },
  { name: 'McDonald\'s', date: 'Jan 7, 2026', amount: '+$5', isPositive: true, color: 'bg-[#e53935]', textClass: 'text-white', icon: 'M' },
  { name: 'Spotify', date: 'Jan 1, 2026', amount: '-$10', isPositive: false, color: 'bg-[#1db954]', textClass: 'text-white', icon: 'S' },
  { name: 'Bank Transfer', date: 'Feb 10, 2026', amount: '+$700', isPositive: true, color: 'bg-[#1b3a2a]', textClass: 'text-white', icon: 'B' },
  { name: 'Netflix', date: 'Jan 5, 2026', amount: '-$25', isPositive: false, color: 'bg-[#e50914]', textClass: 'text-white', icon: 'N' },
];

const LiveMapScreen = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Cards</h1>
          <p className="text-gray-500">Manage all your payment cards</p>
        </div>
        <button className="flex items-center gap-2 bg-ff-lime text-black px-6 py-3 rounded-full font-semibold hover:bg-[#b5e025] transition-colors shadow-sm whitespace-nowrap">
          <Plus size={20} className="text-black" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Cards Slider/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 overflow-x-auto pb-4 hide-scrollbar">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`${card.bgColor} ${card.textColor} rounded-[28px] p-6 min-w-[320px] flex flex-col justify-between aspect-[1.6/1] shadow-sm relative overflow-hidden`}
          >
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs opacity-80 mb-1 font-medium">{card.type}</p>
                <h3 className="text-2xl font-bold tracking-tight mt-1">{card.provider}</h3>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Chip placeholder */}
            <div className="grid grid-cols-2 gap-1 w-6 mt-6 relative z-10">
              <div className={`w-2 h-2 rounded-sm ${card.textColor === 'text-white' ? 'bg-white/70' : 'bg-black/40'}`}></div>
              <div className={`w-2 h-2 rounded-sm ${card.textColor === 'text-white' ? 'bg-white/70' : 'bg-black/40'}`}></div>
              <div className={`w-2 h-2 rounded-sm ${card.textColor === 'text-white' ? 'bg-white/70' : 'bg-black/40'}`}></div>
              <div className={`w-2 h-2 rounded-sm ${card.textColor === 'text-white' ? 'bg-white/70' : 'bg-black/40'}`}></div>
            </div>

            <div className="mt-auto relative z-10">
              <p className="font-mono text-lg tracking-widest opacity-90 mb-6">{card.number}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Valid Thru</p>
                  <p className="font-bold">{card.validThru}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Balance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl tracking-widest font-bold">••••••</span>
                    <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Eye size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Card Activity</h2>
      
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {transactions.map((tx, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#f9f8f2] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${tx.color} ${tx.textClass} shadow-sm group-hover:scale-105 transition-transform`}>
                  {tx.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-[15px]">{tx.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {tx.amount}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMapScreen;
