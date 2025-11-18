
import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Offense, User } from '../types';
import Spinner from './Spinner';

const AdminSection: React.FC<{title: string, children: React.ReactNode, delay: string}> = ({title, children, delay}) => (
  <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl shadow-slate-300/20 dark:shadow-black/20 animate-fade-in-up" style={{animationDelay: delay}}>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const GradientButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => (
  <button
    {...props}
    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
  >
    {children}
  </button>
);


const AdminPanel: React.FC = () => {
    const { t } = useTranslation();
    const { 
        users, addUser, deleteUser, updateUser, 
        offenses, addOffense, deleteOffense, updateOffense,
        customChallanFields, addCustomChallanField, deleteCustomChallanField 
    } = useContext(DataContext);

    const [searchTerm, setSearchTerm] = useState('');

    const [showEmployees, setShowEmployees] = useState(false);
    const [showOffenses, setShowOffenses] = useState(false);

    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [newEmployeePassword, setNewEmployeePassword] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editPassword, setEditPassword] = useState('');
    
    const [newOffenseName, setNewOffenseName] = useState('');
    const [newOffenseFine, setNewOffenseFine] = useState('');
    const [editingOffense, setEditingOffense] = useState<Offense | null>(null);
    const [editOffenseName, setEditOffenseName] = useState('');
    const [editOffenseFine, setEditOffenseFine] = useState('');

    const [newCustomFieldName, setNewCustomFieldName] = useState('');

    const filteredEmployees = useMemo(() => 
        users.filter(u => u.role === 'employee' && u.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [users, searchTerm]
    );

    const filteredOffenses = useMemo(() => 
        offenses.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.fine.toString().includes(searchTerm)),
        [offenses, searchTerm]
    );

    const filteredCustomFields = useMemo(() => 
        customChallanFields.filter(f => f.toLowerCase().includes(searchTerm.toLowerCase())),
        [customChallanFields, searchTerm]
    );

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmployeeName.trim() && newEmployeePassword.trim()) {
            addUser({ id: `E${Date.now()}`, name: newEmployeeName.trim(), role: 'employee', password: newEmployeePassword.trim() });
            setNewEmployeeName('');
            setNewEmployeePassword('');
        }
    };
    
    const handleStartEditUser = (user: User) => { setEditingUser(user); setEditName(user.name); setEditPassword(''); };
    const handleCancelEditUser = () => { setEditingUser(null); setEditName(''); setEditPassword(''); };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser && editName.trim()) {
            const updatedData: Partial<User> = { name: editName.trim() };
            if (editPassword.trim()) { updatedData.password = editPassword.trim(); }
            updateUser(editingUser.id, updatedData);
            handleCancelEditUser();
        }
    };
    
    const handleAddOffense = (e: React.FormEvent) => {
        e.preventDefault();
        const fine = parseInt(newOffenseFine, 10);
        if (newOffenseName.trim() && !isNaN(fine) && fine > 0) {
            addOffense({ id: `O${Date.now()}`, name: newOffenseName.trim(), fine });
            setNewOffenseName(''); setNewOffenseFine('');
        }
    };

    const handleStartEditOffense = (offense: Offense) => { setEditingOffense(offense); setEditOffenseName(offense.name); setEditOffenseFine(offense.fine.toString()); };
    const handleCancelEditOffense = () => { setEditingOffense(null); setEditOffenseName(''); setEditOffenseFine(''); };
    
    const handleUpdateOffense = (e: React.FormEvent) => {
        e.preventDefault();
        const fine = parseInt(editOffenseFine, 10);
        if (editingOffense && editOffenseName.trim() && !isNaN(fine) && fine > 0) {
            updateOffense(editingOffense.id, { name: editOffenseName.trim(), fine });
            handleCancelEditOffense();
        }
    };
    
    const handleAddCustomField = (e: React.FormEvent) => {
        e.preventDefault();
        if(newCustomFieldName.trim() && !customChallanFields.includes(newCustomFieldName.trim())) {
            addCustomChallanField(newCustomFieldName.trim());
            setNewCustomFieldName('');
        }
    }
    
    const inputClasses = "w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400";
    const editInputClasses = "w-full bg-slate-200 dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500";
    const toggleButtonClasses = "text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline";

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 animate-fade-in-up">{t('adminPanel')}</h2>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                 <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholderAdmin')}
                    className={`w-full bg-white/80 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-lg shadow-slate-300/20 dark:shadow-black/20`}
                />
            </div>

            <AdminSection title={t('manageEmployees')} delay="0.2s">
                <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} placeholder={t('newEmployeeName')} className={`${inputClasses} sm:col-span-1`} required />
                    <input type="password" value={newEmployeePassword} onChange={e => setNewEmployeePassword(e.target.value)} placeholder={t('password')} className={`${inputClasses} sm:col-span-1`} required />
                    <GradientButton type="submit" className="sm:col-span-1">{t('add')}</GradientButton>
                </form>
                <button onClick={() => setShowEmployees(!showEmployees)} className={toggleButtonClasses}>
                  {showEmployees ? t('hideEmployees') : t('showEmployees')}
                </button>
                {showEmployees && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {filteredEmployees.map(emp => (
                            <div key={emp.id} className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg transition-shadow hover:shadow-md">
                                {editingUser?.id === emp.id ? (
                                    <form onSubmit={handleUpdateUser} className="space-y-3">
                                        <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">{t('editEmployee')}</h4>
                                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder={t('username')} className={editInputClasses} required/>
                                        <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder={t('setNewPassword')} className={editInputClasses} />
                                        <div className="flex gap-2">
                                            <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all text-sm">{t('save')}</button>
                                            <button type="button" onClick={handleCancelEditUser} className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-all text-sm">{t('cancel')}</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-800 dark:text-slate-200 font-medium">{emp.name}</span>
                                        <div className="flex gap-3">
                                            <button onClick={() => handleStartEditUser(emp)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 text-sm font-semibold">{t('edit')}</button>
                                            <button onClick={() => deleteUser(emp.id)} className="text-red-500 hover:text-red-400 text-sm font-semibold">{t('delete')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </AdminSection>

            <AdminSection title={t('manageOffenses')} delay="0.3s">
                <form onSubmit={handleAddOffense} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" value={newOffenseName} onChange={e => setNewOffenseName(e.target.value)} placeholder={t('offenseName')} className={`${inputClasses} sm:col-span-2`} required />
                    <input type="number" value={newOffenseFine} onChange={e => setNewOffenseFine(e.target.value)} placeholder={t('fineAmount')} className={inputClasses} required />
                    <GradientButton type="submit" className="sm:col-span-3">{t('addOffense')}</GradientButton>
                </form>
                <button onClick={() => setShowOffenses(!showOffenses)} className={toggleButtonClasses}>
                    {showOffenses ? t('hideOffenses') : t('showOffenses')}
                </button>
                {showOffenses && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {filteredOffenses.map(off => (
                            <div key={off.id} className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg transition-shadow hover:shadow-md">
                                {editingOffense?.id === off.id ? (
                                    <form onSubmit={handleUpdateOffense} className="space-y-3">
                                        <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">{t('editOffense')}</h4>
                                        <input type="text" value={editOffenseName} onChange={e => setEditOffenseName(e.target.value)} placeholder={t('offenseName')} className={editInputClasses} required />
                                        <input type="number" value={editOffenseFine} onChange={e => setEditOffenseFine(e.target.value)} placeholder={t('fineAmount')} className={editInputClasses} required />
                                        <div className="flex gap-2">
                                            <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all text-sm">{t('save')}</button>
                                            <button type="button" onClick={handleCancelEditOffense} className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-all text-sm">{t('cancel')}</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-800 dark:text-slate-200">{off.name}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-green-600 dark:text-green-400 font-mono text-sm bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded">₹{off.fine}</span>
                                            <button onClick={() => handleStartEditOffense(off)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 text-sm font-semibold">{t('edit')}</button>
                                            <button onClick={() => deleteOffense(off.id)} className="text-red-500 hover:text-red-400 text-sm font-semibold">{t('delete')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </AdminSection>

            <AdminSection title={t('manageCustomFields')} delay="0.4s">
                <form onSubmit={handleAddCustomField} className="flex gap-3">
                    <input type="text" value={newCustomFieldName} onChange={e => setNewCustomFieldName(e.target.value)} placeholder={t('newFieldName')} className={`${inputClasses} flex-grow`} required />
                    <GradientButton type="submit">{t('add')}</GradientButton>
                </form>
                <div className="space-y-2">
                    {filteredCustomFields.map(field => (
                        <div key={field} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{field}</span>
                            <button onClick={() => deleteCustomChallanField(field)} className="text-red-500 hover:text-red-400 text-sm font-semibold">{t('delete')}</button>
                        </div>
                    ))}
                </div>
            </AdminSection>
        </div>
    );
};

export default AdminPanel;