
import React, { useContext } from 'react';
import type { Challan } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { DataContext } from '../contexts/DataContext';

interface ChallanReceiptProps {
  challan: Challan;
  onClose: () => void;
}

const ChallanReceipt: React.FC<ChallanReceiptProps> = ({ challan, onClose }) => {
  const { t } = useTranslation();
  const { users } = useContext(DataContext);

  const issuerName = users.find(u => u.id === challan.issuedBy)?.name || 'N/A';
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body > *:not(.printable-area-wrapper) {
            display: none !important;
          }
          .printable-area-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            background-color: white;
            padding-top: 2rem;
          }
          .printable-area {
            transform: scale(1);
            box-shadow: none;
            border: none;
            color: black !important;
          }
          .printable-area * {
            color: black !important;
            background-color: transparent !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 printable-area-wrapper">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl relative animate-fade-in-up">
          <div className="printable-area p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">{t('challanIssued')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">ID: #{challan.id}</p>
            </div>

            <div className="space-y-3 text-sm bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex justify-between">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{t('vehicleNumber')}:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100 font-bold">{challan.vehicleNumber}</span>
                </div>
                {challan.driverName && (
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{t('driverName')}:</span>
                        <span className="text-slate-800 dark:text-slate-100">{challan.driverName}</span>
                    </div>
                )}
                 <div className="flex justify-between">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Date:</span>
                    <span className="text-slate-800 dark:text-slate-100">{new Date(challan.date).toLocaleString()}</span>
                </div>
                {challan.location && (
                    <div className="flex justify-between">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{t('location')}:</span>
                        <span className="text-slate-800 dark:text-slate-100 font-mono">{`${challan.location.latitude.toFixed(4)}, ${challan.location.longitude.toFixed(4)}`}</span>
                    </div>
                )}
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('selectOffenses')}</h3>
              <ul className="space-y-2 text-sm border-t border-b border-slate-200 dark:border-slate-700 py-3">
                {challan.offenses.map(offense => (
                  <li key={offense.id} className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300">{offense.name}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">₹{offense.fine.toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-right pt-2">
              <p className="text-slate-600 dark:text-slate-300 font-medium">{t('totalFine')}:</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">₹{challan.totalFine.toLocaleString('en-IN')}</p>
            </div>

             <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p>Issued by Officer: {issuerName}</p>
            </div>

          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl flex gap-3 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105"
            >
              {t('printChallan')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallanReceipt;