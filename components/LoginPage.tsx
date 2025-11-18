
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Role } from '../types';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('employee');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, role, password);
        if (!success) {
            setError(t('loginError'));
        }
    };
    
    const inputClasses = "w-full bg-slate-100/50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400";
    
    return (
        <div className="flex items-center justify-center h-screen p-4 bg-slate-100 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-sky-900 to-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl shadow-slate-300/40 dark:shadow-black/40 animate-fade-in-up">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
                      {t('appTitle')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('welcomeMessage')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{t('role')}</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                             className={inputClasses}
                        >
                            <option value="employee">{t('employee')}</option>
                            <option value="admin">{t('admin')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{t('username')}</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputClasses}
                            placeholder={t('enterUsername')}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{t('password')}</label>
                        <input
                            type="password"
                            id="password"
                             value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClasses}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-center font-semibold text-red-500 animate-shake">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                       {t('login')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;