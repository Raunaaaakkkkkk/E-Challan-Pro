

import React, { useState } from 'react';
import { searchRules } from '../services/geminiService';
import Spinner from './Spinner';
import { useTranslation } from '../hooks/useTranslation';

const RuleBook: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await searchRules(query);
      setResult(searchResult);
    // FIX: Removed invalid arrow function syntax `=>` from the catch block.
    } catch (err) {
      setError(t('ruleBookSearchError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 animate-fade-in-up">{t('searchTrafficRuleBook')}</h2>
      
      <form onSubmit={handleSearch} className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white/80 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-lg shadow-slate-300/20 dark:shadow-black/20 pr-28"
          placeholder={t('ruleBookSearchPlaceholder')}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[90px]"
        >
          {isLoading ? <Spinner /> : t('search')}
        </button>
      </form>

      {error && <div className="bg-red-500/20 text-red-600 p-4 rounded-xl animate-fade-in">{error}</div>}

      {result && (
        <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl shadow-slate-300/20 dark:shadow-black/20 animate-fade-in-up">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{t('searchResultFor')} <span className="text-cyan-600 dark:text-cyan-400">"{query}"</span></h3>
          <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed prose-p:my-2 prose-strong:text-slate-800 dark:prose-strong:text-slate-100">
            {result.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleBook;