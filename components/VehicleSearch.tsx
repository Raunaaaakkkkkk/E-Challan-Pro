
import React, { useState } from 'react';
import { getVehicleInfo } from '../services/geminiService';
import type { VehicleInfo } from '../types';
import Spinner from './Spinner';
import { useTranslation } from '../hooks/useTranslation';

const StatusBadge: React.FC<{ status: 'Active' | 'Expired' }> = ({ status }) => {
  const { t } = useTranslation();
  const isActive = status === 'Active';
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${isActive ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}>
      {t(status.toLowerCase() as 'active' | 'expired')}
    </span>
  );
};

const VehicleSearch: React.FC = () => {
  const { t } = useTranslation();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber) return;

    setIsLoading(true);
    setError(null);
    setVehicleInfo(null);

    try {
      const info = await getVehicleInfo(vehicleNumber);
      setVehicleInfo(info);
    } catch (err) {
      setError(t('vehicleSearchError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 animate-fade-in-up">{t('vehicleInfoLookup')}</h2>
      
      <form onSubmit={handleSearch} className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
          className="w-full bg-white/80 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-lg shadow-slate-300/20 dark:shadow-black/20 pr-28"
          placeholder={t('enterVehicleNumber')}
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

      {vehicleInfo && (
        <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl shadow-slate-300/20 dark:shadow-black/20 animate-fade-in-up">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
             <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{vehicleInfo.vehicleModel}</h3>
             <p className="font-mono text-cyan-600 dark:text-cyan-400">{vehicleNumber}</p>
          </div>
         
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{t('ownerName')}:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-base">{vehicleInfo.ownerName}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{t('registrationDate')}:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{vehicleInfo.registrationDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{t('insuranceStatus')}:</span>
              <StatusBadge status={vehicleInfo.insuranceStatus} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{t('pucStatus')}:</span>
              <StatusBadge status={vehicleInfo.pucStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;