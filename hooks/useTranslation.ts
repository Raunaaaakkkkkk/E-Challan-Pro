import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  const t = (key: keyof typeof translations['en'], options?: { [key: string]: string | number }) => {
    let text = translations[language][key] || translations['en'][key];
    if (options) {
      Object.keys(options).forEach(placeholder => {
        text = text.replace(`{{${placeholder}}}`, String(options[placeholder]));
      });
    }
    return text;
  };

  return { t, language };
};
