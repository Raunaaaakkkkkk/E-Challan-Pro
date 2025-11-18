import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200 text-sm"
      aria-label="Toggle Language"
    >
      {language === 'en' ? 'हि' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;
