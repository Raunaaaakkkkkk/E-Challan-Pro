
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';

const useCountUp = (end: number, duration: number = 1.5) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const startTimestamp = performance.now();
        const step = (timestamp: number) => {
            const progress = (timestamp - startTimestamp) / (duration * 1000);
            if (progress < 1) {
                setCount(Math.floor(end * progress));
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(step);
    }, [end, duration]);

    return count;
};

const StatCard: React.FC<{ title: string; value: number; prefix?: string; color: string; icon: React.ReactNode }> = ({ title, value, prefix = '', color, icon }) => {
    const animatedValue = useCountUp(value);
    
    return (
        <div className="bg-white/80 dark:bg-slate-800/50 p-5 rounded-2xl shadow-lg shadow-slate-300/20 dark:shadow-black/20 flex items-center gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-cyan-200/50 dark:hover:shadow-cyan-500/30">
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{prefix}{animatedValue.toLocaleString('en-IN')}</p>
            </div>
        </div>
    );
}

const Dashboard: React.FC = () => {
    const { currentUser } = useContext(AuthContext);
    const { challans, users } = useContext(DataContext);
    const { t } = useTranslation();

    const userChallans = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === 'admin') {
            return challans;
        }
        return challans.filter(c => c.issuedBy === currentUser.id);
    }, [challans, currentUser]);

    const totalFine = userChallans.reduce((sum, c) => sum + c.totalFine, 0);
    const highRiskOffensesCount = userChallans.filter(c => c.totalFine >= 5000).length;

    const getIssuerName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown';

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 animate-fade-in-up">
            {currentUser?.role === 'admin' ? t('adminDashboardTitle') : <>{t('welcome')}, <span className="text-cyan-600 dark:text-cyan-400">{currentUser?.name}</span></>}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <div style={{animationDelay: '0.1s'}} className="animate-fade-in-up">
              <StatCard title={t('totalChallansIssued')} value={userChallans.length} color="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
            </div>
             <div style={{animationDelay: '0.2s'}} className="animate-fade-in-up">
                <StatCard title={t('totalFineCollected')} value={totalFine} prefix="₹" color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            </div>
            <div style={{animationDelay: '0.3s'}} className="animate-fade-in-up">
                <StatCard title={t('highRiskOffenses')} value={highRiskOffensesCount} color="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
            </div>
            {currentUser?.role === 'admin' && (
                 <div style={{animationDelay: '0.4s'}} className="animate-fade-in-up">
                    <StatCard title={t('totalEmployees')} value={users.filter(u => u.role === 'employee').length} color="bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                </div>
            )}
        </div>

        <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg shadow-slate-300/20 dark:shadow-black/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('recentActivity')}</h3>
            <ul className="space-y-3">
                {userChallans.slice(0, 5).map((challan, index) => (
                    <li key={challan.id} className="flex flex-wrap justify-between items-center text-sm gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0 animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{challan.vehicleNumber}</span>
                             <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(challan.date).toLocaleString()}</span>
                        </div>
                        {currentUser?.role === 'admin' && <span className="text-xs font-medium text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{getIssuerName(challan.issuedBy)}</span>}
                        <span className="font-bold text-green-600 dark:text-green-400 text-base">{`₹${challan.totalFine}`}</span>
                    </li>
                ))}
                {userChallans.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-4">{t('noRecentActivity')}</p>}
            </ul>
        </div>
    </div>
  );
};

export default Dashboard;