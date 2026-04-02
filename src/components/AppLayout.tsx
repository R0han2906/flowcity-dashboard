import { useState } from 'react';
import { LayoutDashboard, Route, Map, AlertTriangle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardScreen from '@/components/screens/DashboardScreen';
import PlannerScreen from '@/components/screens/PlannerScreen';
import LiveMapScreen from '@/components/screens/LiveMapScreen';
import DisruptionsScreen from '@/components/screens/DisruptionsScreen';
import HistoryScreen from '@/components/screens/HistoryScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
  { id: 'planner', icon: Route, label: 'PLANNER' },
  { id: 'map', icon: Map, label: 'LIVE MAP' },
  { id: 'alerts', icon: AlertTriangle, label: 'DISRUPTIONS' },
  { id: 'profile', icon: User, label: 'PROFILE' },
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
    <div className="min-h-screen flex w-full bg-bg-base">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] min-h-screen bg-bg-elevated border-r-2 border-border-hard fixed left-0 top-0 z-40">
        <div className="p-6 border-b-2 border-border-hard">
          <h1 className="font-display text-[24px] font-extrabold uppercase text-fc-accent tracking-tight">FLOWCITY</h1>
          <p className="font-mono-label text-[11px] text-text-muted-fc uppercase mt-1">Mumbai Transit Intelligence</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all relative ${
                activeScreen === item.id
                  ? 'bg-bg-inset text-fc-accent'
                  : 'text-text-muted-fc hover:text-text-secondary hover:bg-bg-inset/50'
              }`}
            >
              {activeScreen === item.id && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-fc-accent"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} strokeWidth={2.5} />
              <span className="font-display text-[13px] font-bold uppercase tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t-2 border-border-hard">
          <p className="font-mono-label text-[10px] text-text-muted-fc">FLOWCITY V2.0</p>
          <p className="font-mono-label text-[10px] text-text-muted-fc">MADE IN MUMBAI 🇮🇳</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 lg:ml-[240px] pb-20 lg:pb-0 ${activeScreen === 'map' ? '' : 'overflow-y-auto'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={activeScreen === 'map' ? 'h-[calc(100vh-80px)] lg:h-screen' : ''}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-elevated border-t-2 border-border-hard z-50 flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 relative ${
              activeScreen === item.id ? 'text-fc-accent' : 'text-text-muted-fc'
            }`}
          >
            {activeScreen === item.id && (
              <motion.div
                layoutId="bottomnav-active"
                className="absolute top-0 left-2 right-2 h-[3px] bg-fc-accent"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon size={20} strokeWidth={2.5} />
            <span className="font-mono-label text-[9px] mt-1 uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
