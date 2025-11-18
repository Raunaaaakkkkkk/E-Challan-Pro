
import React, { useContext } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import IssueChallan from './components/IssueChallan';
import VehicleSearch from './components/VehicleSearch';
import RuleBook from './components/RuleBook';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import { AuthContext } from './contexts/AuthContext';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<View>('dashboard');
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'challan':
        return <IssueChallan />;
      case 'search':
        return <VehicleSearch />;
      case 'rules':
        return <RuleBook />;
      case 'admin':
        return currentUser.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };
  
  const gradientStyle = {
    background: 'linear-gradient(120deg, #e0f7fa 0%, #f5eefc 100%)',
    animation: 'gradient-animation 15s ease infinite',
    backgroundSize: '200% 200%',
  };
  
  const keyframes = `
    @keyframes gradient-animation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="flex flex-col h-screen text-slate-800 dark:text-slate-200 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Header />
        <main 
          key={currentView} 
          className="flex-grow overflow-y-auto pb-24 p-4 sm:p-6 animate-fade-in"
          style={document.documentElement.classList.contains('dark') ? {} : gradientStyle}
        >
          {renderView()}
        </main>
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </>
  );
};

export default App;