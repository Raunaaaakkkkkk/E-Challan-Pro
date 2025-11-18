
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg p-4 flex justify-between items-center sticky top-0 z-20 border-b border-slate-900/10 dark:border-slate-100/10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
        {t('appTitle')}
      </h1>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;