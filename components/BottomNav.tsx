
import React, { useContext, useMemo } from 'react';
import type { View } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import ChallanIcon from './icons/ChallanIcon';
import SearchIcon from './icons/SearchIcon';
import BookIcon from './icons/BookIcon';
import AdminIcon from './icons/AdminIcon';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
}> = ({ label, icon }) => (
  <div className="flex flex-col items-center justify-center w-full transition-colors duration-300 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 relative z-10">
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </div>
);


const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const { currentUser } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const navItems = useMemo(() => {
    const items = [
      { label: t('dashboard'), view: 'dashboard', icon: <DashboardIcon /> },
      { label: t('issueChallan'), view: 'challan', icon: <ChallanIcon /> },
      { label: t('vehicleSearch'), view: 'search', icon: <SearchIcon /> },
      { label: t('ruleBook'), view: 'rules', icon: <BookIcon /> },
    ];
    if (currentUser?.role === 'admin') {
      items.push({ label: t('admin'), view: 'admin', icon: <AdminIcon /> });
    }
    return items;
  }, [currentUser, t]);

  const activeIndex = navItems.findIndex(item => item.view === currentView);
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-t border-slate-900/10 dark:border-slate-100/10 z-20">
       <div className="flex items-center h-full max-w-lg mx-auto relative">
        <div 
          className="absolute top-2 h-14 w-20 bg-cyan-400/20 dark:bg-cyan-400/30 rounded-2xl transition-all duration-300 ease-in-out"
          style={{
            left: `${(activeIndex + 0.5) * (100 / navItems.length)}%`,
            transform: 'translateX(-50%)'
          }}
        />
         {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view as View)}
            className={`flex-1 h-full flex flex-col items-center justify-center transition-colors duration-300 group ${currentView === item.view ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}
            aria-label={item.label}
          >
           <NavItem label={item.label} icon={item.icon} />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;