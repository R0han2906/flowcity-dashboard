import { useState } from 'react';
import { LayoutDashboard, Route, Map, AlertTriangle, User, Bell, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardScreen from '@/components/screens/DashboardScreen';
import PlannerScreen from '@/components/screens/PlannerScreen';
import LiveMapScreen from '@/components/screens/LiveMapScreen';
import DisruptionsScreen from '@/components/screens/DisruptionsScreen';
import HistoryScreen from '@/components/screens/HistoryScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'planner', icon: Route, label: 'Planner' },
  { id: 'map', icon: Map, label: 'Live Map' },
  { id: 'alerts', icon: AlertTriangle, label: 'Disruptions' },
  { id: 'history', icon: LayoutDashboard, label: 'History' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const AppLayout = () => {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <DashboardScreen onNavigate={setActiveScreen} />;
      case 'planner': return <PlannerScreen />;
      case 'map': return <LiveMapScreen />;
      case 'alerts': return <DisruptionsScreen />;
      case 'history': return <HistoryScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardScreen onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f9f8f2] font-finflow">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] min-h-screen bg-sidebar border-r border-[#e5e5e5] fixed left-0 top-0 z-40 bg-white">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-gray-100 flex items-center justify-center transition-transform hover:scale-105">
            <img src="/logo3.png" alt="FlowCity Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#1b3a2a] to-[#2c5f45] bg-clip-text text-transparent">
            FlowCity
          </h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center justify-between px-5 py-3 rounded-full transition-all group ${isActive
                  ? 'bg-[#1b3a2a] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                  <span className={`text-[14px] ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-ff-lime shadow-[0_0_8px_rgba(197,240,44,0.5)]"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#f8f9f5] rounded-2xl p-4 mb-4 relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Alex Piter</h4>
                  {/* <p className="text-[11px] text-gray-500">Premium</p> */}
                </div>
              </div>
              <Bell size={16} className="text-gray-400" />
            </div>

            <div className="flex flex-col gap-2">
              <button className="w-full flex items-center justify-center gap-2 bg-ff-lime text-[#1d2921] font-bold py-3 rounded-xl hover:bg-[#b5e025] transition-colors shadow-sm">
                <UserPlus size={18} strokeWidth={2.5} />
                <span className="text-sm">Sign Up</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-sm">
                <LogIn size={18} strokeWidth={2.5} />
                <span className="text-sm">Login</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] pb-20 lg:pb-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-h-screen p-8"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex overflow-x-auto hide-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`min-w-[70px] flex-1 flex flex-col items-center justify-center py-3 relative ${activeScreen === item.id ? 'text-[#1b3a2a]' : 'text-gray-400'
              }`}
          >
            <item.icon size={20} strokeWidth={activeScreen === item.id ? 2.5 : 2} />
            <span className={`text-[9px] mt-1 whitespace-nowrap ${activeScreen === item.id ? 'font-medium' : ''}`}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
