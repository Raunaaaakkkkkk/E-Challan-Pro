
import React, { useState, useMemo, useContext } from 'react';
import type { Offense, Challan } from '../types';
import useGeolocation from '../hooks/useGeolocation';
import { suggestOffenses } from '../services/geminiService';
import Spinner from './Spinner';
import { DataContext } from '../contexts/DataContext';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import ChallanReceipt from './ChallanReceipt';

const FormSection: React.FC<{title: string, children: React.ReactNode, delay: string}> = ({title, children, delay}) => (
  <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg shadow-slate-300/20 dark:shadow-black/20 animate-fade-in-up" style={{animationDelay: delay}}>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ModernInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
    />
  </div>
);

const ModernTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({label, ...props}) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <textarea
      {...props}
      className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
    />
  </div>
);

const GradientButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => (
  <button
    {...props}
    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
  >
    {children}
  </button>
);


const IssueChallan: React.FC = () => {
  const { t } = useTranslation();
  const { offenses, addChallan, customChallanFields } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [photoEvidence, setPhotoEvidence] = useState<string | undefined>();
  const [selectedOffenses, setSelectedOffenses] = useState<Offense[]>([]);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: string }>({});
  const [issuedChallan, setIssuedChallan] = useState<Challan | null>(null);
  const location = useGeolocation();

  const totalFine = useMemo(() => {
    return selectedOffenses.reduce((sum, offense) => sum + offense.fine, 0);
  }, [selectedOffenses]);

  const handleOffenseToggle = (offense: Offense) => {
    setSelectedOffenses(prev =>
      prev.some(o => o.id === offense.id)
        ? prev.filter(o => o.id !== offense.id)
        : [...prev, offense]
    );
  };

  const handleSuggestOffenses = async () => {
    if (!incidentDescription) return;
    setIsSuggesting(true);
    try {
      const suggested = await suggestOffenses(incidentDescription, offenses);
      setSelectedOffenses(suggested);
    } catch (error) {
      console.error("Error suggesting offenses:", error);
      alert(t('errorSuggestingOffenses'));
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert(t('photoSizeError'));
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoEvidence(reader.result as string);
      };
      reader.onerror = () => {
          alert(t('photoReadError'));
          setPhotoEvidence(undefined);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldName]: value }));
  };
  
  const resetForm = () => {
    setVehicleNumber('');
    setDriverName('');
    setSelectedOffenses([]);
    setIncidentDescription('');
    setPhotoEvidence(undefined);
    setCustomFieldValues({});
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newChallan: Challan = {
        id: `C${Date.now()}`.slice(0, 8),
        vehicleNumber,
        driverName,
        driverLicense: 'DL' + Math.random().toString().slice(2, 12),
        offenses: selectedOffenses,
        totalFine,
        location: location.latitude && location.longitude ? {latitude: location.latitude, longitude: location.longitude} : null,
        date: new Date().toISOString(),
        photoEvidence,
        issuedBy: currentUser.id,
        customFields: customFieldValues
    };
    
    addChallan(newChallan);
    setIssuedChallan(newChallan);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 animate-fade-in-up">{t('issueNewChallan')}</h2>

        <FormSection title={t('vehicleAndDriverDetails')} delay="0.1s">
            <ModernInput
              label={t('vehicleNumber')}
              type="text"
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder={t('vehicleNumberPlaceholder')}
              required
            />
            <ModernInput
              label={t('driverName')}
              type="text"
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder={t('driverNamePlaceholder')}
            />
             {customChallanFields.map(field => (
                <ModernInput
                  key={field}
                  label={field}
                  type="text"
                  id={`custom-${field}`}
                  value={customFieldValues[field] || ''}
                  onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                  placeholder={`${t('enter')} ${field}`}
                />
            ))}
        </FormSection>
        
        <FormSection title={t('evidenceAndDescription')} delay="0.2s">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{t('photoEvidence')}</label>
              <div className="flex items-center gap-4">
                  <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  <label htmlFor="photo-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H5.5z" /><path d="M9 13l3-3m0 0l3 3m-3-3v12" />
                    </svg>
                    {photoEvidence ? t('changePhoto') : t('uploadPhoto')}
                  </label>
                  {photoEvidence && (
                      <div className="relative group">
                          <img src={photoEvidence} alt="Evidence Preview" className="h-20 w-28 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-600" />
                          <button
                              type="button"
                              onClick={() => setPhotoEvidence(undefined)}
                              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold transition-transform transform hover:scale-110 opacity-0 group-hover:opacity-100"
                              aria-label={t('removePhoto')}
                          >
                              &times;
                          </button>
                      </div>
                  )}
              </div>
            </div>
            <ModernTextarea
              label={t('incidentDescription')}
              id="incidentDescription"
              rows={3}
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              placeholder={t('incidentDescriptionPlaceholder')}
            />
            <button
              type="button"
              onClick={handleSuggestOffenses}
              disabled={isSuggesting || !incidentDescription}
              className="mt-2 w-full flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-800 text-cyan-300 font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSuggesting ? <><Spinner /> {t('suggesting')}</> : <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>{t('getAISuggestions')}</>}
            </button>
        </FormSection>
        
        <FormSection title={t('selectOffenses')} delay="0.3s">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {offenses.map(offense => (
                <div
                  key={offense.id}
                  onClick={() => handleOffenseToggle(offense)}
                  className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${selectedOffenses.some(o => o.id === offense.id) ? 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500 dark:border-cyan-400 shadow-md' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-cyan-400 dark:hover:border-cyan-500'}`}
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{offense.name}</span>
                  <span className={`text-sm font-bold transition-colors ${selectedOffenses.some(o => o.id === offense.id) ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}>₹{offense.fine}</span>
                </div>
              ))}
            </div>
        </FormSection>

        <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-2xl space-y-4 shadow-lg shadow-slate-300/20 dark:shadow-black/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center text-xl">
              <span className="font-bold text-slate-800 dark:text-slate-100">{t('totalFine')}:</span>
              <span className="font-bold text-3xl text-green-600 dark:text-green-400 tracking-tight">₹{totalFine.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
              {location.loading ? t('fetchingLocation') : location.error ? `${t('locationError')}: ${location.error}` : <span className="font-mono">{`📍 ${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`}</span>}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <GradientButton
            type="submit"
            disabled={!vehicleNumber || selectedOffenses.length === 0}
          >
            {t('issueChallan')}
          </GradientButton>
        </div>
      </form>

      {issuedChallan && (
        <ChallanReceipt 
          challan={issuedChallan} 
          onClose={() => {
            setIssuedChallan(null);
            resetForm();
          }} 
        />
      )}
    </>
  );
};

export default IssueChallan;